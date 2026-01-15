
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                Messages
            </h1>
            <p className="text-muted-foreground">This feature is under construction.</p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
                Our integrated messaging system is being built to facilitate seamless communication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Soon, you'll be able to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Chat directly with tenants, landlords, and artisans.</li>
                <li>Receive system notifications and escrow updates.</li>
                <li>Organize conversations by listing or job.</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
