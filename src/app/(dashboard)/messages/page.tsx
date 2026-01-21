
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Handshake, Loader2, ServerCrash, FileCheck2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MessagesPage() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dealId, setDealId] = useState<string | null>(null);

  const handleCreateDeal = async () => {
    if (!auth) {
      setError("Authentication service is not available.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDealId(null);

    try {
      const functions = getFunctions(auth.app);
      const createDealFunction = httpsCallable(functions, 'createDeal');

      // In a real scenario, this data would come from the listing and user input.
      const dealData = {
        listingId: "listing2", // Corresponds to "Expert Plumbing" from placeholder data
        amount: 25000,
        conversationId: "mock-conversation-123" // A mock ID for demonstration
      };

      const result = await createDealFunction(dealData);
      
      const newDealId = (result.data as { dealId: string }).dealId;
      setDealId(newDealId);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred while creating the deal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <Handshake className="w-8 h-8" />
          Create a Deal
        </h1>
        <p className="text-muted-foreground">Securely initiate a transaction with another user.</p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Initiate a Deal for "Expert Plumbing"</CardTitle>
          <CardDescription>
            Click the button below to call the backend `createDeal` function. This will securely create both a Deal and an Escrow record.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="font-mono text-lg font-bold">Amount: ₦25,000</p>
            <p className="text-sm text-muted-foreground">Listing: Expert Plumbing Services</p>
          </div>
          
          <Button onClick={handleCreateDeal} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Deal...
              </>
            ) : (
              "Create Deal & Escrow"
            )}
          </Button>

          {dealId && (
             <Alert variant="success">
                <FileCheck2 className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Deal created successfully.
                  <p className="font-mono text-xs mt-2 break-all">Deal ID: {dealId}</p>
                </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Error Creating Deal</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
