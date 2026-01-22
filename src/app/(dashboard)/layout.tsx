
'use client';
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import DashboardHeader from "@/components/layout/dashboard-header";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import React, { type ReactNode, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";


function DashboardUI({ children }: { children: ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [isUserLoading, user, router]);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const userRole = (userData as any)?.rolePrimary;
    
    const isLoading = isUserLoading || isUserDataLoading || !isClient;

    if (isLoading) {
        return ( // Full page loading skeleton
             <div className="flex h-screen w-full bg-background">
                {/* Sidebar Skeleton */}
                <div className="hidden md:flex flex-col gap-2 p-4 w-16 md:w-64 border-r bg-card">
                    <div className="p-2">
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="p-2 space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                {/* Main Content Skeleton */}
                <div className="flex-1 flex flex-col">
                    <header className="sticky top-0 z-30 w-full border-b h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-card">
                       <Skeleton className="h-8 w-8" />
                        <div className="flex items-center gap-2">
                           <Skeleton className="h-8 w-24" />
                           <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    </header>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                         <Skeleton className="h-96 w-full" />
                    </main>
                </div>
            </div>
        )
    }

    if (!user) {
        // This can be a brief state before the redirect effect kicks in.
        return null;
    }

    return (
        <>
            <Sidebar>
                <DashboardSidebar userRole={userRole} />
            </Sidebar>
            <SidebarInset>
                <div className="relative z-10 flex flex-col h-full">
                    <DashboardHeader userRole={userRole} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-transparent overflow-y-auto">
                        <div className="max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </>
    );
}

function DashboardMainContent({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
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
