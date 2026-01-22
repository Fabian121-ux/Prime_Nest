'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, ShieldCheck, Bell } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8 p-4 md:p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3 text-gray-900">
          <User className="w-8 h-8 text-blue-500" />
          Profile
        </h1>
        <p className="text-muted-foreground max-w-md">
          Your profile dashboard is being built. Soon you'll manage all your personal info, settings, and trust level in one place.
        </p>
      </div>

      {/* MAIN CARD */}
      <Card className="max-w-3xl mx-auto mt-4 bg-white/80 backdrop-blur-md shadow-lg rounded-xl border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Coming Soon!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your personal profile and settings page is under construction. Here's what will be available:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* FEATURE LIST */}
          <ul className="space-y-3 text-muted-foreground list-inside list-disc">
            <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              <User className="w-5 h-5 text-blue-400" /> Update your personal information and contact details
            </li>
            <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              <ShieldCheck className="w-5 h-5 text-green-400" /> Manage your verification status and trust tier
            </li>
            <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5 text-yellow-400" /> Set your notification preferences
            </li>
          </ul>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <Button className="flex-1 bg-blue-500 text-white hover:bg-blue-600 shadow-md transition-all">
              Edit Profile
            </Button>
            <Button className="flex-1 bg-gray-100 hover:bg-gray-200 shadow-md transition-all">
              View Verification
            </Button>
            <Button className="flex-1 bg-green-500 text-white hover:bg-green-600 shadow-md transition-all">
              Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* FOOTER MESSAGE */}
      <div className="text-center text-muted-foreground mt-8">
        <p>Stay tuned! This page will soon allow you full control over your account and preferences.</p>
      </div>
    </div>
  );
}
