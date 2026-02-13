"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserEmail(null);
        router.refresh();
      } else if (session?.user) {
        setUserEmail(session.user.email || null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-4xl">
        <div className="font-bold text-lg tracking-tight">Smart Bookmark App</div>
        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{userEmail}</span>
            </div>
          )}
          
          {userEmail && (
            <Button variant="ghost" onClick={handleLogout} size="sm">
                Sign out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
