"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/ui/custom/page-header";
import { Shield, Sliders, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Manage your profile, mess preferences and security."
      >
        <Button>
          Save Changes
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-6">
            <User className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg font-semibold">
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  defaultValue="Admin User"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  defaultValue="admin@messmanager.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 bg-orange-200">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback className="bg-orange-200 text-orange-700 text-xl">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9">
                    Change Photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mess Preferences */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-6">
            <Sliders className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg font-semibold">
              Mess Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="calculationBase">
                  Meal Rate Calculation Base
                </Label>
                <Select defaultValue="variable">
                  <SelectTrigger id="calculationBase">
                    <SelectValue placeholder="Select calculation base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="variable">
                      Variable (Total Expense / Total Meals)
                    </SelectItem>
                    <SelectItem value="fixed">Fixed Rate</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Automatically recalculates rates based on daily market costs.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue="bdt">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bdt">
                      BDT (৳) - Bangladeshi Taka
                    </SelectItem>
                    <SelectItem value="usd">USD ($) - US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <Label className="text-base">Notification Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily reminders to input meal counts and expenses.
                </p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-6">
            <Shield className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg font-semibold">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                defaultValue="password123"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
