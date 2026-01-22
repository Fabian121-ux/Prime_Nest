'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { Handshake, Loader2, ShieldCheck, Lock, Send, MoreHorizontal, ArrowLeft, MessageSquare, FileText, Gavel, CheckCircle2 } from "lucide-react";

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
    if (!isMobile && !selectedConversationId) {
      setSelectedConversationId(MOCK_CONVERSATION_ID);
    }
  }, [isMobile, selectedConversationId]);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return mockConversations.find(c => c.id === selectedConversationId);
  }, [selectedConversationId]);

  const showDetail = isMobile ? !!selectedConversationId : true;
  const showList = isMobile ? !selectedConversationId : true;

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.32))] bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="border rounded-xl h-full grid grid-cols-1 md:grid-cols-[auto,1fr] shadow-xl overflow-hidden bg-white/80 backdrop-blur-md">
        {/* Conversation List */}
        <div className={cn({ 'hidden': !showList, 'md:block': true })}>
          <ConversationList
            conversations={mockConversations}
            selectedConversationId={selectedConversationId}
            isCollapsed={isListCollapsed}
            onToggleCollapse={() => setIsListCollapsed(prev => !prev)}
            onSelectConversation={(id) => setSelectedConversationId(id)}
          />
        </div>

        {/* Chat Window */}
        <div className={cn('h-full flex flex-col', { 'hidden': !showDetail, 'md:flex': true })}>
          {selectedConversation ? (
            <ChatWindow 
              conversation={selectedConversation} 
              key={selectedConversation.id} 
              onBack={isMobile ? () => setSelectedConversationId(null) : undefined} 
            />
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center text-muted-foreground">
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
  return (
    <aside className={cn("flex flex-col h-full border-r transition-all duration-300 ease-in-out bg-white", isCollapsed ? "md:w-20" : "w-full md:w-80")}>
      <div className="p-4 flex items-center justify-between border-b h-20">
        {!isCollapsed && <h2 className="text-xl font-bold font-headline">Messages</h2>}
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="hidden md:flex">
          {isCollapsed ? <ArrowLeft /> : <ArrowLeft className="rotate-180" />}
        </Button>
      </div>

      {/* Search */}
      <div className="p-2 border-b">
        <div className="relative">
          <Input placeholder="Search..." className={cn("pl-9", isCollapsed && "hidden")} />
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

function ConversationListItem({ conversation, isCollapsed, isSelected, onSelect }: any) {
  const avatar = PlaceHolderImages.find(p => p.id === conversation.participant.avatarId);
  return (
    <div 
      className={cn("w-full text-left p-2 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200", isSelected ? "bg-primary/20" : "bg-white")}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          {avatar && <AvatarImage src={avatar.imageUrl} alt={conversation.participant.name} />}
          <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="font-semibold text-sm truncate">{conversation.participant.name}</p>
          <p className="text-xs text-muted-foreground truncate">{conversation.listing.title}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">{conversation.lastMessage}</p>
        </div>
        {conversation.unreadCount > 0 && (
          <Badge className="h-5 w-5 p-0 justify-center">{conversation.unreadCount}</Badge>
        )}
      </div>
    </div>
  );
}
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

  useEffect(() => {
    if (dealState === 'deal-created') {
      const timer = setTimeout(() => handleFundEscrow(), 3000);
      return () => clearTimeout(timer);
    }
  }, [dealState]);

  return (
    <Card className="h-full flex flex-col shadow-md border rounded-xl overflow-hidden">
      {/* Header */}
      <CardHeader className="sticky top-0 z-20 bg-white border-b flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          {onBack && <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}><ArrowLeft /></Button>}
          <Avatar className="h-10 w-10">
            {avatarArtisan && <AvatarImage src={avatarArtisan.imageUrl} />}
            <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-1">
              {conversation.participant.name}
              {conversation.participant.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><ShieldCheck className="w-4 h-4 text-blue-500" /></TooltipTrigger>
                    <TooltipContent><p>Verified {conversation.participant.role}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{conversation.participant.role}</CardDescription>
          </div>
        </div>

        {listingImage && (
          <div className="hidden md:flex items-center gap-3 bg-gray-100 p-2 rounded-md">
            <Avatar>
              <AvatarImage src={listingImage.imageUrl} />
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{conversation.listing.title}</p>
              <p className="text-xs text-muted-foreground">{conversation.listing.price}</p>
            </div>
          </div>
        )}
        <DealStatusBadge state={dealState} />
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1 bg-gray-50" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messagesLoading && <Loader2 className="animate-spin mx-auto w-6 h-6 text-muted-foreground" />}
          {messages?.map((message: any) => (
            <MessageBubble key={message.id} message={message} currentUserId={user?.uid} otherUserAvatar={avatarArtisan?.imageUrl} />
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <CardFooter className="p-4 border-t bg-white">
        <MessageInput conversationId={conversation.id} disabled={dealState === 'deal-created' || isLoading} />
        <div className="mt-2 flex gap-2">
          {dealState === 'pre-deal' && <Button onClick={handleCreateDeal} className="flex-1">Create Deal <Handshake className="ml-2 w-4 h-4" /></Button>}
        </div>
      </CardFooter>
    </Card>
  );
}

function MessageBubble({ message, currentUserId, otherUserAvatar }: any) {
  const isSender = message.senderId === currentUserId;
  return (
    <div className={cn("flex max-w-md items-end gap-2", isSender ? "ml-auto justify-end" : "mr-auto justify-start")}>
      {!isSender && <Avatar className="h-8 w-8"><AvatarImage src={otherUserAvatar} /><AvatarFallback>D</AvatarFallback></Avatar>}
      <div className={cn("rounded-xl px-3 py-2 shadow-sm", isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900")}>
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
    const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, { senderId: user.uid, content: values.content, type: 'text', createdAt: serverTimestamp() });
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end">
      <Textarea {...form.register("content")} rows={1} placeholder="Type a message..." disabled={disabled} className="flex-1 resize-none" />
      <Button type="submit" disabled={!form.formState.isValid || disabled}><Send className="w-4 h-4" /></Button>
    </form>
  );
}
// #endregion


const DealStatusBadge = ({ state }: { state: DealState }) => {
  const statusMap: any = {
    'pre-deal': { text: 'No Deal Yet', className: 'bg-gray-200 text-gray-700' },
    'deal-created': { text: 'Deal Created', className: 'bg-yellow-300 text-yellow-900' },
    'escrow-active': { text: 'Funds in Escrow', className: 'bg-green-500 text-white', icon: <Lock className="w-3 h-3" /> }
  };
  const current = statusMap[state];
  return <Badge className={cn("gap-1.5", current.className)}>{current.icon}{current.text}</Badge>;
};
