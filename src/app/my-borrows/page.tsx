"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  Calendar,
  Clock,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Borrow } from "@/types/borrow";

interface BorrowsResponse {
  success: boolean;
  count: number;
  data: Borrow[];
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Return modal state
  const [returningBorrow, setReturningBorrow] = useState<Borrow | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  // Set Page Title
  useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  // Private Route check
  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login?redirect=/my-borrows");
    }
  }, [sessionPending, user, router]);

  async function loadUserBorrows() {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch<BorrowsResponse>("/borrows", {
        requireAuth: true,
      });
      setBorrows(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your borrows.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadUserBorrows();
    }
  }, [user]);

  // Handle Return Book Confirm
  async function handleConfirmReturn() {
    if (!returningBorrow) return;
    setIsReturning(true);

    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/borrows/${returningBorrow._id}`,
        {
          method: "DELETE",
          requireAuth: true,
        }
      );

      if (res.success) {
        toast.success(res.message || "Book returned successfully! Thank you.");
        setBorrows((prev) => prev.filter((b) => b._id !== returningBorrow._id));
        setReturningBorrow(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to return book.";
      toast.error(msg);
    } finally {
      setIsReturning(false);
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (returnDateStr: string) => {
    const diff = new Date(returnDateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (sessionPending || (loading && borrows.length === 0)) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
        <p className="text-xs font-semibold text-[var(--muted)]">Loading your borrowed books...</p>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-width">
        {/* Header Hero Area */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--card-border)] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              <BookMarked size={14} />
              Active Reading
            </div>
            <h1 className="font-serif text-3xl font-extrabold sm:text-4xl text-[var(--heading)] mt-2">
              My Borrows
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Keep track of the books you have borrowed and return them when you are finished.
            </p>
          </div>

          <Link href="/books" className="primary-button text-xs py-2.5 px-4.5 rounded-xl">
            <BookOpen size={15} />
            <span>Borrow Another Book</span>
          </Link>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && borrows.length === 0 && (
          <div className="mt-12 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center shadow-xs">
            <BookMarked size={52} className="mx-auto text-[var(--accent)] opacity-60" />
            <h3 className="mt-4 font-serif text-2xl font-bold text-[var(--heading)]">
              No Borrowed Books Currently
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
              You don&apos;t have any active borrowed books right now. Explore our catalog and pick up your next reading adventure!
            </p>
            <Link href="/books" className="primary-button mt-6 text-sm">
              <Sparkles size={16} />
              <span>Explore Library Catalog</span>
            </Link>
          </div>
        )}

        {/* Borrows Table (Requirement 5: "in a table: Image, Title, Borrow Date, Return Date and a 'Return Book' button") */}
        {borrows.length > 0 && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--card-border)] bg-[var(--sage)]/25 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  <tr>
                    <th className="px-6 py-4">Book</th>
                    <th className="px-4 py-4">Borrow Date</th>
                    <th className="px-4 py-4">Due Date</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {borrows.map((borrow) => {
                    const daysLeft = getDaysRemaining(borrow.returnDate);
                    return (
                      <tr key={borrow._id} className="transition hover:bg-[var(--sage)]/10">
                        {/* Image & Title */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            {borrow.bookImage ? (
                              <img
                                src={borrow.bookImage}
                                alt={borrow.bookTitle}
                                className="h-14 w-10 shrink-0 rounded-md object-cover shadow-xs"
                              />
                            ) : (
                              <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--sage)] text-[var(--primary)]">
                                <BookOpen size={18} />
                              </div>
                            )}

                            <div>
                              <Link
                                href={`/books/${borrow.bookId}`}
                                className="font-serif text-sm font-bold text-[var(--heading)] hover:text-[var(--accent)] transition-colors line-clamp-1"
                              >
                                {borrow.bookTitle}
                              </Link>
                              <p className="text-[11px] text-[var(--muted)]">
                                Borrower: {borrow.userEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Borrow Date */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                            <Calendar size={13} className="text-[var(--muted)]" />
                            <span>{formatDate(borrow.borrowDate)}</span>
                          </div>
                        </td>

                        {/* Return Date */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-[var(--foreground)] font-semibold">
                            <Clock size={13} className="text-[var(--accent)]" />
                            <span>{formatDate(borrow.returnDate)}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              daysLeft >= 3
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : daysLeft >= 0
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            <CheckCircle2 size={12} />
                            {daysLeft > 0 ? `${daysLeft} days left` : "Due today"}
                          </span>
                        </td>

                        {/* Return Book Button (Requirement 5) */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setReturningBorrow(borrow)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--primary)] bg-[var(--primary)] px-3.5 py-2 text-xs font-bold text-[var(--primary-fg)] transition hover:bg-[var(--primary-hover)] hover:shadow-xs active:scale-95"
                          >
                            <RotateCcw size={13} />
                            <span>Return Book</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Custom Return Book Confirm Modal */}
      {returningBorrow && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="return-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReturningBorrow(null);
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <RotateCcw size={28} />
            </div>

            <div className="mt-4 text-center">
              <h3 id="return-dialog-title" className="font-serif text-xl font-bold text-[var(--heading)]">
                Return This Book?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                Confirm returning <strong className="text-[var(--foreground)]">&ldquo;{returningBorrow.bookTitle}&rdquo;</strong> back to the library. The shelf copy count will immediately increment for other readers.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setReturningBorrow(null)}
                className="secondary-button flex-1 text-xs py-2.5 justify-center"
                disabled={isReturning}
              >
                Keep Reading
              </button>

              <button
                type="button"
                onClick={handleConfirmReturn}
                disabled={isReturning}
                className="primary-button flex-1 text-xs py-2.5 justify-center font-bold"
              >
                {isReturning ? "Returning..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
