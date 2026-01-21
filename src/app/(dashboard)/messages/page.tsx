'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ShieldCheck, Lock, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
const adminAvatar = PlaceHolderImages.find(p => p.id === 'admin-avatar');

const messages = [
    {
        type: 'user',
        sender: 'David Okoro',
        avatar: userAvatar?.imageUrl,
        text: "Hello, I'm interested in the plumbing service. Are you available this Friday?",
        time: "10:30 AM"
    },
    {
        type: 'user',
        sender: 'You',
        avatar: adminAvatar?.imageUrl,
        text: "Hi David, yes I am. We can create a deal and lock the payment in escrow to secure the booking.",
        time: "10:32 AM",
        isYou: true,
    },
    {
        type: 'system',
        icon: Lock,
        color: 'text-trust',
        text: 'DEAL CREATED: Payment of ₦25,000 has been locked in escrow.',
        time: "10:35 AM"
    },
    {
        type: 'system',
        icon: ShieldCheck,
        color: 'text-premium',
        text: 'David Okoro has been a verified Prime Nest user for 2 years.',
        time: "10:36 AM"
    },
    {
        type: 'user',
        sender: 'David Okoro',
        avatar: userAvatar?.imageUrl,
        text: "Perfect, payment is locked in. See you on Friday!",
        time: "10:38 AM"
    },
    {
        type: 'system',
        icon: AlertCircle,
        color: 'text-destructive',
        text: 'DISPUTE RAISED: A dispute has been opened for this transaction. An admin will review it shortly.',
        time: "11:15 AM"
    }
]

export default function MessagesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                Messages
            </h1>
            <p className="text-muted-foreground">A demonstration of chat with integrated deal flow and trust cues.</p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Chat with David Okoro</CardTitle>
            <CardDescription>
              Regarding: Expert Plumbing Services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {messages.map((msg, index) => {
                if (msg.type === 'system') {
                    return (
                        <div key={index} className="flex items-center gap-3 text-xs text-muted-foreground">
                            <msg.icon className={cn("w-4 h-4", msg.color)} />
                            <span className={cn("font-medium", msg.color)}>{msg.text}</span>
                            <span className="ml-auto flex-shrink-0">{msg.time}</span>
                        </div>
                    )
                }
                return (
                     <div key={index} className={cn("flex items-start gap-4", msg.isYou && "justify-end")}>
                        {!msg.isYou && (
                            <Avatar className="w-8 h-8 border">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>{msg.sender?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "max-w-[75%] space-y-1",
                            msg.isYou && "text-right"
                        )}>
                            <div className={cn(
                                "p-3 rounded-lg",
                                msg.isYou ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                            )}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            <p className="text-xs text-muted-foreground px-1">{msg.sender} • {msg.time}</p>
                        </div>
                         {msg.isYou && (
                            <Avatar className="w-8 h-8 border">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                )
            })}
          </CardContent>
        </Card>
    </div>
  );
}
