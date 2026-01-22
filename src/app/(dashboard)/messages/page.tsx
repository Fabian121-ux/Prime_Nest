
'use client';

import { useState, useMemo, useEffect, useRef, forwardRef, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';

import { Handshake, Loader2, ShieldCheck, Lock, Send, MoreHorizontal, ArrowLeft, MessageSquare, Search, Archive, BookCheck } from "lucide-react";

import { useUser, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useIsMobile } from '@/hooks/use-mobile';


// #region MOCK DATA
const MOCK_CONVERSATION_ID = "mock-conversation-123";
const mockConversations = [
  {
    id: MOCK_CONVERSATION_ID,
    participant: { name: 'David Okoro', avatarId: 'admin-avatar', role: 'Artisan', isVerified: true },
    listing: { id: 'listing2', title: 'Expert Plumbing', price: '₦25,000' },
    lastMessage: 'The deal has been initiated. Awaiting funding.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    unreadCount: 0,
  },
  {
    id: 'convo-2',
    participant: { name: 'Aminu Bello with a longer name', avatarId: 'user-avatar', role: 'Landlord', isVerified: false },
    listing: { id: 'listing1', title: 'Modern Apartment Rent with a very long title that should wrap', price: '₦1,500,000' },
    lastMessage: 'Yes, it is still available. When would you like to view? This is a longer message to test wrapping.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    unreadCount: 2,
  },
  {
    id: 'convo-3',
    participant: { name: 'Femi Adebayo', avatarId: 'user-avatar', role: 'Tenant', isVerified: true },
    listing: { id: 'listing4', title: 'Electrical Wiring', price: '₦120,000' },
    lastMessage: 'Okay, sounds good. I will get back to you shortly.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    unreadCount: 0,
  },
];
// #endregion

// #region Main Component Structure
export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && !selectedConversationId && mockConversations.length > 0) {
      setSelectedConversationId(mockConversations[0].id);
    }
    if (!isMobile) {
      // setIsListCollapsed(false); // This was causing issues, removing it.
    }
  }, [isMobile, selectedConversationId]);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return mockConversations.find(c => c.id === selectedConversationId);
  }, [selectedConversationId]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };
  
  const handleBackToList = () => {
    setSelectedConversationId(null);
  }

  const layout = isMobile ? (selectedConversationId ? 'detail' : 'list') : 'split';

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.32))]">
      <Card className={cn(
        "h-full w-full grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out",
        layout === 'split' && (isListCollapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[minmax(300px,384px)_1fr]")
      )}>
        <div className={cn('h-full flex-col', layout === 'detail' ? 'hidden' : 'flex', 'md:flex')}>
          <ConversationList
            conversations={mockConversations}
            selectedConversationId={selectedConversationId}
            isCollapsed={isListCollapsed}
            onToggleCollapse={() => setIsListCollapsed(prev => !prev)}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        
        <div className={cn('h-full flex flex-col', layout === 'list' && 'hidden', 'md:flex')}>
          {selectedConversation ? (
            <ChatWindow 
              key={selectedConversation.id} 
              conversation={selectedConversation} 
              onBack={isMobile ? handleBackToList : undefined} 
            />
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <MessageSquare className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold">Select a conversation</h2>
              <p>Choose a conversation from the left to start chatting.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
// #endregion

// #region Conversation List Components
function ConversationList({ conversations, selectedConversationId, isCollapsed, onToggleCollapse, onSelectConversation }: any) {
  const isMobile = useIsMobile();
  return (
    <aside className={cn(
      "flex flex-col h-full border-r bg-card"
    )}>
      <header className="p-4 flex items-center justify-between border-b h-20 shrink-0">
        {!isCollapsed && <h2 className="text-xl font-bold font-headline">Messages</h2>}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            <ArrowLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        )}
      </header>
      
      <div className={cn("p-2 border-b", isCollapsed && "hidden")}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-9 h-9" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((convo: any) => (
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

const ConversationListItem = forwardRef<HTMLDivElement, any>(
  ({ conversation, isCollapsed, isSelected, onSelect, ...props }, ref) => {
    const avatar = PlaceHolderImages.find(p => p.id === conversation.participant.avatarId);
    
    const itemContent = (
      <div
        ref={ref}
        className={cn(
          "w-full text-left p-2 rounded-lg cursor-pointer transition-colors flex items-center gap-3",
          isSelected ? "bg-accent" : "hover:bg-muted",
          isCollapsed && "justify-center"
        )}
        onClick={onSelect}
        {...props}
      >
        <Avatar className="h-10 w-10 shrink-0">
          {avatar && <AvatarImage src={avatar.imageUrl} alt={conversation.participant.name} />}
          <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden min-w-0">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-sm break-words pr-2">{conversation.participant.name}</p>
              <p className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">{formatDistanceToNow(conversation.timestamp, { addSuffix: true })}</p>
            </div>
            <p className="text-xs text-muted-foreground truncate">{conversation.listing.title}</p>
            <div className="flex justify-between items-end mt-1">
              <p className="text-xs text-muted-foreground break-words pr-2 flex-1">{conversation.lastMessage}</p>
              {conversation.unreadCount > 0 && (
                <Badge variant="default" className="h-5 w-5 p-0 justify-center text-xs shrink-0">{conversation.unreadCount}</Badge>
              )}
            </div>
          </div>
        )}
         {!isCollapsed && (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0 -mr-2">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem><BookCheck className="mr-2 h-4 w-4"/> Mark as Read</DropdownMenuItem>
                    <DropdownMenuItem><Archive className="mr-2 h-4 w-4"/> Archive</DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
         )}
      </div>
    );
  
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1">
              <p className="font-semibold">{conversation.participant.name}</p>
              <p className="text-xs text-muted-foreground">{conversation.listing.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  
    return itemContent;
  }
);
ConversationListItem.displayName = 'ConversationListItem';
// #endregion

// #region Chat Window Components
type DealState = 'pre-deal' | 'deal-created' | 'escrow-active';

function ChatWindow({ conversation, onBack }: any) {
  const [dealState, setDealState] = useState<DealState>('pre-deal');
  
  useEffect(() => {
    if (dealState === 'deal-created') {
      const timer = setTimeout(() => setDealState('escrow-active'), 3000);
      return () => clearTimeout(timer);
    }
  }, [dealState]);

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <ChatHeader conversation={conversation} dealState={dealState} onBack={onBack} />
      <MessageList conversationId={conversation.id} dealState={dealState} />
      <ChatFooter conversationId={conversation.id} dealState={dealState} setDealState={setDealState} />
    </div>
  );
}

function ChatHeader({ conversation, dealState, onBack }: any) {
    const avatarArtisan = PlaceHolderImages.find(p => p.id === conversation.participant.avatarId);
    const listingImage = PlaceHolderImages.find(p => p.id === conversation.listing.id);

    return (
        <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b flex items-center p-3 h-20 shrink-0">
            <div className="flex items-center gap-3 flex-1 overflow-hidden min-w-0">
                {onBack && <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={onBack}><ArrowLeft className="h-5 w-5"/></Button>}
                <Avatar className="h-10 w-10">
                    {avatarArtisan && <AvatarImage src={avatarArtisan.imageUrl} />}
                    <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 truncate">
                        {conversation.participant.name}
                        {conversation.participant.isVerified && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><ShieldCheck className="w-4 h-4 text-premium shrink-0" /></TooltipTrigger>
                                <TooltipContent><p>Verified {conversation.participant.role}</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        )}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{conversation.participant.role}</p>
                </div>
            </div>

            {listingImage && (
                <div className="hidden sm:flex items-center gap-3 bg-muted p-2 rounded-md mx-4">
                    <Avatar className="rounded-sm h-10 w-10">
                        <AvatarImage src={listingImage.imageUrl} />
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{conversation.listing.title}</p>
                        <p className="text-xs text-muted-foreground">{conversation.listing.price}</p>
                    </div>
                </div>
            )}
            <DealStatusBadge state={dealState} />
        </header>
    );
}

