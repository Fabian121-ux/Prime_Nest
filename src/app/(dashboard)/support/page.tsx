
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <LifeBuoy className="w-8 h-8" />
                Support
            </h1>
            <p className="text-muted-foreground">This feature is under construction.</p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
              Our dedicated support center is being built to help you with any questions or issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Soon, you'll be able to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Browse our frequently asked questions.</li>
                <li>Submit a support ticket to our team.</li>
                <li>Find tutorials and guides on how to use Prime Nest.</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
