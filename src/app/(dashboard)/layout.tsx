
'use client';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import DashboardHeader from "@/components/layout/dashboard-header";
import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { useEffect, useState } from "react";
import SupportPopup from "@/components/demo/support-popup";
import { Skeleton } from "@/components/ui/skeleton";
import { demoTeamEmails } from "@/lib/demo-config";

function DashboardMainContent({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [showSupportPopup, setShowSupportPopup] = useState(false);
    const [hasResponded, setHasResponded] = useState<boolean | null>(null);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const userRole = (userData as any)?.rolePrimary;
    const { setOpenMobile } = useSidebar();
    
    useEffect(() => {
        const checkResponse = async () => {
            if (user && firestore && hasResponded === null) {
                // Gating logic
                const isDemoUser = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || demoTeamEmails.includes(user.email || '');
                if (!isDemoUser) {
                    setHasResponded(true); // Don't show popup for non-demo users
                    return;
                }

                const responsesRef = collection(firestore, 'support_demo_responses');
                const q = query(responsesRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const userHasResponded = !querySnapshot.empty;
                setHasResponded(userHasResponded);
                if (!userHasResponded) {
                    setShowSupportPopup(true);
                }
            }
        };
        checkResponse();
    }, [user, firestore, hasResponded]);


    const handleClosePopup = () => {
        setShowSupportPopup(false);
        setHasResponded(true); // Assume they responded so we don't show it again this session
    };

    const isLoading = isUserLoading || isUserDataLoading || hasResponded === null;

    return (
        <SidebarProvider defaultOpen={false}>
            <Sidebar>
                 {isLoading ? (
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <DashboardSidebar userRole={userRole} />
                )}
            </Sidebar>
            <SidebarInset>
                <DashboardHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                    {children}
                </main>
                 {user && showSupportPopup && !hasResponded && (
                    <SupportPopup user={user} onClose={handleClosePopup} />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return <DashboardMainContent>{children}</DashboardMainContent>;
}
