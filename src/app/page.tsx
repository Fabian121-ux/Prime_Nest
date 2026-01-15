
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import { ArrowRight, Building, Hammer, MapPin, Search, ShieldCheck, UserPlus } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import HeroAnimation from '@/components/layout/hero-animation';
import { motion } from 'framer-motion';


const mockListings = [
  { id: '1', title: 'Cozy 2-Bedroom Apartment', description: 'A beautiful apartment in the heart of the city.', price: 1200000, type: 'property', location: 'Lagos, Nigeria', imageId: 'listing1' },
  { id: '2', title: 'Expert Plumbing Services', description: 'Fast and reliable plumbing solutions for your home.', price: 5000, type: 'service', location: 'Accra, Ghana', imageId: 'listing2' },
  { id: '3', title: 'Modern Studio with a View', description: 'Stunning views from this top-floor studio.', price: 850000, type: 'property', location: 'Nairobi, Kenya', imageId: 'listing3' },
  { id: '4', title: 'Professional Electrical Wiring', description: 'Certified electrician for all your wiring needs.', price: 7500, type: 'service', location: 'Cape Town, South Africa', imageId: 'listing4' },
];

function ListingCard({ listing }: { listing: typeof mockListings[0] }) {
  const Icon = listing.type === 'property' ? Building : Hammer;
  const image = PlaceHolderImages.find(img => img.id === listing.imageId);

  return (
    <Card className="overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
      <div className="relative">
        {image && <Image src={image.imageUrl} alt={listing.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={image.imageHint} />}
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-md">₦{listing.price.toLocaleString()}{listing.type === 'property' ? '' : '/hr'}</div>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{listing.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Icon className="w-4 h-4" />
          <span>{listing.type === 'property' ? 'Property for Rent' : 'Service Available'}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-2">{listing.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-secondary/30 pt-4">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {listing.location}
        </div>
        <Button asChild className="transition-transform hover:scale-105">
          <Link href={`/listing/${listing.id}`}>View <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};


export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden bg-background">
          <HeroAnimation />
          <motion.div 
            className="container mx-auto px-6 text-center relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold font-headline text-foreground"
            >
              <span className="block sm:inline">Find Your </span><span className="inline-block text-primary-foreground bg-primary/90 px-4 py-2 rounded-lg shadow-lg shadow-primary/20">Prime Nest</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              A trust-driven platform for housing and skilled work across Africa. Secure, simple, and built for you.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="#explore">Explore Listings</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="explore" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">Explore Listings</h2>
            <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto">Discover apartments, homes, and professional services from our trusted community members.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {mockListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">How Prime Nest Works</h2>
             <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
              <div className="p-4 transition-transform hover:scale-105 duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mx-auto mb-4 ring-4 ring-primary/10">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-headline">1. Join & Verify</h3>
                <p className="mt-2 text-muted-foreground">Create a single account and choose your role. All users are vetted for trust and safety.</p>
              </div>
              <div className="p-4 transition-transform hover:scale-105 duration-300">
                 <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mx-auto mb-4 ring-4 ring-primary/10">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-headline">2. Find or List</h3>
                <p className="mt-2 text-muted-foreground">Browse property or service listings. Landlords and artisans can easily post their offerings.</p>
              </div>
              <div className="p-4 transition-transform hover:scale-105 duration-300">
                 <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mx-auto mb-4 ring-4 ring-primary/10">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-headline">3. Transact Securely</h3>
                <p className="mt-2 text-muted-foreground">Use our secure escrow system. Funds are held until both parties are satisfied.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
