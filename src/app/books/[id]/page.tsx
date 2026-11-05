"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  User,
  AlertCircle,
  X,
  BookmarkCheck,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Book } from "@/types/book";
import { Borrow } from "@/types/borrow";

interface SingleBookResponse {
  success: boolean;
  data: Book;
}

interface BorrowsResponse {
  success: boolean;
  data: Borrow[];
}

function BookDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const router = useRouter();

  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);

  // Authentication check: Private route
  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace(`/login?redirect=/books/${encodeURIComponent(bookId)}`);
    }
  }, [sessionPending, user, bookId, router]);

  // Fetch book details
  useEffect(() => {
    let active = true;

    async function loadBookDetails() {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch<SingleBookResponse>(`/books/${bookId}`);
        if (active && response.data) {
          setBook(response.data);
          document.title = `BookNook | ${response.data.title}`;
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load book details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (bookId) {
      loadBookDetails();
    }

    return () => {
      active = false;
    };
  }, [bookId]);

  // Check if current user has already borrowed this book
  useEffect(() => {
    let active = true;

    async function checkUserBorrows() {
      if (!user) return;
      try {
        const response = await apiFetch<BorrowsResponse>("/borrows", {
          requireAuth: true,
        });
        if (active && response.data) {
          const hasBorrowed = response.data.some(
            (b) => b.bookId === bookId || b._id === bookId
          );
          setAlreadyBorrowed(hasBorrowed);
        }
      } catch {
        // Silently catch or ignore borrow precheck errors
      }
    }

    checkUserBorrows();

    return () => {
      active = false;
    };
  }, [user, bookId]);

  // Handle borrow submission
  async function handleConfirmBorrow() {
    if (!user) {
      router.push(`/login?redirect=/books/${bookId}`);
      return;
    }

    if (!book || book.availableCopies <= 0) {
      toast.error("No copies of this book are currently available.");
      return;
    }

    setBorrowing(true);

    try {
      const response = await apiFetch<{ success: boolean; message: string }>("/borrows", {
        method: "POST",
        body: JSON.stringify({ bookId }),
        requireAuth: true,
      });

      if (response.success) {
        toast.success(response.message || "Book borrowed successfully! Enjoy your read.");
        setModalOpen(false);
        setAlreadyBorrowed(true);

        // Update local available copies count
        setBook((prev) =>
          prev ? { ...prev, availableCopies: Math.max(0, prev.availableCopies - 1) } : null
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to borrow book.";
      toast.error(message);
    } finally {
      setBorrowing(false);
    }
  }

  // Pre-calculate borrow & return date (14-day default window)
  const today = new Date();
  const returnDueDate = new Date(today);
  returnDueDate.setDate(returnDueDate.getDate() + 14);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (sessionPending || (loading && !book)) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
        <p className="text-xs font-semibold text-[var(--muted)]">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container-width section-padding">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle size={40} className="mx-auto text-red-500" />
          <h2 className="mt-4 font-serif text-xl font-bold text-red-600 dark:text-red-400">
            Book Not Found
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{error || "The requested book could not be found."}</p>
          <Link href="/books" className="primary-button mt-6 text-xs">
            <ArrowLeft size={16} />
            Back to All Books
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="section-padding">
      <div className="container-width">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft size={16} />
            Back to Library Catalog
          </Link>
        </div>

        {/* Main Book Detail Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Book Cover Presentation */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-xl">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[var(--sage)]/30">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-[var(--muted)]">
                      <BookOpen size={56} />
                      <p className="mt-2 text-xs">No Cover Image</p>
                    </div>
                  )}

                  {/* Availability Badge */}
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur-md ${
                      isAvailable
                        ? "bg-emerald-600/90 text-white"
                        : "bg-rose-600/90 text-white"
                    }`}
                  >
                    {isAvailable ? `${book.availableCopies} Copies Available` : "Not Available"}
                  </span>

                  {/* Category Pill */}
                  <span className="absolute left-4 top-4 rounded-full bg-[var(--card-bg)]/95 px-3 py-1.5 text-xs font-bold text-[var(--foreground)] shadow-md backdrop-blur-md">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Already Borrowed Banner */}
              {alreadyBorrowed && (
                <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <BookmarkCheck size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>You currently have an active borrow for this book. Check My Borrows to view or return it.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Metadata & Actions */}
          <div className="lg:col-span-7">
            <div>
              <span className="inline-block rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                {book.category} Edition
              </span>

              <h1 className="mt-3 font-serif text-3xl font-extrabold sm:text-4xl lg:text-5xl text-[var(--heading)]">
                {book.title}
              </h1>

              <p className="mt-2 text-base font-semibold text-[var(--muted)]">
                Written by <span className="text-[var(--foreground)] font-bold">{book.author}</span>
              </p>

              {/* Stats badges strip */}
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sage)] text-[var(--primary)]">
                    <Layers size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[var(--muted)] uppercase">Total Copies</p>
                    <p className="text-base font-extrabold text-[var(--heading)]">{book.totalCopies}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isAvailable
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[var(--muted)] uppercase">Available</p>
                    <p
                      className={`text-base font-extrabold ${
                        isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {book.availableCopies}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[var(--muted)] uppercase">Date Added</p>
                    <p className="text-xs font-bold text-[var(--heading)]">{formatDate(book.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mt-8">
                <h2 className="font-serif text-xl font-bold text-[var(--heading)]">
                  About the Book
                </h2>
                <div className="mt-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
                  <p className="text-sm leading-relaxed text-[var(--foreground)]/90 whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Added By Information (Requirement 3: "who added it") */}
              <div className="mt-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Catalog Contributor
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-[var(--primary-fg)]">
                    {book.addedBy?.name?.charAt(0).toUpperCase() || <User size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--heading)]">
                      {book.addedBy?.name || "Library Curator"}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {book.addedBy?.email || "curator@booknook.local"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Borrow Action Area */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Challenge: If copies are 0, disable Borrow button and show "Not Available" */}
                {book.availableCopies <= 0 ? (
                  <button
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-[var(--muted)]/40 px-8 py-4 text-sm font-bold text-[var(--muted)] shadow-none opacity-70"
                    title="No copies currently available"
                  >
                    <AlertCircle size={18} />
                    Not Available (0 Copies Left)
                  </button>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="primary-button text-base py-3.5 px-8 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Sparkles size={18} />
                    Borrow This Book
                  </button>
                )}

                <Link
                  href="/books"
                  className="secondary-button text-sm py-3.5 px-6 rounded-xl"
                >
                  Browse Other Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Accessible Borrow Modal (Requirements 4.5 & Modern Web Guidance) */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="borrow-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:p-8 shadow-2xl transition-transform animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--card-border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Borrow Confirmation
                </span>
                <h3 id="borrow-dialog-title" className="mt-1 font-serif text-2xl font-bold text-[var(--heading)]">
                  Borrow This Book
                </h3>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--sage)]/50 hover:text-[var(--foreground)]"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Book Preview */}
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[var(--sage)]/25 p-3.5 border border-[var(--card-border)]">
              {book.imageUrl && (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="h-16 w-12 rounded-lg object-cover shadow-xs"
                />
              )}
              <div className="min-w-0">
                <h4 className="truncate font-serif text-base font-bold text-[var(--heading)]">
                  {book.title}
                </h4>
                <p className="truncate text-xs text-[var(--muted)]">By {book.author}</p>
                <span className="mt-1 inline-block rounded-md bg-[var(--card-bg)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                  {book.category}
                </span>
              </div>
            </div>

            {/* Read-Only Borrower Form per Requirements */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Borrower Name (Read-only)
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || "Library Reader"}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--sage)]/30 px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Borrower Email (Read-only)
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || "reader@booknook.local"}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--sage)]/30 px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] outline-none cursor-not-allowed"
                />
              </div>

              {/* Dates confirmation */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Calendar size={13} />
                    <span>Borrow Date</span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-[var(--foreground)]">
                    {formatDate(today)}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <Clock size={13} />
                    <span>Return Date (14 Days)</span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-[var(--foreground)]">
                    {formatDate(returnDueDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-[var(--card-border)] pt-5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="secondary-button text-xs py-2.5 px-5"
                disabled={borrowing}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmBorrow}
                disabled={borrowing}
                className="primary-button text-xs py-2.5 px-6 font-bold"
              >
                {borrowing ? "Processing..." : "Confirm Borrow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
          <p className="text-xs font-semibold text-[var(--muted)]">Loading book details...</p>
        </div>
      }
    >
      <BookDetailsContent params={params} />
    </Suspense>
  );
}
