/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createMess, joinMess, logOut } from "@/services/auth";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, Plus, LogIn, LogOut } from "lucide-react";

export default function SetupMess({ user }: { user: any }) {
  const isAdmin = user?.role === "admin";
  const [isLoading, setIsLoading] = useState(false);
  const [messName, setMessName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();

  const handleCreateMess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messName.trim()) return;

    setIsLoading(true);
    try {
      const result = await createMess({ name: messName });
      if (result?.success) {
        SuccessToast("Mess created successfully!");
        router.push("/");
        router.refresh();
      } else {
        ErrorToast(result?.message || "Failed to create mess");
      }
    } catch (error: any) {
      ErrorToast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsLoading(true);
    try {
      const result = await joinMess(inviteCode);
      if (result?.success) {
        SuccessToast("Mess joined successfully!");
        router.push("/");
        router.refresh();
      } else {
        ErrorToast(result?.message || "Failed to join mess");
      }
    } catch (error: any) {
      ErrorToast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-2xl shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Setup Your Mess</CardTitle>
          <CardDescription className="text-center">
            To continue, you need to either create a new mess or join an existing one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isAdmin ? "create" : "join"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              {isAdmin && <TabsTrigger value="create">Create Mess</TabsTrigger>}
              <TabsTrigger value="join">Join Mess</TabsTrigger>
            </TabsList>

            {isAdmin && (
              <TabsContent value="create">
                <form onSubmit={handleCreateMess} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="messName">Mess Name</Label>
                    <Input
                      id="messName"
                      placeholder="e.g. Dream Mess"
                      value={messName}
                      onChange={(e) => setMessName(e.target.value)}
                      required
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Create Mess
                  </Button>
                </form>
              </TabsContent>
            )}

            <TabsContent value="join">
              <form onSubmit={handleJoinMess} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    placeholder="Enter 6-digit code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Join Mess
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t">
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
