'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Mail, ShieldCheck, Edit } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProfilePage() {
    const { user } = useUser();
    const avatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <UserIcon className="w-8 h-8" />
                    My Profile
                </h1>
                <p className="text-muted-foreground">Manage your account details, settings, and verification status.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Profile Card & Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Avatar className="h-20 w-20">
                                {avatar && <AvatarImage src={avatar.imageUrl} alt={user?.displayName || user?.email || 'User'} />}
                                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-2xl">{user?.displayName || "New User"}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4" />
                                    {user?.email}
                                </CardDescription>
                            </div>
                            <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <Label htmlFor="profile-completion">Profile Completion</Label>
                                  <span className="text-sm font-medium text-muted-foreground">40%</span>
                                </div>
                                <Progress value={40} id="profile-completion" className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Manage how you receive notifications from Prime Nest.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive important account updates and messages via email.</p>
                                </div>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="push-notifications" className="text-base font-medium">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get real-time alerts on your devices. (Coming soon)</p>
                                </div>
                                <Switch id="push-notifications" disabled />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Verification Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader className="items-center">
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-premium" />
                                Trust & Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                             <p className="text-6xl font-bold text-premium">Tier 1</p>
                             <p className="text-muted-foreground">Your current trust tier. Higher tiers unlock more benefits.</p>
                             <Button className="w-full">Get Verified</Button>
                             <p className="text-xs text-muted-foreground mt-2">Verification improves your trust tier and builds confidence with others on the platform.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}