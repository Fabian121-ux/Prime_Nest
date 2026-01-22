
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Handshake, Loader2, Info, ShieldCheck, Gavel, FileText, CheckCircle2, MessageSquare, Lock, Send, PanelLeft, PanelRight, Search, Archive, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// #region Mock Data
const MOCK_CONVERSATION_ID = "mock-conversation-123";

const mockConversations = [
    {
        id: MOCK_CONVERSATION_ID,
        participant: {
            name: 'David Okoro',
            avatarId: 'admin-avatar',
            role: 'Artisan',
            isVerified: true
        },
        listing: {
            title: 'Expert Plumbing',
            price: '₦25,000'
        },
        lastMessage: 'The deal has been initiated. Awaiting funding.',
        timestamp: '10:45 AM',
        unreadCount: 0,
    },
    {
        id: 'convo-2',
        participant: {
            name: 'Aminu Bello',
            avatarId: 'user-avatar',
            role: 'Landlord',
            isVerified: false
        },
        listing: {
            title: 'Modern Apartment Rent',
            price: '₦1,500,000'
        },
        lastMessage: 'Yes, it is still available. When would you like to view?',
        timestamp: 'Yesterday',
        unreadCount: 2,
    },
    {
        id: 'convo-3',
        participant: {
            name: 'Femi Adebayo',
            avatarId: 'user-avatar',
            role: 'Tenant',
            isVerified: true
        },
        listing: {
            title: 'Electrical Wiring',
            price: '₦120,000'
        },
        lastMessage: 'Okay, sounds good. I will get back to you shortly.',
        timestamp: '3d ago',
        unreadCount: 0,
    },
];
// #endregion


// #region Main Page Component
export default function MessagesPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string>(MOCK_CONVERSATION_ID);
    const [isListCollapsed, setIsListCollapsed] = useState(false);

    const selectedConversation = useMemo(() => {
        return mockConversations.find(c => c.id === selectedConversationId);
    }, [selectedConversationId]);

    return (
        <div className="h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.32))]">
            <div className="border rounded-lg h-full grid grid-cols-1 md:grid-cols-[auto,1fr] bg-card shadow-2xl">
                <ConversationList
                    conversations={mockConversations}
                    selectedConversationId={selectedConversationId}
                    isCollapsed={isListCollapsed}
                    onToggleCollapse={() => setIsListCollapsed(prev => !prev)}
                    onSelectConversation={(id) => setSelectedConversationId(id)}
                />
                <div className="h-full flex-col hidden md:flex">
                     {selectedConversation ? (
                        <ChatWindow conversation={selectedConversation} key={selectedConversation.id} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mb-4" />
                            <h2 className="text-xl font-semibold">Select a conversation</h2>
                            <p>Choose a conversation from the left to start chatting.</p>
                        </div>
                    )}
                </div>

                {/* On mobile, we only show the chat window */}
                 <div className="h-full flex flex-col md:hidden">
                    <ChatWindow conversation={mockConversations.find(c => c.id === MOCK_CONVERSATION_ID)!} />
                </div>
            </div>
        </div>
    );
}
// #endregion

