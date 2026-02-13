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
        <Card key={bookmark.id} className="group relative overflow-hidden transition-all hover:shadow-md border border-black/5 bg-white">
          <div className="p-5 flex flex-col gap-3 h-full">
            <div className="flex items-start justify-between gap-2">
                <Favicon url={bookmark.url} title={bookmark.title} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(bookmark.id)}
                  aria-label="Delete bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
            </div>
            
            <div className="space-y-1">
                <h3 className="font-bold text-gray-900 leading-tight line-clamp-1" title={bookmark.title}>
                    {bookmark.title}
                </h3>
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary truncate block flex items-center gap-1 transition-colors"
                    title={bookmark.url}
                >
                    <span className="truncate">{new URL(bookmark.url).hostname}</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
            </div>
          </div>
          
          {/* Decorative bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
      ))}
    </div>
  );
}
