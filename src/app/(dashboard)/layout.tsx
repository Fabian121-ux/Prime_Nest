
'use client';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import DashboardHeader from "@/components/layout/dashboard-header";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import type { ReactNode } from "react";
import SupportPopup from "@/components/demo/support-popup";
import { Skeleton } from "@/components/ui/skeleton";


function DashboardUI({ children }: { children: ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const userRole = (userData as any)?.rolePrimary;
    
    const isLoading = isUserLoading || isUserDataLoading;

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
                 <SupportPopup />
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