// #region Conversation List Components
function ConversationList({ conversations, selectedConversationId, isCollapsed, onToggleCollapse, onSelectConversation }: {
    conversations: typeof mockConversations;
    selectedConversationId: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onSelectConversation: (id: string) => void;
}) {
    return (
        <aside className={cn("hidden md:flex flex-col border-r transition-all duration-300 ease-in-out", isCollapsed ? "w-20" : "w-80")}>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b h-20">
                {!isCollapsed && <h2 className="text-xl font-bold font-headline">Messages</h2>}
                <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
                    {isCollapsed ? <PanelRight /> : <PanelLeft />}
                    <span className="sr-only">Toggle conversation list</span>
                </Button>
            </div>
            
            {/* Search */}
            <div className="p-2 border-b">
                 <div className="relative">
                    <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground", isCollapsed && "left-1/2 -translate-x-1/2")}/>
                    {!isCollapsed && <Input placeholder="Search..." className="pl-9"/>}
                </div>
            </div>

            {/* Conversation Items */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {conversations.map(convo => (
                        <ConversationListItem
                            key={convo.id}
                            conversation={convo}
                            isCollapsed={isCollapsed}
                            isSelected={selectedConversationId === convo.id}
                            onSelect={() => onSelectConversation(convo.id)}
                        />
                    ))}
                </div>
            </ScrollArea>
        </aside>
    );
}

function ConversationListItem({ conversation, isCollapsed, isSelected, onSelect }: {
    conversation: typeof mockConversations[0];
    isCollapsed: boolean;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const avatar = PlaceHolderImages.find(p => p.id === conversation.participant.avatarId);
    
    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant={isSelected ? "secondary" : "ghost"} size="icon" className="w-full h-14 relative" onClick={onSelect}>
                            <Avatar className="h-9 w-9">
                                {avatar && <AvatarImage src={avatar.imageUrl} alt={conversation.participant.name} />}
                                <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conversation.unreadCount > 0 && (
                                <Badge className="absolute top-1 right-1 h-4 w-4 p-0 justify-center text-xs">{conversation.unreadCount}</Badge>
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{conversation.participant.name}</p>
                        <p className="text-xs text-muted-foreground">{conversation.listing.title}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <div 
            className={cn("w-full text-left p-2 rounded-lg cursor-pointer group", isSelected ? "bg-secondary" : "hover:bg-muted/50")}
            onClick={onSelect}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        {avatar && <AvatarImage src={avatar.imageUrl} alt={conversation.participant.name} />}
                        <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold text-sm truncate">{conversation.participant.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{conversation.listing.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-40">{conversation.lastMessage}</p>
                    </div>
                </div>

                 <div className="flex flex-col items-end h-full">
                    <p className="text-xs text-muted-foreground mb-1">{conversation.timestamp}</p>
                    {conversation.unreadCount > 0 ? (
                        <Badge className="h-5 w-5 p-0 justify-center">{conversation.unreadCount}</Badge>
                    ) : <div className="h-5 w-5"/>}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                            <DropdownMenuItem><Archive className="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

// #endregion


// #region Chat Window Components (Refactored from original page)

type DealState = 'pre-deal' | 'deal-created' | 'escrow-active';

function ChatWindow({ conversation }: { conversation: typeof mockConversations[0] }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dealState, setDealState] = useState<DealState>('pre-deal');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const avatarArtisan = PlaceHolderImages.find(p => p.id === conversation.participant.avatarId);
  const listingImage = PlaceHolderImages.find(p => p.id === 'listing2');

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'conversations', conversation.id, 'messages'),
        orderBy('createdAt', 'asc')
    );
  }, [firestore, conversation.id]);

  const { data: messages, isLoading: messagesLoading } = useCollection(messagesQuery);

  const handleCreateDeal = async () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
        setDealState('deal-created');
        setIsLoading(false);
    }, 1000)
  };
  
  const handleFundEscrow = () => {
      setIsLoading(true);
      setTimeout(() => {
          setDealState('escrow-active');
          setIsLoading(false);
      }, 1500)
  }

    useEffect(() => {
        if (dealState === 'deal-created') {
            const timer = setTimeout(() => handleFundEscrow(), 3000);
            return () => clearTimeout(timer);
        }
    }, [dealState]);

  return (
    <Card className="h-full flex flex-col shadow-none border-0 rounded-none">
      {/* CHAT HEADER */}
      <CardHeader className="sticky top-0 z-20 bg-primary text-primary-foreground border-b border-primary/50 h-20">
         <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                   <Avatar className="border-2 border-primary-foreground/50">
                      {avatarArtisan && <AvatarImage src={avatarArtisan.imageUrl} alt={conversation.participant.name}/>}
                      <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                          <span>{conversation.participant.name}</span>
                           <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger>
                                      {conversation.participant.isVerified && <ShieldCheck className="w-4 h-4 text-premium fill-premium/20" />}
                                  </TooltipTrigger>
                                  <TooltipContent><p>Verified {conversation.participant.role}</p></TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                      </CardTitle>
                      <CardDescription className="text-xs text-primary-foreground/80">{conversation.participant.role}</CardDescription>
                  </div>
              </div>

              {listingImage && (
                  <div className="hidden md:flex items-center gap-3 bg-black/20 p-2 rounded-md">
                      <Avatar>
                          <AvatarImage src={listingImage.imageUrl} alt={conversation.listing.title} className="rounded-sm"/>
                      </Avatar>
                      <div>
                          <p className="text-sm font-semibold">{conversation.listing.title}</p>
                          <p className="text-xs text-primary-foreground/80">{conversation.listing.price}</p>
                      </div>
                  </div>
              )}
             <DealStatusBadge state={dealState} />
         </div>
      </CardHeader>
      
      {/* MESSAGE AREA */}
      <ScrollArea className="flex-1 bg-muted/30" ref={scrollAreaRef}>
          <div className="p-4 md:p-6 space-y-4">
              {messagesLoading && (
                  <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
              )}

              {messages?.map(message => (
                  <MessageBubble key={message.id} message={message} currentUserId={user?.uid} otherUserAvatar={avatarArtisan?.imageUrl} />
              ))}

              {dealState === 'pre-deal' && !messages && (
                   <SystemMessage icon={<MessageSquare className="w-5 h-5"/>} title="Start the Conversation">
                      Ask questions about the service or negotiate the price before creating a deal. All messages are logged.
                  </SystemMessage>
              )}
              {dealState === 'deal-created' && (
                  <SystemMessage icon={<Handshake className="w-5 h-5"/>} title="Deal Initiated">
                      <p>A deal for '{conversation.listing.title}' for <span className="font-bold text-foreground">{conversation.listing.price}</span> has been created.</p>
                      <p className="mt-2 flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin"/> Awaiting escrow funding from buyer...
                      </p>
                  </SystemMessage>
              )}
               {dealState === 'escrow-active' && (
                  <SystemMessage icon={<Lock className="w-5 h-5 text-trust"/>} title="Funds Secured in Escrow">
                      <p><span className="font-bold text-foreground">{conversation.listing.price}</span> has been locked in the Prime Nest escrow system.</p>
                      <p className="mt-2">The artisan can now begin the work. Funds will be released upon your confirmation.</p>
                  </SystemMessage>
              )}
          </div>
      </ScrollArea>

      {/* INPUT & ACTION AREA */}
      <CardFooter className="p-0 border-t bg-card flex-col">
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
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Deal...</> : <><Handshake className="mr-2 h-4 w-4" /> Create Deal for {conversation.listing.price}</>}
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
                      <Button variant="outline"><FileText className="mr-2"/> View Details</Button>
                      <Button variant="destructive"><Gavel className="mr-2"/> Raise Dispute</Button>
                      <Button className="bg-trust hover:bg-trust/90 text-white md:col-span-3 lg:col-span-1"><ShieldCheck className="mr-2"/> Release Funds</Button>
                  </div>
              </div>
          )}
          <div className="w-full p-2 border-t">
               <MessageInput
                  conversationId={MOCK_CONVERSATION_ID}
                  disabled={isLoading || dealState === 'deal-created'}
              />
          </div>
      </CardFooter>
    </Card>
  );
}

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
        <div className={cn("absolute top-2 left-0 w-full h-0.5", {
            'bg-trust': status === 'complete',
            'bg-border': status === 'current' || status === 'pending',
            'w-1/2 left-1/2': isFirst,
            'w-1/2 left-0': isLast,
        })} />
         <div className={cn("absolute top-2 left-0 w-1/2 h-0.5", { 'bg-trust': status === 'current' })} />
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

