
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                Escrow Wallet
            </h1>
            <p className="text-muted-foreground">This feature is under construction.</p>
        </div>
        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
              Our secure escrow wallet is being developed to manage your transactions with confidence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Soon, you'll be able to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>View all your escrow transactions in one place.</li>
                <li>Track the status of payments (held, released, disputed).</li>
                <li>Manage your payment methods and withdrawal settings.</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
