"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Library,
  BookMarked,
  PlusCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const [addedBooksCount, setAddedBooksCount] = useState<number | null>(null);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState<number | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Set Page Title
  useEffect(() => {
    document.title = "BookNook | My Profile";
  }, []);

  // Private Route check
  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [sessionPending, user, router]);

  // Load user stats
  useEffect(() => {
    let active = true;

    async function loadStats() {
      if (!user) return;
      try {
        // Fetch books added by user
        const booksRes = await apiFetch<{ count: number }>(
          `/books?email=${encodeURIComponent(user.email)}`
        );
        if (active) {
          setAddedBooksCount(booksRes.count ?? 0);
        }

        // Fetch user's active borrows
        const borrowsRes = await apiFetch<{ count: number }>("/borrows", {
          requireAuth: true,
        });
        if (active) {
          setBorrowedBooksCount(borrowsRes.count ?? 0);
        }
      } catch {
        // Silently handle stat pre-load
      }
    }

    loadStats();
    return () => {
      active = false;
    };
  }, [user]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (sessionPending || !user) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
        <p className="text-xs font-semibold text-[var(--muted)]">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-width max-w-4xl">
        {/* Profile Card Header */}
        <div className="overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl">
          {/* Cover Banner */}
          <div className="h-36 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--sage)] relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* User Details */}
          <div className="relative px-6 pb-8 sm:px-10">
            <div className="-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-28 w-28 rounded-2xl border-4 border-[var(--card-bg)] object-cover shadow-lg bg-[var(--card-bg)]"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-[var(--card-bg)] bg-[var(--primary)] text-3xl font-extrabold text-[var(--primary-fg)] shadow-lg">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl font-bold sm:text-3xl text-[var(--heading)]">
                      {user.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck size={12} />
                      Verified Reader
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-[var(--muted)] mt-1">
                    <Mail size={13} />
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                <LogOut size={14} />
                <span>{loggingOut ? "Signing out..." : "Logout"}</span>
              </button>
            </div>

            {/* Quick Statistics Strip */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--sage)]/25 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)]">
                  <Library size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Books Contributed
                  </p>
                  <p className="font-serif text-2xl font-extrabold text-[var(--heading)]">
                    {addedBooksCount !== null ? addedBooksCount : "..."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--sage)]/25 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-[#1b2b23]">
                  <BookMarked size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Active Borrowed Books
                  </p>
                  <p className="font-serif text-2xl font-extrabold text-[var(--heading)]">
                    {borrowedBooksCount !== null ? borrowedBooksCount : "..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation Panel */}
            <div className="mt-8">
              <h2 className="font-serif text-lg font-bold text-[var(--heading)]">
                Library Shortcuts
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Link
                  href="/my-books"
                  className="group flex flex-col justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition hover:border-[var(--accent)] hover:shadow-md"
                >
                  <Library size={20} className="text-[var(--accent)]" />
                  <div className="mt-3">
                    <p className="text-sm font-bold text-[var(--heading)]">My Books</p>
                    <p className="text-[11px] text-[var(--muted)]">View and edit books you added</p>
                  </div>
                </Link>

                <Link
                  href="/my-borrows"
                  className="group flex flex-col justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition hover:border-[var(--accent)] hover:shadow-md"
                >
                  <BookMarked size={20} className="text-[var(--accent)]" />
                  <div className="mt-3">
                    <p className="text-sm font-bold text-[var(--heading)]">My Borrows</p>
                    <p className="text-[11px] text-[var(--muted)]">Check return dates and return books</p>
                  </div>
                </Link>

                <Link
                  href="/add-book"
                  className="group flex flex-col justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition hover:border-[var(--accent)] hover:shadow-md"
                >
                  <PlusCircle size={20} className="text-[var(--accent)]" />
                  <div className="mt-3">
                    <p className="text-sm font-bold text-[var(--heading)]">Add Book</p>
                    <p className="text-[11px] text-[var(--muted)]">List a new book for borrowers</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
