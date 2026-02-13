"use client";

import { useTransition, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function AddBookmarkForm() {
  const [url, setJsonUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase.from("bookmarks").insert({
        url,
        title,
        user_id: user.id
      });

      if (error) {
        console.error("Error adding bookmark:", error);
        alert("Failed to add bookmark");
      } else {
        setJsonUrl("");
        setTitle("");
      }
    });
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Add New Bookmark</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              type="url"
              required
              value={url}
              onChange={(e) => setJsonUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="My Favorite Site"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? "Adding..." : <><Plus className="w-4 h-4 mr-2" />Add Bookmark</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
