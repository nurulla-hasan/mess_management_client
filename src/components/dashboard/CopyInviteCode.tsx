"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SuccessToast } from "@/lib/utils";

export function CopyInviteCode({ code }: { code?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      SuccessToast("Invite code copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors" 
      onClick={handleCopy}
      title="Copy Invite Code"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-primary" />
      )}
    </Button>
  );
}
