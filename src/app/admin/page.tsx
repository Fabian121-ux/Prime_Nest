'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  Building,
  Hammer,
  ChevronDown,
  Loader2,
} from "lucide-react"
import DashboardHeader from "@/components/layout/dashboard-header"
import DashboardSidebar from "@/components/layout/dashboard-sidebar"
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState, useRef } from "react"
import clsx from "clsx"

/* ------------------ MOCK DATA ------------------ */

const mockUsers = [
  { id: 'u1', email: 'tenant@example.com', role: 'tenant', status: 'Approved' },
  { id: 'u2', email: 'landlord-with-a-very-long-email-address-to-test@example.com', role: 'landlord', status: 'Pending' },
  { id: 'u3', email: 'artisan@example.com', role: 'artisan', status: 'Approved' },
]

/* ------------------ HELPERS ------------------ */

const RoleIcon = ({ role }: { role: string }) => {
  if (role === 'tenant') return <User className="h-4 w-4" />
  if (role === 'landlord') return <Building className="h-4 w-4" />
  if (role === 'artisan') return <Hammer className="h-4 w-4" />
  return null
}

/* ------------------ SWIPE HOOK ------------------ */

function useSwipe(onSwipeRight: () => void) {
  const startX = useRef<number | null>(null)

  return {
    onTouchStart: (e: React.TouchEvent) => {
      startX.current = e.touches[0].clientX
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!startX.current) return
      const diff = e.changedTouches[0].clientX - startX.current
      if (diff > 80) onSwipeRight()
      startX.current = null
    },
  }
}

/* ------------------ PAGE ------------------ */

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [rowLoading, setRowLoading] = useState<string | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const handleApprove = async (id: string) => {
    setRowLoading(id)
    await new Promise(r => setTimeout(r, 1000))
    setRowLoading(null)
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardSidebar userRole="admin" />
      </Sidebar>

      <SidebarInset>
        <DashboardHeader />

        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

          <header>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, listings, and payments
            </p>
          </header>

          {/* ---------------- USERS ---------------- */}

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Approve new users</CardDescription>
            </CardHeader>

            <CardContent>
              {/* SKELETON */}
              {loading && (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              )}

              {/* DESKTOP TABLE */}
              {!loading && (
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {mockUsers.map(user => (
                        <>
                          <TableRow
                            key={user.id}
                            className="cursor-pointer"
                            onClick={() =>
                              setExpandedRow(
                                expandedRow === user.id ? null : user.id
                              )
                            }
                          >
                            <TableCell className="font-medium">
                              {user.email}
                            </TableCell>
                            <TableCell className="flex items-center gap-2 capitalize">
                              <RoleIcon role={user.role} />
                              {user.role}
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'Approved' ? 'secondary' : 'outline'}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <ChevronDown
                                className={clsx(
                                  "h-4 w-4 transition",
                                  expandedRow === user.id && "rotate-180"
                                )}
                              />
                            </TableCell>
                          </TableRow>

                          {/* COLLAPSIBLE */}
                          {expandedRow === user.id && (
                            <TableRow>
                              <TableCell colSpan={4}>
                                {user.status === 'Pending' && (
                                  <Button
                                    size="sm"
                                    disabled={rowLoading === user.id}
                                    onClick={() => handleApprove(user.id)}
                                  >
                                    {rowLoading === user.id && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Approve User
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* MOBILE CARDS + SWIPE */}
              {!loading && (
                <div className="space-y-4 md:hidden">
                  {mockUsers.map(user => {
                    const swipe = useSwipe(() => {
                      if (user.status === 'Pending') handleApprove(user.id)
                    })

                    return (
                      <Card
                        key={user.id}
                        className="p-4"
                        {...swipe}
                      >
                        <div className="space-y-2">
                          <p className="font-medium break-words">{user.email}</p>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <RoleIcon role={user.role} />
                            <span className="capitalize">{user.role}</span>
                          </div>

                          <Badge
                            className="w-fit"
                            variant={user.status === 'Approved' ? 'secondary' : 'outline'}
                          >
                            {user.status}
                          </Badge>

                          {user.status === 'Pending' && (
                            <Button
                              size="sm"
                              className="w-full"
                              disabled={rowLoading === user.id}
                              onClick={() => handleApprove(user.id)}
                            >
                              {rowLoading === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Approve (Swipe →)"
                              )}
                            </Button>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
