
'use client';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import DashboardHeader from "@/components/layout/dashboard-header";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import React, { type ReactNode, useState, useEffect, useCallback } from "react";
import SupportPopup from "@/components/demo/support-popup";
import { Skeleton } from "@/components/ui/skeleton";
import { demoTeamEmails } from "@/lib/demo-config";


function DashboardUI({ children }: { children: ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const [showSupportPopup, setShowSupportPopup] = useState(false);
    const [shouldCheckPopup, setShouldCheckPopup] = useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const userRole = (userData as any)?.rolePrimary;
    
    const isLoading = isUserLoading || isUserDataLoading;

    const checkAndTriggerPopup = useCallback(async () => {
        if (isUserLoading || !user || !firestore) {
            return false;
        }

        const isDemoUser = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || demoTeamEmails.includes(user.email || '');
        if (!isDemoUser) {
            return false;
        }

        const responsesRef = collection(firestore, 'support_demo_responses');
        const q = query(responsesRef, where("uid", "==", user.uid));
        
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setShowSupportPopup(true); // User has not responded, show popup.
                return true;
            }
        } catch (error) {
            console.error("Error checking for support response:", error);
        }
        return false;
    }, [user, isUserLoading, firestore]);

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
                <DashboardHeader onSidebarTrigger={checkAndTriggerPopup} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                    {children}
                </main>
                 <SupportPopup isOpen={showSupportPopup} onOpenChange={setShowSupportPopup} />
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
