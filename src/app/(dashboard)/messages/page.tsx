
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Handshake, Loader2, Info, ShieldCheck, Gavel, FileText, CheckCircle2, MessageSquare, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type DealState = 'pre-deal' | 'deal-created' | 'escrow-active';

const SystemMessage = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex justify-center">
        <div className="text-center my-4 p-4 rounded-lg border bg-card max-w-md w-full">
            <div className="flex justify-center mb-2 text-muted-foreground">{icon}</div>
            <p className="font-semibold text-foreground text-sm">{title}</p>
            <div className="text-xs text-muted-foreground">{children}</div>
        </div>
    </div>
);

const Milestone = ({ title, status, isFirst, isLast }: { title:string; status: 'complete' | 'current' | 'pending'; isFirst?: boolean; isLast?: boolean }) => (
    <div className="relative flex-1 flex flex-col items-center">
         {/* Connecting Line */}
        <div className={cn("absolute top-2 left-0 w-full h-0.5", {
            'bg-trust': status === 'complete',
            'bg-border': status === 'current' || status === 'pending',
            'w-1/2 left-1/2': isFirst,
            'w-1/2 left-0': isLast,
        })} />
         <div className={cn("absolute top-2 left-0 w-1/2 h-0.5", { 'bg-trust': status === 'current' })} />

        {/* Milestone Circle */}
        <div className={cn("relative z-10 w-4 h-4 rounded-full flex items-center justify-center border-2", {
            "bg-trust border-trust": status === 'complete',
            "border-trust": status === 'current',
            "bg-card border-border": status === 'pending'
        })}>
            {status === 'complete' && <CheckCircle2 className="w-3 h-3 text-white" />}
             {status === 'current' && <div className="w-2 h-2 rounded-full bg-trust" />}
        </div>
        <p className={cn("text-xs text-center mt-2 w-20", {
            "font-semibold text-foreground": status === 'current',
            "text-muted-foreground": status !== 'current',
        })}>{title}</p>
    </div>
);

const DealStatusBadge = ({ state }: { state: DealState }) => {
    const statusMap = {
        'pre-deal': { text: 'No Deal Yet', className: 'bg-muted text-muted-foreground' },
        'deal-created': { text: 'Deal Created', className: 'bg-secondary text-secondary-foreground' },
        'escrow-active': { text: 'Funds in Escrow', icon: <Lock className="w-3 h-3" />, className: 'bg-trust text-white' }
    };
    const currentStatus = statusMap[state];

    return (
        <Badge className={cn('gap-1.5', currentStatus.className)}>
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
        </Badge>
    );
};

