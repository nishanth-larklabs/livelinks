import { createClient } from "@/utils/supabase/server";
import Login from "@/components/Login";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Save and organize your bookmarks.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <Login />
      </main>
    );
  }

  return (
    <main className="container max-w-4xl mx-auto p-4 py-8">
      <div className="flex flex-col gap-8">
        <section>
          <AddBookmarkForm />
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Bookmarks</h2>
          </div>
          <BookmarkList />
        </section>
      </div>
    </main>
  );
}
