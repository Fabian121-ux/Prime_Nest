
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound, useRouter, useParams } from "next/navigation";

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams<{ listingId: string }>();
  const listing = PlaceHolderImages.find((p) => p.id === params.listingId);

  if (!listing) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
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
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">{listing.title}</CardTitle>
                        <CardDescription className="text-base">{listing.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-3xl font-bold text-primary">{listing.price}</p>
                        <p className="text-muted-foreground">{listing.description}</p>
                        <Button size="lg" className="w-full">Contact Owner</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
