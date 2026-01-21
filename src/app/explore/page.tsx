
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { PlaceHolderImages } from '@/lib/placeholder-images'

const MotionCard = motion(Card)

export default function ExplorePage() {
  const listings = PlaceHolderImages.filter((p) => p.id.startsWith('listing'));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center justify-center gap-3">
                <Building2 className="w-8 h-8" />
                Explore Prime Nest
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover properties, find skilled artisans, or offer your professional services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {listings.map((listing, i) => (
                <Dialog key={listing.id}>
                  <DialogTrigger asChild>
                    <MotionCard
                      className="group overflow-hidden cursor-pointer"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 * i }}
                      viewport={{ once: true }}
                    >
                      <div className="relative h-56 w-full">
                        <Image
                          src={listing.imageUrl}
                          alt={listing.description!}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={listing.imageHint}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription>{listing.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-bold text-primary">
                          {listing.price}
                        </p>
                      </CardContent>
                    </MotionCard>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={listing.imageUrl}
                          alt={listing.description!}
                          fill
                          className="object-cover"
                          data-ai-hint={listing.imageHint}
                        />
                      </div>
                      <DialogTitle className="text-2xl">{listing.title}</DialogTitle>
                      <DialogDescription>{listing.location}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                      <p className="text-lg font-bold text-primary">{listing.price}</p>
                      <p className="text-muted-foreground">{listing.description}</p>
                    </div>
                    <DialogFooter>
                      <Button asChild size="lg" className="w-full">
                        <Link href={`/listing/${listing.id}`}>View Full Details & Contact Owner</Link>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
      </main>

      <Footer />
    </div>
  )
}
