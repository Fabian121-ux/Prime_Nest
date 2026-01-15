
'use client';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import DashboardHeader from "@/components/layout/dashboard-header";
import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { useEffect, useState, type ReactNode } from "react";
import SupportPopup from "@/components/demo/support-popup";
import { Skeleton } from "@/components/ui/skeleton";
import { demoTeamEmails } from "@/lib/demo-config";


function DashboardUI({ children }: { children: ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [showSupportPopup, setShowSupportPopup] = useState(false);
    const [isCheckingResponse, setIsCheckingResponse] = useState(true);


    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const userRole = (userData as any)?.rolePrimary;
    
    useEffect(() => {
        const checkResponse = async () => {
            if (user && firestore) {
                 setIsCheckingResponse(true);
                // Gating logic: only show for specified demo users
                const isDemoUser = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || demoTeamEmails.includes(user.email || '');

                if (!isDemoUser) {
                    setShowSupportPopup(false);
                    setIsCheckingResponse(false);
                    return;
                }

                // Check if user has already responded
                const responsesRef = collection(firestore, 'support_demo_responses');
                const q = query(responsesRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    setShowSupportPopup(true);
                } else {
                    setShowSupportPopup(false);
                }
                setIsCheckingResponse(false);
            } else if (!isUserLoading) {
                // If there's no user and we are not loading, don't show popup
                setIsCheckingResponse(false);
            }
        };
        checkResponse();
    }, [user, firestore, isUserLoading]);


    const handleClosePopup = () => {
        setShowSupportPopup(false);
    };

    const isLoading = isUserLoading || isUserDataLoading || isCheckingResponse;

    return (
        <>
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
                 {user && showSupportPopup && (
                    <SupportPopup user={user} onClose={handleClosePopup} />
                )}
            </SidebarInset>
        </>
    );
}

function DashboardMainContent({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <DashboardUI>{children}</DashboardUI>
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
