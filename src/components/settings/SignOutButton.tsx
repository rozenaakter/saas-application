"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      // ✅ Option 1: Go to home page
      await signOut({
        callbackUrl: "/",
      });
      
      // ✅ Option 2: Go to API auth signin page
      // await signOut({
      //   callbackUrl: "/api/auth/signin",
      // });
      
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant="destructive"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </>
      )}
    </Button>
  );
}