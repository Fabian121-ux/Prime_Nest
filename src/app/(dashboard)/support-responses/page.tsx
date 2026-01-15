
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

type SupportResponse = {
    id: string;
    uid: string;
    email: string;
    response: 'yes' | 'no';
    createdAt: Timestamp;
    demoVersion: string;
}

export default function SupportResponsesPage() {
    const firestore = useFirestore();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    
    // Redirect if user is not admin
    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const responsesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'support_demo_responses'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: responses, isLoading, error } = useCollection<SupportResponse>(responsesQuery);

    if (isLoading || isUserLoading) {
        return (
            <div className="space-y-8">
                 <div>
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                        <HeartHandshake className="w-8 h-8" />
                        Support Responses
                    </h1>
                    <p className="text-muted-foreground">See who has responded to the demo support request.</p>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                           {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                <h2 className="mt-4 text-xl font-semibold">Access Denied</h2>
                <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
                <p className="mt-1 text-sm text-muted-foreground">This feature is for administrators only.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <HeartHandshake className="w-8 h-8" />
                    Support Responses
                </h1>
                <p className="text-muted-foreground">See who has responded to the demo support request.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Responses</CardTitle>
                    <CardDescription>
                        A log of all users who have responded with &quot;Yes&quot; or &quot;No&quot; to the support popup.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Response</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Environment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {responses && responses.length > 0 ? responses.map(res => (
                                    <TableRow key={res.id}>
                                        <TableCell className="font-mono text-xs">{res.uid}</TableCell>
                                        <TableCell className="font-medium">{res.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={res.response === 'yes' ? 'secondary' : 'destructive'}>
                                                {res.response}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatDistanceToNow(res.createdAt.toDate(), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{res.demoVersion}</Badge>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No responses yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
