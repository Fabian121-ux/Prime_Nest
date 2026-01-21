
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function ListingsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                My Listings
            </h1>
            <p className="text-muted-foreground">Manage your properties, jobs, and service offerings.</p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
              We're hard at work building a comprehensive space for you to create and manage your own listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Soon, you'll be able to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Create new listings for rentals or services.</li>
                <li>Edit your existing listings and update their status.</li>
                <li>View analytics on how your listings are performing.</li>
                <li>Manage applications and inquiries from other users.</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
