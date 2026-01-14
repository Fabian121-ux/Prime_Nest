import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-8 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-foreground">
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
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
        <div className="md:hidden">
            <Button asChild size="sm">
                <Link href="/login">Login</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
