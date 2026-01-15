
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="py-4 px-6 md:px-8 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-foreground transition-transform hover:scale-105">
          <div className="p-2 bg-primary rounded-md">
            <Home className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="font-headline">Prime Nest</span>
        </Link>
        <nav className="hidden md:flex gap-2 items-center">
          <Button variant="ghost" asChild>
            <Link href="/#explore">Explore</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="transition-transform hover:scale-105">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
                <div className="flex flex-col gap-4 py-8">
                   <Link href="/" className="flex items-center gap-3 font-bold text-lg text-foreground mb-4" onClick={() => setIsSheetOpen(false)}>
                      <div className="p-2 bg-primary rounded-md">
                        <Home className="text-primary-foreground h-5 w-5" />
                      </div>
                      <span className="font-headline">Prime Nest</span>
                    </Link>
                    <Button variant="ghost" className="justify-start text-base" asChild>
                      <Link href="/#explore" onClick={() => setIsSheetOpen(false)}>Explore</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-base" asChild>
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="transition-transform hover:scale-105 text-base">
                      <Link href="/signup" onClick={() => setIsSheetOpen(false)}>Sign Up</Link>
                    </Button>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