function MessageList({ conversationId, dealState }: any) {
    const { user } = useUser();
    const firestore = useFirestore();
    const viewportRef = useRef<HTMLDivElement>(null);

    const messagesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'conversations', conversationId, 'messages'),
            orderBy('createdAt', 'asc')
        );
    }, [firestore, conversationId]);

    const { data: messages, isLoading: messagesLoading } = useCollection(messagesQuery);
    
    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        }
    }, [messages, dealState]);

    return (
        <ScrollArea className="flex-1" viewportRef={viewportRef}>
            <div className="p-4 space-y-2">
                {messagesLoading && <Loader2 className="animate-spin mx-auto w-6 h-6 text-muted-foreground my-4" />}
                {messages?.map((message: any) => (
                    <MessageBubble key={message.id} message={message} currentUserId={user?.uid} />
                ))}
                {dealState === 'escrow-active' && (
                    <SystemMessage>Funds are now held securely in Escrow.</SystemMessage>
                )}
            </div>
        </ScrollArea>
    );
}

function MessageBubble({ message, currentUserId }: any) {
  const isSender = message.senderId === currentUserId;
  const avatarSelf = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const avatarOther = PlaceHolderImages.find(p => p.id === 'admin-avatar');
  const avatarUrl = isSender ? avatarSelf?.imageUrl : avatarOther?.imageUrl;
  
  return (
    <div className={cn("flex items-end gap-2 text-sm", isSender ? "flex-row-reverse" : "")}>
        <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{isSender ? 'Y' : 'D'}</AvatarFallback>
        </Avatar>
        <div className={cn(
            "max-w-md p-3 rounded-lg shadow-sm", 
            isSender 
            ? "bg-primary text-primary-foreground rounded-br-none" 
            : "bg-card text-card-foreground border rounded-bl-none"
        )}>
            <p className="break-words">{message.content}</p>
        </div>
    </div>
  );
}

function SystemMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-center text-xs text-muted-foreground py-2 my-4 flex items-center gap-2">
            <div className="flex-1 border-t"></div>
            {children}
            <div className="flex-1 border-t"></div>
        </div>
    );
}

function ChatFooter({ conversationId, dealState, setDealState }: any) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateDeal = async () => {
        setIsLoading(true);
        setTimeout(() => {
          setDealState('deal-created');
          setIsLoading(false);
        }, 1000);
    };

    const isInputDisabled = dealState === 'deal-created' || isLoading;

    return (
        <footer className="p-4 border-t bg-card shrink-0 space-y-2">
            <MessageInput conversationId={conversationId} disabled={isInputDisabled} />
            {dealState !== 'pre-deal' && (
                <div className="text-center text-xs text-muted-foreground pt-1">
                    {dealState === 'deal-created' && "Deal created. Awaiting funding..."}
                    {dealState === 'escrow-active' && "You can now discuss project details."}
                </div>
            )}
            {dealState === 'pre-deal' && (
                <Button onClick={handleCreateDeal} className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
                    Create Deal
                    <Handshake className="ml-2 w-4 h-4" />
                </Button>
            )}
        </footer>
    );
}

const messageFormSchema = z.object({ content: z.string().min(1, "Message cannot be empty").max(1000) });

function MessageInput({ conversationId, disabled }: any) {
  const { user } = useUser();
  const firestore = useFirestore();
  const form = useForm({ resolver: zodResolver(messageFormSchema), defaultValues: { content: "" } });

  async function onSubmit(values: any) {
    if (!user || !firestore) return;
    try {
      const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
      await addDoc(messagesRef, { senderId: user.uid, content: values.content, type: 'text', createdAt: serverTimestamp() });
      form.reset();
    } catch(e) {
      console.error("Error sending message:", e);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (form.formState.isValid) {
        form.handleSubmit(onSubmit)();
      }
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-start">
      <Textarea 
        {...form.register("content")} 
        rows={1} 
        placeholder="Type a message..." 
        disabled={disabled} 
        className="flex-1 resize-none" 
        onKeyDown={handleKeyDown} 
      />
      <Button type="submit" size="icon" disabled={!form.formState.isValid || disabled} className="shrink-0">
          <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}

const DealStatusBadge = ({ state }: { state: DealState }) => {
    switch (state) {
        case 'escrow-active':
            return <Badge variant="success" className="gap-1.5"><Lock className="w-3 h-3" />Funds in Escrow</Badge>;
        case 'deal-created':
            return <Badge variant="premium" className="gap-1.5">Deal Created</Badge>;
        default:
            return <Badge variant="secondary">No Deal Yet</Badge>;
    }
};

// #endregion
