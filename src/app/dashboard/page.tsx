"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Building, Hammer, MessageSquare, ShieldCheck, User as UserIcon, Loader2, ArrowRight, Briefcase, FileText, Wrench } from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doc, DocumentData } from "firebase/firestore";

const mockData = {
  listings: [
    { id: '1', title: 'Cozy 2-Bedroom Apartment', status: 'Approved' },
    { id: '3', title: 'Modern Studio with a View', status: 'Pending' },
  ],
  services: [
    { id: '2', title: 'Expert Plumbing Services', status: 'Approved' },
  ],
  transactions: [
    { id: 't1', listingTitle: 'Cozy 2-Bedroom Apartment', with: 'Jane Smith', status: 'held', amount: 1200000 },
    { id: 't2', listingTitle: 'Expert Plumbing Services', with: 'Mark Johnson', status: 'released', amount: 5000 },
  ],
};

const TenantDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3 lg:col-span-1">
        <CardHeader className="bg-green-600 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-2"><UserIcon/> Tenant Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
           <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground"/> Browse Rentals</li>
                <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground"/> My Leases</li>
                <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-muted-foreground"/> Maintenance Requests</li>
           </ul>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-primary-foreground">
                View Properties <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">For Tenants</p>
        </CardContent>
    </Card>
);

const LandlordDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3 lg:col-span-1">
        <CardHeader className="bg-orange-500 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-2"><Building/> Landlord Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground"/> My Properties</li>
                <li className="flex items-center gap-2"><UserIcon className="h-4 w-4 text-muted-foreground"/> Tenant Requests</li>
                <li className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/> Income Overview</li>
           </ul>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-primary-foreground">
                Manage Listings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">For Landlords</p>
        </CardContent>
    </Card>
);


const ArtisanDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3 lg:col-span-1">
        <CardHeader className="bg-yellow-500 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-2"><Hammer/> Artisan Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/> Available Jobs</li>
                    <li className="flex items-center gap-2"><span className="font-bold text-muted-foreground text-lg">$</span> Earnings: $540</li>
                    <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-muted-foreground"/> My Services</li>
            </ul>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-primary-foreground">
                Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">For Artisans</p>
        </CardContent>
    </Card>
);

const AdminDashboard = () => (
    <Card className="bg-card border-none col-span-1 md:col-span-3">
        <CardHeader className="bg-red-600 text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline flex items-center gap-2"><ShieldCheck/> Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2"><UserIcon className="h-4 w-4 text-muted-foreground"/> User Approvals</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground"/> Escrow Controls</div>
                <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/> Site Analytics</div>
            </div>
            <div className="mt-6 text-center">
                 <Button asChild className="bg-red-600 hover:bg-red-700 text-primary-foreground">
                    <Link href="/admin">Go to Admin</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-2">For Admins Only</p>
            </div>
        </CardContent>
    </Card>
)

const DashboardCards = ({ role }: { role: string }) => {
    if (!role) {
        return null;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    <div className="space-y-8">
        <DashboardCards role={role} />
        {role === 'admin' && <AdminDashboard />}
    </div>
  );
}
