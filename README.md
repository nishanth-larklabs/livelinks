# LiveLinks - Smart Bookmark Manager

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

- **Google OAuth Authentication**: Secure sign-up and login purely via Google (no passwords).
- **Real-Time Updates**: Bookmarks sync instantly across all open tabs and devices without refreshing.
- **Private Bookmarks**: Robust Row Level Security (RLS) ensures users only access their own data.
- **Optimistic UI**: Immediate feedback when adding or deleting bookmarks for a snappy experience.
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop and mobile.
- **Animations**: Smooth transitions and interaction effects powered by Framer Motion.

## 🛠 Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/livelinks.git
    cd livelinks
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup (Supabase)**
    Run the following SQL query in your Supabase SQL Editor to set up the table and security policies:

    ```sql
    -- Create the bookmarks table
    create table bookmarks (
      id uuid default gen_random_uuid() primary key,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      title text not null,
      url text not null,
      user_id uuid references auth.users not null
    );

    -- Enable Row Level Security (RLS)
    alter table bookmarks enable row level security;

    -- Create Policy: Users can only see their own bookmarks
    create policy "Users can view their own bookmarks"
    on bookmarks for select
    using ( auth.uid() = user_id );

    -- Create Policy: Users can insert their own bookmarks
    create policy "Users can insert their own bookmarks"
    on bookmarks for insert
    with check ( auth.uid() = user_id );

    -- Create Policy: Users can delete their own bookmarks
    create policy "Users can delete their own bookmarks"
    on bookmarks for delete
    using ( auth.uid() = user_id );

    -- Enable Realtime
    alter publication supabase_realtime add table bookmarks;
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 💡 Challenges & Solutions

During development, several interesting challenges were encountered:

### 1. Real-Time Security with RLS
**Challenge:** Enabling real-time subscriptions while maintaining user privacy. We needed to ensure that User A doesn't receive `INSERT` events for User B's bookmarks.
**Solution:** Supabase's Realtime engine respects PostgreSQL RLS policies. by enabling RLS on the `bookmarks` table and setting policies to check `auth.uid() = user_id`, the real-time subscription automatically only pushes events relevant to the authenticated user.

### 2. Favicon Fetching
**Challenge:** Displaying icons for every bookmark without storing images manually.
**Solution:** Used a dedicated `Favicon` component that leverages Google's favicon service (`https://www.google.com/s2/favicons`) to dynamically fetch and cache icons based on the bookmark's domain.

