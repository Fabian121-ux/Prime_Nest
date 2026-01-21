'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, Building, Hammer } from "lucide-react";
import DashboardHeader from "@/components/layout/dashboard-header";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { useEffect, useState } from "react";

const mockUsers = [
  { id: 'u1', email: 'tenant@example.com', role: 'tenant', status: 'Approved' },
  { id: 'u2', email: 'landlord@example.com', role: 'landlord', status: 'Pending' },
  { id: 'u3', email: 'artisan@example.com', role: 'artisan', status: 'Approved' },
];

const mockListings = [
  { id: 'l1', title: 'Cozy 2-Bedroom Apartment', type: 'property', creator: 'landlord@example.com', status: 'Pending' },
  { id: 'l2', title: 'Expert Plumbing Services', type: 'service', creator: 'artisan@example.com', status: 'Approved' },
  { id: 'l3', title: 'Modern Studio with a View', type: 'property', creator: 'anotherlandlord@example.com', status: 'Approved' },
];

const mockEscrow = [
  { id: 'e1', listing: 'Cozy 2-Bedroom Apartment', amount: 1200000, status: 'held', tenant: 'tenant@example.com' },
  { id: 'e2', listing: 'Expert Plumbing Services', amount: 50000, status: 'released', tenant: 'client@example.com' },
  { id: 'e3', title: 'Modern Studio with a View', amount: 850000, status: 'initiated', tenant: 'another-tenant@example.com' },
];

const RoleIcon = ({ role }: { role: string }) => {
    switch (role) {
        case 'tenant': return <User className="h-4 w-4 text-muted-foreground" />;
        case 'landlord': return <Building className="h-4 w-4 text-muted-foreground" />;
        case 'artisan': return <Hammer className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
}

export default function AdminPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
      <SidebarProvider>
        <Sidebar>
            <DashboardSidebar userRole="admin" />
        </Sidebar>
        <SidebarInset>
            {isClient && <DashboardHeader />}
            <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
                    <p className="text-muted-foreground">Manage users, listings, and payments.</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Approve new users to grant them access to the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell className="capitalize flex items-center gap-2"><RoleIcon role={user.role} /> {user.role}</TableCell>
                                        <TableCell><Badge variant={user.status === 'Approved' ? 'secondary' : 'outline'}>{user.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            {user.status === 'Pending' && <Button size="sm">Approve</Button>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Listing Management</CardTitle>
                        <CardDescription>Review and approve new property and service listings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Creator</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockListings.map(listing => (
                                    <TableRow key={listing.id}>
                                        <TableCell className="font-medium">{listing.title}</TableCell>
                                        <TableCell className="capitalize">{listing.type}</TableCell>
                                        <TableCell>{listing.creator}</TableCell>
                                        <TableCell><Badge variant={listing.status === 'Approved' ? 'secondary' : 'outline'}>{listing.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            {listing.status === 'Pending' && <Button size="sm">Approve</Button>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Escrow Management</CardTitle>
                        <CardDescription>Release funds for completed transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Listing</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockEscrow.map(tx => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-medium">{tx.listing}</TableCell>
                                        <TableCell>₦{tx.amount.toLocaleString()}</TableCell>
                                        <TableCell><Badge variant={tx.status === 'released' ? 'secondary' : (tx.status === 'held' ? 'default' : 'outline')} className="capitalize">{tx.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            {tx.status === 'held' && <Button size="sm"><ShieldCheck className="mr-2 h-4 w-4"/>Release Payment</Button>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </SidebarInset>
      </SidebarProvider>
    );
}
