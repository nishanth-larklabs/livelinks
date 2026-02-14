"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl rounded-full border border-white/40 bg-white/70 shadow-xl shadow-purple-500/5 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 pointer-events-auto"
      >
        <div className="flex h-14 items-center justify-between px-2 pl-6 pr-2">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-extrabold text-lg tracking-tight text-primary cursor-default"
            >
              SmartLinks
            </motion.div>
          </div>
          
          {/* User Controls */}
          <div className="flex items-center gap-2">
            {userEmail ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full ring-1 ring-black/5"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate max-w-[150px]">{userEmail}</span>
                </motion.div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      asChild
                      variant="ghost" 
                      size="icon"
                      onClick={handleLogout} 
                      className="rounded-full h-10 w-10 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <LogOut className="w-4 h-4" />
                      </motion.button>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign out</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
                <div className="text-sm font-medium text-muted-foreground px-4">Welcome Guest</div>
            )}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
