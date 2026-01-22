'use client';

import { useState, useMemo, useEffect, useRef, forwardRef, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Handshake, Loader2, ShieldCheck, Lock, Send, MoreHorizontal, ArrowLeft, MessageSquare, Archive, BookCheck } from "lucide-react";

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
    listing: { title: 'Expert Plumbing', price: '₦25,000' },
    lastMessage: 'The deal has been initiated. Awaiting funding.',
    timestamp: '10:45 AM',
    unreadCount: 0,
  },
  {
    id: 'convo-2',
    participant: { name: 'Aminu Bello', avatarId: 'user-avatar', role: 'Landlord', isVerified: false },
    listing: { title: 'Modern Apartment Rent', price: '₦1,500,000' },
    lastMessage: 'Yes, it is still available. When would you like to view?',
    timestamp: 'Yesterday',
    unreadCount: 2,
  },
  {
    id: 'convo-3',
    participant: { name: 'Femi Adebayo', avatarId: 'user-avatar', role: 'Tenant', isVerified: true },
    listing: { title: 'Electrical Wiring', price: '₦120,000' },
    lastMessage: 'Okay, sounds good. I will get back to you shortly.',
    timestamp: '3d ago',
    unreadCount: 0,
  },
];
// #endregion


// #region MAIN PAGE
export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // On desktop, default to selecting the first conversation if none is selected
    if (!isMobile && !selectedConversationId) {
      setSelectedConversationId(MOCK_CONVERSATION_ID);
    }
    // On mobile, if a conversation is selected, the list should be hidden.
    // If we resize to desktop, the list should not be collapsed.
    if (!isMobile) {
      setIsListCollapsed(false);
    }
  }, [isMobile, selectedConversationId]);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return mockConversations.find(c => c.id === selectedConversationId);
  }, [selectedConversationId]);

  // On mobile, show list OR detail. On desktop, show both (unless list is collapsed).
  const showDetail = isMobile ? !!selectedConversationId : true;
  const showList = isMobile ? !selectedConversationId : !isListCollapsed;

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.32))] bg-background">
      <div className="border rounded-lg h-full grid grid-cols-1 md:grid-cols-[auto,1fr] overflow-hidden bg-card">
        {/* Conversation List */}
        <div className={cn({ 'hidden md:block': isMobile && !!selectedConversationId })}>
          <ConversationList
            conversations={mockConversations}
            selectedConversationId={selectedConversationId}
            isCollapsed={isListCollapsed}
            onToggleCollapse={() => setIsListCollapsed(prev => !prev)}
            onSelectConversation={(id: SetStateAction<string | null>) => setSelectedConversationId(id)}
          />
        </div>

        {/* Chat Window */}
        <div className={cn('h-full flex flex-col', { 'hidden md:flex': isMobile && !selectedConversationId })}>
          {selectedConversation ? (
            <ChatWindow 
              conversation={selectedConversation} 
              key={selectedConversation.id} 
              onBack={isMobile ? () => setSelectedConversationId(null) : undefined} 
            />
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <MessageSquare className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold">Select a conversation</h2>
              <p>Choose a conversation from the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// #endregion


// #region CONVERSATION LIST
function ConversationList({ conversations, selectedConversationId, isCollapsed, onToggleCollapse, onSelectConversation }: any) {
  const isMobile = useIsMobile();
  return (
    <aside className={cn(
      "flex flex-col h-full border-r transition-all duration-300 ease-in-out bg-card", 
      isCollapsed ? "md:w-20" : "w-full md:w-80"
    )}>
      <div className="p-4 flex items-center justify-between border-b h-20 shrink-0">
        {!isCollapsed && <h2 className="text-xl font-bold font-headline">Messages</h2>}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            <ArrowLeft className={cn("transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <div className={cn("p-2 border-b", isCollapsed && "p-0")}>
        <div className={cn("relative", isCollapsed && "hidden")}>
          <Input placeholder="Search..." className="pl-9 h-9" />
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
          "w-full text-left p-2 rounded-lg cursor-pointer transition-colors",
          isSelected ? "bg-accent" : "hover:bg-accent/50",
          isCollapsed && "flex justify-center"
        )}
        onClick={onSelect}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            {avatar && <AvatarImage src={avatar.imageUrl} alt={conversation.participant.name} />}
            <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm truncate">{conversation.participant.name}</p>
                <p className="text-xs text-muted-foreground shrink-0">{conversation.timestamp}</p>
              </div>
              <p className="text-xs text-muted-foreground truncate">{conversation.listing.title}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground truncate flex-1">{conversation.lastMessage}</p>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="h-5 w-5 p-0 justify-center shrink-0 ml-2">{conversation.unreadCount}</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{conversation.participant.name}</p>
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


// #region CHAT WINDOW
type DealState = 'pre-deal' | 'deal-created' | 'escrow-active';

function ChatWindow({ conversation, onBack }: any) {
  const { user } = useUser();
  const firestore = useFirestore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [dealState, setDealState] = useState<DealState>('pre-deal');

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
    setTimeout(() => {
      setDealState('deal-created');
      setIsLoading(false);
    }, 1000);
  };

  const handleFundEscrow = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDealState('escrow-active');
      setIsLoading(false);
    }, 1500);
  };
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if (scrollableView) {
            scrollableView.scrollTop = scrollableView.scrollHeight;
        }
    }
  }, [messages, dealState]);

  // Mock deal funding flow
  useEffect(() => {
    if (dealState === 'deal-created') {
      const timer = setTimeout(() => handleFundEscrow(), 3000);
      return () => clearTimeout(timer);
    }
  }, [dealState]);

  return (
    <div className="h-full flex flex-col border-l">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b flex justify-between items-center p-4 h-20 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}><ArrowLeft /></Button>}
          <Avatar className="h-10 w-10">
            {avatarArtisan && <AvatarImage src={avatarArtisan.imageUrl} />}
            <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              {conversation.participant.name}
              {conversation.participant.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><ShieldCheck className="w-4 h-4 text-premium" /></TooltipTrigger>
                    <TooltipContent><p>Verified {conversation.participant.role}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">{conversation.participant.role}</p>
          </div>
        </div>

        {listingImage && (
          <div className="hidden md:flex items-center gap-3 bg-muted p-2 rounded-md">
            <Avatar className="rounded-sm">
              <AvatarImage src={listingImage.imageUrl} />
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{conversation.listing.title}</p>
              <p className="text-xs text-muted-foreground">{conversation.listing.price}</p>
            </div>
          </div>
        )}
        <DealStatusBadge state={dealState} />
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 bg-muted/20" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messagesLoading && <Loader2 className="animate-spin mx-auto w-6 h-6 text-muted-foreground" />}
          {messages?.map((message: any) => (
            <MessageBubble key={message.id} message={message} currentUserId={user?.uid} otherUserAvatar={avatarArtisan?.imageUrl} />
          ))}
          {/* This is a mock system message */}
          {dealState === 'escrow-active' && (
             <div className="text-center text-xs text-muted-foreground py-2 my-4 border-y">
                Funds are now held securely in Escrow.
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <footer className="p-4 border-t bg-card shrink-0">
        <MessageInput conversationId={conversation.id} disabled={dealState === 'deal-created' || isLoading} />
        {dealState !== 'pre-deal' && (
          <div className="text-center text-xs text-muted-foreground pt-2">
            {dealState === 'deal-created' && "Deal created. Awaiting funding..."}
            {dealState === 'escrow-active' && "You can now discuss project details."}
          </div>
        )}
        <div className="mt-2 flex gap-2">
          {dealState === 'pre-deal' && <Button onClick={handleCreateDeal} className="flex-1" disabled={isLoading}>{isLoading && <Loader2 className="animate-spin mr-2"/>}Create Deal <Handshake className="ml-2 w-4 h-4" /></Button>}
        </div>
      </footer>
    </div>
  );
}

function MessageBubble({ message, currentUserId, otherUserAvatar }: any) {
  const isSender = message.senderId === currentUserId;
  const avatar = PlaceHolderImages.find(p => p.id === 'user-avatar'); // Assuming current user has this avatar
  
  return (
    <div className={cn("flex max-w-lg items-end gap-2", isSender ? "ml-auto flex-row-reverse" : "mr-auto")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={isSender ? avatar?.imageUrl : otherUserAvatar} />
        <AvatarFallback>{isSender ? 'Y' : 'D'}</AvatarFallback>
      </Avatar>
      <div className={cn("rounded-xl px-3 py-2 shadow-sm", isSender ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}

// #region INPUT FORM
const messageFormSchema = z.object({ content: z.string().min(1).max(1000) });

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
      // Here you could use a toast to notify the user
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
      <Textarea {...form.register("content")} rows={1} placeholder="Type a message..." disabled={disabled} className="flex-1 resize-none" onKeyDown={handleKeyDown} />
      <Button type="submit" disabled={!form.formState.isValid || disabled}><Send className="w-4 h-4" /></Button>
    </form>
  );
}
// #endregion


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
