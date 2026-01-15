
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function ListingsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                Listings & Jobs
            </h1>
            <p className="text-muted-foreground">This feature is under construction.</p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
              We're hard at work building a comprehensive space for you to browse properties, find jobs, and manage your own listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Soon, you'll be able to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Explore rental properties and professional services.</li>
                <li>Post your own job openings or service offerings.</li>
                <li>Manage applications, view analytics, and much more.</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
