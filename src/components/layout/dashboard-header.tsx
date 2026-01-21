"use client";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Shield, Search, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { Input } from '../ui/input';
import { doc } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './theme-toggle';

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
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();


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
    <header className="sticky top-0 z-30 w-full border-b bg-card/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
            <SidebarTrigger onClick={toggleSidebar} />
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2 text-muted-foreground">
          <div className="w-full max-w-sm ml-auto">
            {isMobile ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen max-w-[calc(100vw-2rem)] p-2">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9" />
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 bg-muted/50 border-none" />
              </div>
            )}
          </div>
          
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
              <span className="sr-only">Notifications</span>
          </Button>

          {isUserLoading ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary">
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
