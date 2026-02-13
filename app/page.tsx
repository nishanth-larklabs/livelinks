import { createClient } from "@/utils/supabase/server";
import Login from "@/components/Login";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutGrid, Plus } from "lucide-react";

export const metadata = {
  title: "SmartLinks | Organize Your Web",
  description: "A beautiful way to save and organize your bookmarks.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-purple-50/50 to-background">
        <Login />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-background pt-28 pb-12 px-4 selection:bg-primary/20">
      <div className="container max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Hello, <span className="text-primary truncate">{user.email?.split('@')[0]}</span>
            </h1>
            <p className="text-muted-foreground text-lg">Make your day easy with us</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Add Bookmark Section - Prominent Card */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-6">
            <Card className="h-fit bg-white/80 backdrop-blur-sm border-white/50 shadow-sm hover:shadow-md transition-all duration-300 top-24 sticky">
               <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">New Bookmark</CardTitle>
                  <CardDescription>Save a new link to your collection.</CardDescription>
               </CardHeader>
               <CardContent>
                  <AddBookmarkForm />
               </CardContent>
            </Card>
            
          </div>

          {/* Bookmarks List Section - Wide Card */}
          <div className="md:col-span-8 lg:col-span-8">
            <Card className="h-full min-h-[500px] border-none shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <LayoutGrid className="h-6 w-6 text-primary" />
                            Recent Links
                        </CardTitle>
                        <CardDescription>Your saved collection</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <BookmarkList />
                </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </main>
  );
}
