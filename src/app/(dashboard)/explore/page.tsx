'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import React, { useState, useMemo } from 'react'

const MotionCard = motion(Card)

export default function ExplorePage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allListings = PlaceHolderImages.filter((p) => p.id.startsWith('listing'));

  const filteredListings = useMemo(() => {
    return allListings
      .filter((listing) => {
        if (filter === 'all') return true;
        return listing.type === filter;
      })
      .filter((listing) => {
        if (!searchTerm) return true;
        return listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               listing.location?.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [allListings, filter, searchTerm]);

  return (
    <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <Building2 className="w-8 h-8" />
            Explore Prime Nest
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover properties, find skilled artisans, or offer your professional services.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, description, or location..."
              className="pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
              <Button variant={filter === 'rental' ? 'default' : 'outline'} onClick={() => setFilter('rental')}>Properties</Button>
              <Button variant={filter === 'service' ? 'default' : 'outline'} onClick={() => setFilter('service')}>Services</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredListings.map((listing, i) => (
             <Link href={`/listing/${listing.id}`} key={listing.id} className="block">
                <MotionCard
                  className="group overflow-hidden cursor-pointer flex flex-col h-full"
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={listing.imageHint}
                    />
                    {listing.verified && (
                        <Badge variant="premium" className="absolute top-3 right-3">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1"/>
                            Verified
                        </Badge>
                    )}
                  </div>
                  <CardHeader className="flex-1">
                    <CardTitle>{listing.title}</CardTitle>
                    <CardDescription>{listing.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-primary">
                      {listing.price}
                    </p>
                  </CardContent>
                </MotionCard>
              </Link>
          ))}
        </div>
        {filteredListings.length === 0 && (
            <div className="text-center col-span-full py-16">
                <h2 className="text-xl font-semibold">No Listings Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
        )}
      </div>
  )
}
