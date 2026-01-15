"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, Briefcase, Building, FileText, Hammer, Home, Loader2, ShieldCheck, User as UserIcon, Wallet, Wrench } from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doc } from "firebase/firestore";

const TenantDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3 lg:col-span-1 shadow-md">
        <CardHeader className="bg-green-600 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-3"><Home className="h-5 w-5"/> Tenant Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
           <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><Building className="h-4 w-4"/> Browse Rentals</li>
                <li className="flex items-center gap-3"><FileText className="h-4 w-4"/> My Leases</li>
                <li className="flex items-center gap-3"><Wrench className="h-4 w-4"/> Maintenance Requests</li>
           </ul>
           <div className="pt-2">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-primary-foreground">
                View Properties
            </Button>
            <p className="text-xs text-muted-foreground/80 text-center pt-3">For Tenants</p>
           </div>
        </CardContent>
    </Card>
);

const LandlordDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3 lg:col-span-1 shadow-md">
        <CardHeader className="bg-orange-500 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-3"><Building className="h-5 w-5"/> Landlord Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><FileText className="h-4 w-4"/> My Properties</li>
                <li className="flex items-center gap-3"><UserIcon className="h-4 w-4"/> Tenant Requests</li>
                <li className="flex items-center gap-3"><BarChart className="h-4 w-4"/> Income Overview</li>
           </ul>
           <div className="pt-2">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-primary-foreground">
                Manage Listings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground/80 text-center pt-3">For Landlords</p>
           </div>
        </CardContent>
    </Card>
);


const ArtisanDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3 lg:col-span-1 shadow-md">
        <CardHeader className="bg-yellow-500 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-3"><Wrench className="h-5 w-5"/> Artisan Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3"><Briefcase className="h-4 w-4"/> Available Jobs</li>
                    <li className="flex items-center gap-3"><Wallet className="h-4 w-4"/> Earnings: ₦540,000</li>
                    <li className="flex items-center gap-3"><Hammer className="h-4 w-4"/> My Services</li>
            </ul>
            <div className="pt-2">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-primary-foreground">
                    Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground/80 text-center pt-3">For Artisans</p>
            </div>
        </CardContent>
    </Card>
);

const AdminDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3 shadow-md">
        <CardHeader className="bg-red-600 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-3"><UserIcon className="h-5 w-5"/> Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center md:text-left text-sm text-muted-foreground">
                <div className="flex items-center justify-center md:justify-start gap-3"><ShieldCheck className="h-4 w-4 text-green-500"/> User Approvals</div>
                <div className="flex items-center justify-center md:justify-start gap-3"><Wallet className="h-4 w-4"/> Escrow Controls</div>
                <div className="flex items-center justify-center md:justify-start gap-3"><BarChart className="h-4 w-4"/> Site Analytics</div>
            </div>
            <div className="mt-6 text-center">
                 <Button asChild className="bg-red-600 hover:bg-red-700 text-primary-foreground">
                    <Link href="/admin">Go to Admin <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
                <p className="text-xs text-muted-foreground/80 text-center pt-3">For Admins Only</p>
            </div>
        </CardContent>
    </Card>
)

const DashboardCards = ({ role }: { role: string | null }) => {
    if (!role) {
        return null;
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {role === 'tenant' && <TenantDashboard />}
            {role === 'landlord' && <LandlordDashboard />}
            {role === 'artisan' && <ArtisanDashboard />}
            {role === 'admin' ? (
                <>
                    <TenantDashboard />
                    <ArtisanDashboard />
                    <LandlordDashboard />
                </>
            ) : null}
        </div>
    )
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Only redirect if loading is complete and there's no user.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isUserDocLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  const role = userData ? (userData as any).rolePrimary : null;

  return (
    <div className="space-y-6">
        <DashboardCards role={role} />
        {role === 'admin' && <AdminDashboard />}
    </div>
  );
}
