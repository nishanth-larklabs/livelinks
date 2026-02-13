"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ExternalLink, Globe } from "lucide-react";
import { Favicon } from "./Favicon";

type Bookmark = {
  id: string;
  url: string;
  title: string;
  created_at: string;
};

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else {
        setBookmarks(data as Bookmark[]);
      }
      setLoading(false);
    };

    fetchBookmarks();

    const channel = supabase
      .channel("realtime bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((bookmark) => bookmark.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((bookmark) =>
                bookmark.id === payload.new.id
                  ? (payload.new as Bookmark)
                  : bookmark
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleDelete = async (id: string) => {
    const originalBookmarks = [...bookmarks];
    setBookmarks(bookmarks.filter((b) => b.id !== id));

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting bookmark:", error);
      setBookmarks(originalBookmarks);
      alert("Failed to delete bookmark");
    }
  };

  if (loading) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-secondary/20 animate-pulse rounded-3xl" />
            ))}
        </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/10 rounded-3xl border border-dashed border-secondary">
            <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
                <Globe className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground/60">Add your first link above!</p>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="group relative overflow-hidden transition-all hover:bg-slate-50 hover:shadow-sm border border-black/5 bg-white">
          <div className="p-4 flex items-center gap-4">
            {/* Icon */}
            <Favicon url={bookmark.url} title={bookmark.title} />
            
            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-2">
                    <a 
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-gray-900 leading-tight truncate hover:text-primary transition-colors text-base" 
                        title={bookmark.title}
                    >
                        {bookmark.title}
                    </a>
                    
                    {/* Always visible delete on mobile, hover on desktop */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(bookmark.id);
                        }}
                        aria-label="Delete bookmark"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="truncate max-w-[180px] bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-600 font-medium">
                        {new URL(bookmark.url).hostname}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-30" />
                </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
