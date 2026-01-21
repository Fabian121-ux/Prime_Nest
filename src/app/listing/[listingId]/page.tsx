'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { ArrowLeft, MessageSquare, Loader2, Wallet } from "lucide-react";
import { notFound, useRouter, useParams } from "next/navigation";
import { useUser } from "@/firebase";
import Link from "next/link";

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams<{ listingId: string }>();
  const { user, isUserLoading } = useUser();
  const listing = PlaceHolderImages.find((p) => p.id === params.listingId);

  if (!listing) {
    notFound();
  }
  
  const handleContact = () => {
    if (!user) {
      router.push('/login');
    } else {
      // Placeholder for future chat functionality
      console.log("User is logged in. Ready to initiate contact.");
      // In the future, this would open a chat modal or navigate to a messages page.
    }
  };

  const handleEscrow = () => {
    if (!user) {
      router.push('/login');
    } else {
      // Placeholder for future escrow functionality
      console.log("User is logged in. Ready to initiate escrow process.");
      // In the future, this would open a deal creation modal.
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/explore')} className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Image Column */}
            <div className="md:col-span-2">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={listing.imageUrl}
                        alt={listing.title!}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 67vw"
                        data-ai-hint={listing.imageHint}
                    />
                </div>
            </div>

            {/* Details Column */}
            <div className="md:col-span-1">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">{listing.title}</CardTitle>
                        <CardDescription className="text-base">{listing.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                        <div>
                            <p className="text-3xl font-bold text-primary mb-2">{listing.price}</p>
                            <p className="text-muted-foreground">{listing.description}</p>
                        </div>
                        <div className="space-y-3">
                            <Button size="lg" className="w-full" onClick={handleContact} disabled={isUserLoading}>
                                {isUserLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                ) : (
                                    <MessageSquare className="mr-2 h-5 w-5"/>
                                )}
                                Contact Owner
                            </Button>
                            <Button size="lg" variant="secondary" className="w-full" onClick={handleEscrow} disabled={isUserLoading}>
                                {isUserLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <Wallet className="mr-2 h-5 w-5" />
                                )}
                                Place into Escrow
                            </Button>
                        </div>
                        <div className="text-xs text-center text-muted-foreground pt-4">
                            By contacting the owner, you agree to our{' '}
                            <Link href="/terms" className="underline hover:text-primary">
                                Terms of Service
                            </Link>.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
