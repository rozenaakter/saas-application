// app/settings/page.tsx
// Simple Settings Page

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Calendar,
  LogOut,
} from "lucide-react";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import SignOutButton from "@/components/settings/SignOutButton";

// Get user stats
async function getUserStats(userId: string) {
  const db = await getDb();
  const userObjectId = new ObjectId(userId);

  const totalTasks = await db.collection("tasks").countDocuments({ 
    userId: userObjectId 
  });
  
  const completedTasks = await db.collection("tasks").countDocuments({ 
    userId: userObjectId,
    status: "done" 
  });
  
  const totalProjects = await db.collection("projects").countDocuments({ 
    userId: userObjectId 
  });

  return { totalTasks, completedTasks, totalProjects };
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const stats = await getUserStats(session.user.id as string);

  // Get user initials for avatar
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gray-100 rounded-xl">
            <SettingsIcon className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user.image || undefined} />
                <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-700">
                  {getInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {session.user.name || "User"}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{session.user.email}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Active Account
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Tasks */}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {stats.totalTasks}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>

              {/* Completed Tasks */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {stats.completedTasks}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>

              {/* Projects */}
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sign Out */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sign Out</h4>
                  <p className="text-sm text-gray-600">
                    Sign out from your account
                  </p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>App Name</span>
                <span className="font-medium text-gray-900">SaaS Base AI</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Models</span>
                <Badge variant="outline" className="font-medium">
                  OpenRouter (FREE)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}