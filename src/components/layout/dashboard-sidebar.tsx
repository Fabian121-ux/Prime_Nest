
'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  Building2,
  MessageSquare,
  Wallet,
  User,
  LifeBuoy,
  Home,
  Compass,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    roles: ['tenant', 'landlord', 'artisan'],
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
    roles: ['tenant', 'landlord', 'artisan'],
  },
  {
    href: '/listings',
    label: 'My Listings',
    icon: Building2,
    roles: ['landlord', 'artisan'],
  },
  {
    href: '/messages',
    label: 'Messages',
    icon: MessageSquare,
    roles: ['tenant', 'landlord', 'artisan'],
  },
  {
    href: '/wallet',
    label: 'Wallet',
    icon: Wallet,
    roles: ['tenant', 'landlord', 'artisan'],
  },
    {
    href: '/profile',
    label: 'Profile',
    icon: User,
    roles: ['tenant', 'landlord', 'artisan'],
  },
];

const adminMenuItems = [
    {
        href: '/admin',
        label: 'Admin Dashboard',
        icon: Shield,
        roles: ['admin'],
    },
    // Add other admin-specific links here
];

export default function DashboardSidebar({ userRole }: { userRole?: 'admin' | 'tenant' | 'landlord' | 'artisan' }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (href: string) => {
    // Special case for the main dashboard link
    if (href === '/dashboard' || href === '/admin') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) { // Only close on mobile
      setOpenMobile(false);
    }
  }

  const availableMenuItems = userRole === 'admin' 
    ? adminMenuItems 
    : menuItems.filter(item => item.roles.includes(userRole!));


  return (
    <>
      <SidebarHeader className="p-4">
        <Link
          href={userRole === 'admin' ? '/admin' : '/dashboard'}
          onClick={handleLinkClick}
          className="flex items-center justify-center gap-3 font-bold text-xl group-data-[state=expanded]:justify-start text-sidebar-foreground"
        >
          <div className="p-2 bg-primary rounded-lg">
            <Home className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="font-headline transition-opacity duration-200 ease-in-out group-data-[state=collapsed]:opacity-0">
            Prime Nest
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {availableMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <Link href={item.href} onClick={handleLinkClick}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/support')}
              tooltip={{ children: "Support", side: "right", align: "center" }}
            >
              <Link href="/support" onClick={handleLinkClick}>
                <LifeBuoy />
                <span>Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
