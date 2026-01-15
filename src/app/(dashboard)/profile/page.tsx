
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <User className="w-8 h-8" />
                Profile
            </h1>
            <p className="text-muted-foreground">This feature is under construction.</p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
              Your personal profile and settings page is currently being developed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Soon, you'll be able to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Update your personal information and contact details.</li>
                <li>Manage your verification status and trust tier.</li>
                <li>Set your notification preferences.</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
