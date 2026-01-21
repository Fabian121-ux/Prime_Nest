
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function SupportResponsesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-destructive" />
                Feature Removed
            </h1>
            <p className="text-muted-foreground">This feature has been removed from the application.</p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Page No Longer Available</CardTitle>
            <CardDescription>
              The support responses feature has been disabled and removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This page and its associated functionality are no longer in use.</p>
          </CardContent>
        </Card>
    </div>
  );
}
