"use client";

import { useState } from "react";
import { UserPlus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessToast } from "@/lib/utils";

export function InviteMemberModal({ inviteCode }: { inviteCode?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setIsCopied(true);
      SuccessToast("Invite code copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Share this invite code with your mess members to join this mess.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="invite-code" className="sr-only">
              Invite Code
            </Label>
            <Input
              id="invite-code"
              defaultValue={inviteCode || "No code available"}
              readOnly
              className="font-mono text-lg text-center font-bold tracking-widest"
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          <p className="font-semibold mb-1">How to join?</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Member needs to register an account</li>
            <li>Select &quot;Join Mess&quot; during setup</li>
            <li>Enter this code: <span className="font-mono font-bold text-primary">{inviteCode}</span></li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}
