"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Smart Bookmark App</h1>
        <p className="text-muted-foreground">
          Save, organize, and access your favorite links from anywhere.
        </p>
      </div>
      
      <div className="p-8 border rounded-xl shadow-sm bg-card w-full max-w-md">
         <h2 className="text-lg font-semibold mb-6">Sign In</h2>
         <Button 
           onClick={handleLogin} 
           disabled={isLoading}
           className="w-full flex items-center gap-2 justify-center"
           size="lg"
         >
           {isLoading ? (
             <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
           ) : (
             <Compass className="w-5 h-5" />
           )}
           Sign in with Google
         </Button>
         <p className="text-xs text-muted-foreground mt-4">
           Secure authentication via Supabase & Google
         </p>
      </div>
    </div>
  );
}
