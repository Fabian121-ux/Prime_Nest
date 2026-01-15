"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Home, LogOut, User, Shield, Search, Bell, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { SidebarTrigger } from '../ui/sidebar';
import { Input } from '../ui/input';
import { doc } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userData } = useDoc(userDocRef);
  
  const userRole = (userData as any)?.rolePrimary;
  const avatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <SidebarTrigger/>
            <Link href="/dashboard" className="hidden items-center gap-3 font-bold text-xl md:flex">
              <div className="p-2 bg-sidebar-background rounded-md">
                <Home className="text-sidebar-foreground h-5 w-5" />
              </div>
              <span className="font-headline text-foreground group-data-[collapsed=true]:hidden">Prime Nest</span>
            </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-center px-4 md:px-0">
            {/* Desktop Search Bar */}
            <div className="hidden md:block w-full max-w-md lg:max-w-lg">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input placeholder="Search..." className="pl-10 bg-muted border-none focus-visible:ring-primary"/>
                </div>
            </div>
             {/* Mobile Search Popover */}
            <div className="md:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Search</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                      <Input placeholder="Search..." className="pl-10 bg-muted border-none focus-visible:ring-primary"/>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-card"></span>
              <span className="sr-only">Notifications</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Wallet className="h-5 w-5" />
                <span className="sr-only">Escrow Status</span>
            </Button>
            <span className="text-sm font-semibold hidden lg:inline">Escrow: ₦1,250,000</span>
          </div>
          {isUserLoading ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {avatar && <AvatarImage src={avatar.imageUrl} alt={user.displayName || 'User'} data-ai-hint={avatar.imageHint} />}
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                    {userRole && <p className="text-xs leading-none text-muted-foreground">
                      {getRoleName(userRole)}
                    </p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {userRole === 'admin' && (
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
          )}
        </div>
      </div>
    </header>
  );
}
