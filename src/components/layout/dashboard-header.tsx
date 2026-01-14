"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Home, LogOut, User, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mock user data for demo. In a real app, this would come from an auth context.
const user = {
  name: 'Admin User',
  email: 'admin@primenest.app',
  role: 'admin', // Switch to 'tenant', 'landlord', 'artisan' to test different views
  avatarId: 'admin-avatar'
};

const getRoleName = (role: string) => {
    switch (role) {
        case 'tenant': return 'Tenant';
        case 'artisan': return 'Artisan';
        case 'landlord': return 'Landlord';
        case 'admin': return 'Administrator';
        default: return 'User';
    }
}

export default function DashboardHeader() {
  const router = useRouter();
  const avatar = PlaceHolderImages.find(img => img.id === user.avatarId);

  const handleLogout = () => {
    // TODO: Implement Firebase logout
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl">
          <div className="p-2 bg-primary rounded-md">
            <Home className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-headline hidden sm:inline">Prime Nest</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:block">
            Role: <span className="font-semibold text-foreground">{getRoleName(user.role)}</span>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  {avatar && <AvatarImage src={avatar.imageUrl} alt={user.name} data-ai-hint={avatar.imageHint} />}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <User className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              {user.role === 'admin' && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