export default function MessagesPage() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dealId, setDealId] = useState<string | null>(null);
  const [dealState, setDealState] = useState<DealState>('pre-deal');
  
  const avatarUser = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const avatarArtisan = PlaceHolderImages.find(p => p.id === 'admin-avatar');
  const listingImage = PlaceHolderImages.find(p => p.id === 'listing2');

  const handleCreateDeal = async () => {
    if (!auth) {
      setError("Authentication service is not available.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // Simulate clicking the state buttons for demo purposes
     setTimeout(() => {
        setDealState('deal-created');
        setIsLoading(false);
    }, 1000)

    // try {
    //   const functions = getFunctions(auth.app);
    //   const createDealFunction = httpsCallable(functions, 'createDeal');
    //   const dealData = { listingId: "listing2", amount: 25000, conversationId: "mock-conversation-123" };
    //   const result = await createDealFunction(dealData);
    //   const newDealId = (result.data as { dealId: string }).dealId;
    //   setDealId(newDealId);
    //   setDealState('deal-created');
    // } catch (err: any) {
    //   console.error(err);
    //   setError(err.message || "An unknown error occurred.");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  
  const handleFundEscrow = () => {
      setIsLoading(true);
      setTimeout(() => {
          setDealState('escrow-active');
          setIsLoading(false);
      }, 1500)
  }

  // Add this to simulate moving from deal-created to escrow-active
  // We trigger it from a button in the system message for now.
  useState(() => {
      if (dealState === 'deal-created') {
          // This would be triggered by a backend event in a real app
          const timer = setTimeout(() => handleFundEscrow(), 3000);
          return () => clearTimeout(timer);
      }
  });


  return (
    <div className="h-[calc(100vh-theme(spacing.32))]">
      <Card className="h-full flex flex-col max-w-4xl mx-auto shadow-2xl">
        {/* CHAT HEADER */}
        <CardHeader className="sticky top-0 z-20 bg-primary text-primary-foreground border-b border-primary/50">
           <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                     <Avatar className="border-2 border-primary-foreground/50">
                        {avatarArtisan && <AvatarImage src={avatarArtisan.imageUrl} alt="David Okoro"/>}
                        <AvatarFallback>D</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <span>David Okoro</span>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <ShieldCheck className="w-4 h-4 text-premium fill-premium/20" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Verified Artisan</p>
                                    </TooltipContent>
                                </Tooltip>
                             </TooltipProvider>
                        </CardTitle>
                        <CardDescription className="text-xs text-primary-foreground/80">Artisan</CardDescription>
                    </div>
                </div>

                {listingImage && (
                    <div className="hidden md:flex items-center gap-3 bg-black/20 p-2 rounded-md">
                        <img src={listingImage.imageUrl} alt={listingImage.title} className="w-10 h-10 object-cover rounded-sm"/>
                        <div>
                            <p className="text-sm font-semibold">{listingImage.title}</p>
                            <p className="text-xs text-primary-foreground/80">{listingImage.price}</p>
                        </div>
                    </div>
                )}
               
               <DealStatusBadge state={dealState} />
           </div>
        </CardHeader>
        
        {/* MESSAGE AREA */}
        <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/30">
             <div className="flex items-end gap-3 justify-end">
                <div className="rounded-lg bg-card p-3 max-w-xs shadow-sm">
                    <p>Hello! I'm interested in your plumbing services. I have a leak under my kitchen sink.</p>
                </div>
                <Avatar className="h-8 w-8">
                    {avatarUser && <AvatarImage src={avatarUser.imageUrl} alt="You"/>}
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
             <div className="flex items-end gap-3">
                 <Avatar className="h-8 w-8">
                    {avatarArtisan && <AvatarImage src={avatarArtisan.imageUrl} alt="David Okoro"/>}
                    <AvatarFallback>D</AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-card p-3 max-w-xs shadow-sm">
                    <p>Hi there! I can certainly help with that. My standard call-out fee is ₦25,000 which covers the first hour.</p>
                </div>
            </div>

            {/* System Messages based on State */}
            {dealState === 'deal-created' && (
                <SystemMessage icon={<Handshake className="w-5 h-5"/>} title="Deal Initiated">
                    <p>A deal for 'Expert Plumbing' for <span className="font-bold text-foreground">₦25,000</span> has been created.</p>
                    <p className="mt-2 flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin"/> Awaiting escrow funding from buyer...
                    </p>
                </SystemMessage>
            )}
             {dealState === 'escrow-active' && (
                <SystemMessage icon={<Lock className="w-5 h-5 text-trust"/>} title="Funds Secured in Escrow">
                    <p><span className="font-bold text-foreground">₦25,000</span> has been locked in the Prime Nest escrow system.</p>
                    <p className="mt-2">The artisan can now begin the work. Funds will be released upon your confirmation.</p>
                </SystemMessage>
            )}
        </CardContent>

        {/* INPUT AREA */}
        <CardFooter className="p-2 border-t bg-card">
            {dealState === 'pre-deal' && (
                <div className="w-full p-2 space-y-3">
                     <Alert variant="default" className="border-blue-500/30 bg-blue-500/5">
                        <Info className="h-4 w-4 text-blue-500" />
                        <AlertTitle>Ready to make a deal?</AlertTitle>
                        <AlertDescription>
                            Once you agree on the terms, create a formal deal to protect your payment with our escrow system.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleCreateDeal} disabled={isLoading} size="lg" className="w-full">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Deal...</> : <><Handshake className="mr-2 h-4 w-4" /> Create Deal for ₦25,000</>}
                    </Button>
                    {error && <Alert variant="destructive"><Info className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                </div>
            )}
             {dealState === 'deal-created' && (
                <div className="w-full text-center p-4 text-sm text-muted-foreground">
                    <p className="mb-2">Waiting for buyer to fund escrow...</p>
                    <Progress value={25} className="w-full h-2" />
                </div>
            )}
            {dealState === 'escrow-active' && (
                 <div className="w-full space-y-4 p-2">
                    <div className="flex justify-around items-start p-4 bg-muted/50 rounded-lg">
                        <Milestone title="Deal Initiated" status="complete" isFirst/>
                        <Milestone title="Funds in Escrow" status="current" />
                        <Milestone title="Work Completed" status="pending" />
                        <Milestone title="Funds Released" status="pending" isLast/>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Button variant="outline"><FileText /> View Details</Button>
                        <Button variant="destructive"><Gavel /> Raise Dispute</Button>
                        <Button className="bg-trust hover:bg-trust/90 text-white md:col-span-3 lg:col-span-1"><ShieldCheck /> Release Funds</Button>
                    </div>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}

    