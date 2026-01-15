'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, DonutChart, Legend, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Pie, PieChart, Cell } from "recharts";
import { ArrowUp, Users, Building2, Hammer, MoreHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";

const lineChartData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 500 },
  { name: 'Apr', users: 450 },
  { name: 'May', users: 600 },
  { name: 'Jun', users: 800 },
];

const barChartData = [
    { name: 'Rentals', count: 120 },
    { name: 'Jobs', count: 80 },
    { name: 'Services', count: 150 },
];

const pieChartData = [
  { name: 'Tenants', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Landlords', value: 150, color: 'hsl(var(--chart-2))' },
  { name: 'Artisans', value: 250, color: 'hsl(var(--chart-4))' },
];


export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Stat Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,974</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ArrowUp className="h-3 w-3 text-green-500" />
            +287 this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">350</div>
           <p className="text-xs text-muted-foreground">+32 this week</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Artisan Services</CardTitle>
          <Hammer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">150</div>
          <p className="text-xs text-muted-foreground">+12 new services</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Escrow Transactions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89</div>
          <p className="text-xs text-muted-foreground">₦12.5M in escrow</p>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card className="sm:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="sm:col-span-2 lg:col-span-2">
          <CardContent className="p-0 flex items-center justify-center">
            <Calendar
                mode="single"
                className="p-0"
                classNames={{
                    root: 'w-full border-0',
                    caption: 'px-4 pt-3',
                    head_cell: 'w-full',
                    table: 'w-full p-3 border-t-0',
                }}
            />
          </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="sm:col-span-1">
        <CardHeader>
          <CardTitle>Listings by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{fill: 'hsl(var(--muted))'}}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Donut Chart */}
      <Card className="sm:col-span-1">
        <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                        }}
                    />
                    <Legend iconType="circle" iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

       {/* Progress Card */}
       <Card className="sm:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile Completion</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-center">
                <div className="relative inline-block">
                    <Progress value={75} className="w-32 h-32 rounded-full [&>div]:bg-primary" style={{ clipPath: 'circle(50% at 50% 50%)' }}/>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">75%</span>
                </div>
            </div>
          <p className="text-center text-sm text-muted-foreground">Complete your profile to increase your Trust Tier.</p>
          <Button className="w-full">Complete Profile</Button>
        </CardContent>
      </Card>
    </div>
  )
}
