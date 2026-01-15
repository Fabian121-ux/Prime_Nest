'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building, Hammer, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import HeroAnimation from '@/components/layout/hero-animation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MotionCard = motion(Card);

const featureCards = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Secure Escrow System',
    description: 'Payments are held securely until both parties are satisfied, ensuring trust and transparency in every transaction.',
  },
  {
    icon: <Building className="w-8 h-8 text-primary" />,
    title: 'Verified Listings',
    description: 'Browse a curated selection of properties and services from verified users, reducing risk and uncertainty.',
  },
  {
    icon: <Hammer className="w-8 h-8 text-primary" />,
    title: 'Trusted Professionals',
    description: 'Connect with skilled artisans and professionals whose identities and skills have been vetted by our platform.',
  },
];

export default function Home() {
  const listing1 = PlaceHolderImages.find(p => p.id === 'listing1');
  const listing2 = PlaceHolderImages.find(p => p.id === 'listing2');
  const listing3 = PlaceHolderImages.find(p => p.id === 'listing3');
  const listing4 = PlaceHolderImages.find(p => p.id === 'listing4');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 lg:py-40 overflow-hidden">
          <HeroAnimation />
          <div className="container relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight text-foreground mb-4"
            >
              Find Your <span className="text-primary-foreground bg-primary/80 px-2 py-1 rounded-lg">Prime Nest</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8"
            >
              A trust-driven platform for housing and skilled work across Africa. Secure, simple, and built for you.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="flex justify-center gap-4"
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
                  <Link href="#explore">Explore Listings</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">A Foundation of Trust</h2>
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
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <div className="flex justify-center mb-6">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-headline mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* Explore Listings Section */}
        <section id="explore" className="py-16 md:py-24 bg-background">
          <div className="container">
             <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Explore Prime Nest</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover properties, find skilled artisans, or offer your professional services.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {/* Example Listing 1: Property */}
              <MotionCard
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, amount: 0.5 }}
                className="group overflow-hidden"
              >
                {listing1 &&
                <div className="relative h-56 w-full">
                   <Image
                    src={listing1.imageUrl}
                    alt="Modern apartment"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={listing1.imageHint}
                  />
                </div>}
                <CardHeader>
                  <CardTitle>Cozy 2-Bedroom Apartment</CardTitle>
                  <CardDescription>Lekki, Lagos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">₦1,200,000/yr</p>
                    <Button variant="outline" asChild>
                      <Link href="/listing/1">View</Link>
                    </Button>
                  </div>
                </CardContent>
              </MotionCard>

              {/* Example Listing 2: Service */}
              <MotionCard
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="group overflow-hidden"
              >
                {listing2 &&
                <div className="relative h-56 w-full">
                  <Image
                    src={listing2.imageUrl}
                    alt="Plumbing service"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                     data-ai-hint={listing2.imageHint}
                  />
                </div>}
                <CardHeader>
                  <CardTitle>Expert Plumbing Services</CardTitle>
                  <CardDescription>Available Island-wide</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">Contact for Quote</p>
                    <Button variant="outline" asChild>
                       <Link href="/listing/2">View</Link>
                    </Button>
                  </div>
                </CardContent>
              </MotionCard>

              {/* Example Listing 3: Property */}
              <MotionCard
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, amount: 0.5 }}
                className="group overflow-hidden"
              >
               {listing3 &&
                <div className="relative h-56 w-full">
                  <Image
                    src={listing3.imageUrl}
                    alt="Studio apartment with city view"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                     data-ai-hint={listing3.imageHint}
                  />
                </div>}
                <CardHeader>
                  <CardTitle>Modern Studio with a View</CardTitle>
                  <CardDescription>Ikoyi, Lagos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">₦850,000/yr</p>
                    <Button variant="outline" asChild>
                       <Link href="/listing/3">View</Link>
                    </Button>
                  </div>
                </CardContent>
              </MotionCard>
              
              {/* Example Listing 4: Service */}
              <MotionCard
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, amount: 0.5 }}
                className="group overflow-hidden"
              >
               {listing4 &&
                <div className="relative h-56 w-full">
                  <Image
                    src={listing4.imageUrl}
                    alt="Electrical wires"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                     data-ai-hint={listing4.imageHint}
                  />
                </div>}
                <CardHeader>
                  <CardTitle>Professional Electrical Works</CardTitle>
                  <CardDescription>Certified & Insured</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">Contact for Quote</p>
                    <Button variant="outline" asChild>
                       <Link href="/listing/4">View</Link>
                    </Button>
                  </div>
                </CardContent>
              </MotionCard>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
