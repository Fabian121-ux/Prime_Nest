
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
import { ArrowRight, Building, Hammer, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import HeroAnimation from '@/components/layout/hero-animation'

const MotionCard = motion(Card)

const featureCards = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Secure Escrow System',
    description:
      'Payments are held securely until both parties are satisfied, ensuring trust and transparency in every transaction.',
  },
  {
    icon: <Building className="w-8 h-8 text-primary" />,
    title: 'Verified Listings',
    description:
      'Browse a curated selection of properties and services from verified users, reducing risk and uncertainty.',
  },
  {
    icon: <Hammer className="w-8 h-8 text-primary" />,
    title: 'Trusted Professionals',
    description:
      'Connect with skilled artisans and professionals whose identities and skills have been vetted by our platform.',
  },
]

export default function Home() {
  const listings = PlaceHolderImages.filter((p) => p.id.startsWith('listing'));

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative text-center py-20 md:py-32 overflow-hidden">
          <HeroAnimation />
          {/* Foreground content */}
          <div className="relative z-10 container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight mb-4 text-primary-foreground"
            >
              Find Your{' '}
              <span className="inline-block text-primary bg-primary-foreground/80 px-2 py-1 rounded-lg">
                Prime Nest
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8"
            >
              A trust-driven platform for housing and skilled work across Africa.
              Secure, simple, and built for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/explore">Explore Listings</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                A Foundation of Trust
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform is built on principles that ensure security and reliability for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureCards.map((feature, index) => (
                <MotionCard
                  key={index}
                  className="p-8 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-6">{feature.icon}</div>
                  <CardTitle className="text-xl font-headline mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>

        {/* EXPLORE */}
        <section id="explore" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                Explore Prime Nest
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover properties, find skilled artisans, or offer your professional services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {listings.slice(0, 4).map((listing, i) => (
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
            <div className="text-center mt-12">
                <Button asChild size="lg">
                    <Link href="/explore">
                        See More Listings
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
