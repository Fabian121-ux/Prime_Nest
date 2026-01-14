"use client"; // Needs to be client to get user role for demo

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Building, Hammer, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Mock user, to be replaced with auth context
// Switch role to 'tenant', 'landlord', 'artisan', 'admin' to test views
const user = { role: 'landlord' }; 

const mockData = {
  listings: [
    { id: '1', title: 'Cozy 2-Bedroom Apartment', status: 'Approved' },
    { id: '3', title: 'Modern Studio with a View', status: 'Pending' },
  ],
  services: [
    { id: '2', title: 'Expert Plumbing Services', status: 'Approved' },
  ],
  transactions: [
    { id: 't1', listingTitle: 'Cozy 2-Bedroom Apartment', with: 'Jane Smith', status: 'held', amount: 1200 },
    { id: 't2', listingTitle: 'Expert Plumbing Services', with: 'Mark Johnson', status: 'released', amount: 50 },
  ],
};

const TenantDashboard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="font-headline">Welcome, Tenant!</CardTitle>
      <CardDescription>Find your next home here. Browse available listings.</CardDescription>
    </CardHeader>
    <CardContent className="text-center py-12">
      <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">You're all set to find a place to stay.</p>
      <Button asChild>
        <Link href="/#explore">
          Explore Properties
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const LandlordDashboard = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold font-headline">Landlord Dashboard</h1>
        <p className="text-muted-foreground">Manage your properties and tenant interactions.</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Property
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>My Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockData.listings.map(item => (
            <li key={item.id} className="flex justify-between items-center p-3 rounded-md border">
              <span className="font-medium">{item.title}</span>
              <Badge variant={item.status === 'Approved' ? 'secondary' : 'outline'}>{item.status}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    <EscrowSection />
  </div>
);

const ArtisanDashboard = () => (
    <div className="space-y-8">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold font-headline">Artisan Dashboard</h1>
        <p className="text-muted-foreground">Manage your services and client interactions.</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Service
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>My Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockData.services.map(item => (
            <li key={item.id} className="flex justify-between items-center p-3 rounded-md border">
              <span className="font-medium">{item.title}</span>
              <Badge variant={item.status === 'Approved' ? 'secondary' : 'outline'}>{item.status}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    <EscrowSection />
  </div>
);

const EscrowSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Active Transactions</CardTitle>
      <CardDescription>Monitor your escrow payments.</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4">
        {mockData.transactions.map(tx => (
          <li key={tx.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-md border gap-4">
            <div className="flex-1">
              <p className="font-semibold">{tx.listingTitle}</p>
              <p className="text-sm text-muted-foreground">With: {tx.with}</p>
            </div>
            <div className="flex items-center gap-4">
               <p className="font-semibold text-lg">${tx.amount}</p>
               <EscrowStatusTracker status={tx.status as any} />
               <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4"/>
                <span className="sr-only">Chat</span>
               </Button>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const EscrowStatusTracker = ({ status }: { status: 'initiated' | 'held' | 'released' }) => {
    const statuses = [
        { name: 'Initiated', key: 'initiated' },
        { name: 'Held', key: 'held' },
        { name: 'Released', key: 'released' },
    ];
    const currentIndex = statuses.findIndex(s => s.key === status);

    return (
        <div className="flex items-center space-x-2" title={`Status: ${status}`}>
            {statuses.map((s, index) => (
                <div key={s.key} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${index <= currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    {index < statuses.length - 1 && <div className={`h-0.5 w-8 transition-colors ${index < currentIndex ? 'bg-primary' : 'bg-border'}`} />}
                </div>
            ))}
        </div>
    );
};


export default function DashboardPage() {
  // This logic will come from an Auth Context in a real app
  const { role } = user;

  if (role === 'tenant') {
    return <TenantDashboard />;
  }
  if (role === 'landlord') {
    return <LandlordDashboard />;
  }
  if (role === 'artisan') {
    return <ArtisanDashboard />;
  }
  
  // Fallback for Admin or other roles
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Welcome, Administrator!</CardTitle>
        <CardDescription>You can manage the platform from the admin panel.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        <p>Your role is: {role}</p>
        <Button asChild>
            <Link href="/admin">Go to Admin Panel</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
