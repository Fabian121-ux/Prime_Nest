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
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    href: '/listings',
    label: 'Listings',
    icon: Building2,
  },
  {
    href: '/messages',
    label: 'Messages',
    icon: MessageSquare,
  },
  {
    href: '/wallet',
    label: 'Wallet',
    icon: Wallet,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
];

const adminMenuItems = [
    {
        href: '/support-responses',
        label: 'Support Responses',
        icon: HeartHandshake,
    }
]

export default function DashboardSidebar({ userRole }: { userRole?: 'admin' | 'tenant' | 'landlord' | 'artisan' }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (href: string) => {
    // Special case for the main dashboard link
    if (href === '/dashboard') {
        return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) { // Only close on mobile
      setOpenMobile(false);
    }
  }

  if (!userRole) {
      return <div>Loading user data...</div>
  }

  return (
    <>
      <SidebarHeader className="p-4">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center justify-center gap-3 font-bold text-xl group-data-[state=expanded]:justify-start"
        >
          <div className="p-2 bg-primary/20 text-primary rounded-lg">
            <Home className="text-primary h-5 w-5" />
          </div>
          <span className="font-headline text-sidebar-accent-foreground transition-opacity duration-200 ease-in-out group-data-[state=collapsed]:opacity-0">
            Prime Nest
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
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
          {userRole === 'admin' && adminMenuItems.map((item) => (
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