const messageFormSchema = z.object({
  content: z.string().min(1).max(1000),
});

function MessageInput({ conversationId, disabled }: { conversationId: string; disabled: boolean }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(values: z.infer<typeof messageFormSchema>) {
    if (!user || !firestore || !conversationId) return;

    try {
        const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
        addDoc(messagesRef, {
            senderId: user.uid,
            content: values.content,
            type: 'text',
            createdAt: serverTimestamp(),
        });
        form.reset();
    } catch(e) {
        console.error("Error sending message:", e);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-0 resize-none"
                  rows={1}
                  disabled={disabled}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                      }
                  }}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={disabled || !form.formState.isValid || form.formState.isSubmitting}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send Message</span>
        </Button>
      </form>
    </Form>
  );
}

function MessageBubble({ message, currentUserId, otherUserAvatar }: { message: any; currentUserId?: string; otherUserAvatar?: string }) {
    const isSender = message.senderId === currentUserId;

    if (message.type === 'system') {
        return null;
    }

    return (
        <div className={cn("flex w-full max-w-md items-end gap-3", isSender ? "ml-auto justify-end" : "mr-auto justify-start")}>
            {!isSender && (
                <Avatar className="h-8 w-8">
                    {otherUserAvatar && <AvatarImage src={otherUserAvatar} />}
                    <AvatarFallback>D</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "rounded-lg px-3 py-2 shadow-sm",
                isSender
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
            )}>
                <p className="text-sm">{message.content}</p>
            </div>
        </div>
    );
}
// #endregion
