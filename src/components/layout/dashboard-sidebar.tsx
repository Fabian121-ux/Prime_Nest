"use client";

import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Wallet,
  User,
  LifeBuoy,
  Home
} from "lucide-react";
import Link from 'next/link';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/listings',
    label: 'Listings / Jobs',
    icon: Building2,
  },
  {
    href: '/messages',
    label: 'Messages',
    icon: MessageSquare,
  },
  {
    href: '/wallet',
    label: 'Escrow Wallet',
    icon: Wallet,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl">
            <div className="p-2 bg-primary/10 text-primary rounded-md">
            <Home className="text-sidebar-primary h-5 w-5" />
            </div>
            <span className="font-headline text-sidebar-foreground group-data-[collapsed=icon]:hidden">Prime Nest</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
           <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild
                    tooltip={{ children: "Support", side: "right", align: "center" }}
                >
                    <Link href="/support">
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
