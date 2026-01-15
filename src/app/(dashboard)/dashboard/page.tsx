
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon, Briefcase, FileText, Wrench, Building, Shield, ArrowRight, Loader2, Home, BarChart, Wallet, Hammer } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Tenant Dashboard
const TenantDashboard = () => (
  <Card className="bg-card border-none shadow-md">
    <CardHeader className="bg-green-600 text-primary-foreground rounded-t-lg">
      <CardTitle className="flex items-center gap-3 font-headline"><Home className="h-5 w-5"/> Tenant Dashboard</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-6">
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2"><Building className="h-4 w-4"/> Browse Rentals</li>
        <li className="flex items-center gap-2"><FileText className="h-4 w-4"/> My Leases</li>
        <li className="flex items-center gap-2"><Wrench className="h-4 w-4"/> Maintenance Requests</li>
      </ul>
      <Button className="w-full bg-green-600 hover:bg-green-700 text-primary-foreground mt-2">View Properties</Button>
    </CardContent>
  </Card>
);

// Landlord Dashboard
const LandlordDashboard = () => (
  <Card className="bg-card border-none shadow-md">
    <CardHeader className="bg-orange-500 text-primary-foreground rounded-t-lg">
      <CardTitle className="flex items-center gap-3 font-headline"><Building className="h-5 w-5"/> Landlord Dashboard</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-6">
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2"><FileText className="h-4 w-4"/> My Properties</li>
        <li className="flex items-center gap-2"><UserIcon className="h-4 w-4"/> Tenant Requests</li>
        <li className="flex items-center gap-2"><BarChart className="h-4 w-4"/> Income Overview</li>
      </ul>
      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-primary-foreground mt-2 flex items-center justify-center gap-1">
        Manage Listings <ArrowRight className="h-4 w-4"/>
      </Button>
    </CardContent>
  </Card>
);

// Artisan Dashboard
const ArtisanDashboard = () => (
  <Card className="bg-card border-none shadow-md">
    <CardHeader className="bg-yellow-500 text-primary-foreground rounded-t-lg">
      <CardTitle className="flex items-center gap-3 font-headline"><Wrench className="h-5 w-5"/> Artisan Dashboard</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-6">
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2"><Briefcase className="h-4 w-4"/> Available Jobs</li>
        <li className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Earnings: ₦250,000</li>
        <li className="flex items-center gap-2"><Hammer className="h-4 w-4"/> My Services</li>
      </ul>
      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-primary-foreground mt-2 flex items-center justify-center gap-1">
        Find Jobs <ArrowRight className="h-4 w-4"/>
      </Button>
    </CardContent>
  </Card>
);

// Admin Dashboard
const AdminDashboard = () => (
  <Card className="bg-card border-none shadow-md col-span-full">
    <CardHeader className="bg-red-600 text-primary-foreground rounded-t-lg">
      <CardTitle className="flex items-center gap-3 font-headline"><UserIcon className="h-5 w-5"/> Admin Panel</CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500"/> User Approvals</div>
        <div className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Escrow Controls</div>
        <div className="flex items-center gap-2"><BarChart className="h-4 w-4"/> Site Analytics</div>
      </div>
      <div className="mt-6 text-center">
        <Button asChild className="bg-red-600 hover:bg-red-700 text-primary-foreground">
          <Link href="/admin" className="flex items-center justify-center gap-1">
            Go to Admin <ArrowRight className="h-4 w-4"/>
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const DashboardCards = ({ role }: { role: string | null }) => {
  if (!role) return null;

  const gridClasses = role === "admin" 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClasses}>
      {role === 'tenant' && <TenantDashboard />}
      {role === 'landlord' && <LandlordDashboard />}
      {role === 'artisan' && <ArtisanDashboard />}
      {role === 'admin' && (
        <>
          <TenantDashboard />
          <LandlordDashboard />
          <ArtisanDashboard />
          <AdminDashboard />
        </>
      )}
    </div>
  );
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
    // Wait until the initial user loading is complete
    if (!isUserLoading && !user) {
      // If loading is done and there's no user, redirect to login
      router.push('/login');
    }
  }, [user, isUserLoading, router]);


  const isLoading = isUserLoading || isUserDocLoading;
  const userRole = userData?.rolePrimary;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.displayName || user?.email || 'User'}!</p>
      </div>
      <div className="space-y-6">
          <DashboardCards role={userRole} />
      </div>
      
      {userRole === 'admin' && (
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3"><Shield /> Admin Panel</h2>
          <Card>
              <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>High-level statistics and management tools.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p>Admin-specific components for user management, listings approval, and more will be displayed here.</p>
              </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
