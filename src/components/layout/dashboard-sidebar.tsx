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
  BarChart3,
  Users,
  LifeBuoy,
  LogOut,
  Home,
  Settings,
  Star,
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
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    href: '/messages',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/wallet',
    label: 'Favorites',
    icon: Star,
  },
  {
    href: '/profile',
    label: 'Settings',
    icon: Settings,
  },
];

export default function DashboardSidebar() {
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
    setOpenMobile(false);
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
            Prime
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
                  <span className="truncate">{item.label}</span>
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
              tooltip={{ children: "Support", side: "right", align: "center" }}
            >
              <Link href="/support" onClick={handleLinkClick}>
                <LifeBuoy />
                <span>Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: "Logout", side: "right", align: "center" }}
            >
              <Link href="/" onClick={handleLinkClick}>
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
