
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Handshake, Loader2, ServerCrash, FileCheck2, MessageSquare, Info, ShieldCheck, Gavel, FileText, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

type DealState = 'pre-deal' | 'deal-created' | 'escrow-active';

const SystemMessage = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4 rounded-lg bg-muted/50 p-4 my-4">
        <div className="text-muted-foreground mt-1">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-foreground">{title}</p>
            <div className="text-sm text-muted-foreground">{children}</div>
        </div>
    </div>
);

const Milestone = ({ title, status, isFirst, isLast }: { title: string, status: 'complete' | 'current' | 'pending', isFirst?: boolean, isLast?: boolean }) => (
    <div className="relative flex-1 flex flex-col items-center">
        <div className={cn("absolute top-1/2 left-0 w-full h-0.5", {
            'bg-primary': status === 'complete',
            'bg-border': status === 'current' || status === 'pending',
            'w-1/2 left-1/2': isFirst,
            'w-1/2 left-0': isLast,
        })} />
         <div className={cn("absolute top-1/2 left-0 w-1/2 h-0.5", {
            'bg-primary': status === 'current',
        })} />

        <div className={cn("relative z-10 w-6 h-6 rounded-full flex items-center justify-center", {
            "bg-primary text-primary-foreground": status === 'complete' || status === 'current',
            "bg-border text-muted-foreground": status === 'pending'
        })}>
            {status === 'complete' && <CheckCircle2 className="w-4 h-4" />}
        </div>
        <p className="text-xs text-center mt-2 w-20">{title}</p>
    </div>
);

export default function MessagesPage() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dealId, setDealId] = useState<string | null>(null);
  const [dealState, setDealState] = useState<DealState>('pre-deal');
  
  const avatarUser = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const avatarAdmin = PlaceHolderImages.find(p => p.id === 'admin-avatar');

  const handleCreateDeal = async () => {
    if (!auth) {
      setError("Authentication service is not available.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const functions = getFunctions(auth.app);
      const createDealFunction = httpsCallable(functions, 'createDeal');
      const dealData = {
        listingId: "listing2",
        amount: 25000,
        conversationId: "mock-conversation-123"
      };

      const result = await createDealFunction(dealData);
      const newDealId = (result.data as { dealId: string }).dealId;
      setDealId(newDealId);
      setDealState('deal-created'); // Transition state

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulate funding the escrow and moving to the next state
  const handleFundEscrow = () => {
      // In a real app, this would be a complex backend process involving a payment gateway
      setIsLoading(true);
      setTimeout(() => {
          setDealState('escrow-active');
          setIsLoading(false);
      }, 1500)
  }

  return (
    <div className="space-y-4">
       <div className="flex justify-center gap-2 mb-8">
            <Button variant={dealState === 'pre-deal' ? 'default' : 'outline'} size="sm" onClick={() => setDealState('pre-deal')}>1. Pre-Deal</Button>
            <Button variant={dealState === 'deal-created' ? 'default' : 'outline'} size="sm" onClick={() => setDealState('deal-created')}>2. Deal Created</Button>
            <Button variant={dealState === 'escrow-active' ? 'default' : 'outline'} size="sm" onClick={() => setDealState('escrow-active')}>3. Escrow Active</Button>
       </div>

      <Card className="max-w-4xl mx-auto flex flex-col h-[75vh]">
        {/* CHAT HEADER */}
        <CardHeader className="border-b">
           <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        <span>Expert Plumbing</span>
                    </CardTitle>
                    <CardDescription>Conversation with David Okoro</CardDescription>
                </div>
                {dealState === 'escrow-active' && (
                    <Badge variant="success" className="gap-1.5">
                        <ShieldCheck className="h-3 w-3" />
                        Escrow Active
                    </Badge>
                )}
           </div>
        </CardHeader>
        
        {/* CHAT CONTENT */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Mock Messages */}
             <div className="flex items-end gap-3 justify-end">
                <div className="rounded-lg bg-primary text-primary-foreground p-3 max-w-xs">
                    <p>Hello! I'm interested in your plumbing services. I have a leak under my kitchen sink.</p>
                </div>
                <Avatar>
                    {avatarUser && <AvatarImage src={avatarUser.imageUrl} alt="You"/>}
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
             <div className="flex items-end gap-3">
                 <Avatar>
                    {avatarAdmin && <AvatarImage src={avatarAdmin.imageUrl} alt="David Okoro"/>}
                    <AvatarFallback>D</AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-card-foreground/10 p-3 max-w-xs">
                    <p>Hi there! I can certainly help with that. My standard call-out fee is ₦25,000 which covers the first hour.</p>
                </div>
            </div>

            {/* System Messages based on State */}
            {dealState === 'deal-created' && (
                <SystemMessage icon={<Handshake />} title="Deal Created">
                    <p>A deal for 'Expert Plumbing' for <span className="font-bold text-foreground">₦25,000</span> has been initiated.</p>
                    <p className="mt-2">Next step: The buyer needs to deposit funds into the secure escrow.</p>
                     <Button size="sm" className="mt-3 w-full sm:w-auto" onClick={handleFundEscrow} disabled={isLoading}>
                         {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Funding...</> : 'Simulate Funding Escrow'}
                    </Button>
                </SystemMessage>
            )}
             {dealState === 'escrow-active' && (
                <SystemMessage icon={<ShieldCheck />} title="Funds Secured in Escrow">
                    <p><span className="font-bold text-foreground">₦25,000</span> has been locked in the Prime Nest escrow system.</p>
                    <p className="mt-2">The artisan can now begin the work.</p>
                </SystemMessage>
            )}

        </CardContent>

        {/* CHAT FOOTER / ACTIONS */}
        <CardFooter className="p-4 border-t bg-muted/30">
            {dealState === 'pre-deal' && (
                <div className="w-full space-y-4">
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Ready to make a deal?</AlertTitle>
                        <AlertDescription>
                            Once you agree on the terms, create a formal deal to protect your payment with our escrow system.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleCreateDeal} disabled={isLoading} className="w-full">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <><Handshake className="mr-2 h-4 w-4" /> Create Deal for ₦25,000</>}
                    </Button>
                    {error && <Alert variant="destructive"><ServerCrash className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                </div>
            )}
            {dealState === 'deal-created' && (
                <div className="w-full text-center text-sm text-muted-foreground">
                    <p>Waiting for buyer to fund escrow...</p>
                    <Progress value={25} className="w-full mt-2" />
                </div>
            )}
            {dealState === 'escrow-active' && (
                 <div className="w-full space-y-4">
                     {/* Milestone Tracker */}
                    <div className="flex justify-center p-4">
                        <Milestone title="Deal Initiated" status="complete" isFirst/>
                        <Milestone title="Funds in Escrow" status="current" />
                        <Milestone title="Work Completed" status="pending" />
                        <Milestone title="Funds Released" status="pending" isLast/>
                    </div>
                    <Separator />
                     {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Button variant="outline"><FileText className="mr-2" /> View Details</Button>
                        <Button variant="destructive"><Gavel className="mr-2" /> Raise Dispute</Button>
                        <Button className="md:col-span-3 lg:col-span-1"><ShieldCheck className="mr-2"/> Release Funds</Button>
                    </div>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
