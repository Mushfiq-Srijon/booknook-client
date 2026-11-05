"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  RotateCcw,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Book, BookCategory } from "@/types/book";

interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

const categories: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

function BooksContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const category =
    categoryParam &&
    (categories.includes(categoryParam as BookCategory) || categoryParam === "All")
      ? categoryParam
      : "All";

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "copies">("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Update page title per requirement
  useEffect(() => {
    document.title = "BookNook | All Books";
  }, []);

  function setCategory(nextCategory: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", nextCategory);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  async function loadBooks() {
    try {
      const response = await apiFetch<BooksResponse>("/books");
      setBooks(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load library catalog.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBooks() {
    setLoading(true);
    setError("");
    await loadBooks();
  }

  useEffect(() => {
    let cancelled = false;

    apiFetch<BooksResponse>("/books")
      .then((response) => {
        if (!cancelled) {
          setBooks(response.data || []);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load library catalog."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter & sort books
  const filteredBooks = useMemo(() => {
    const list = books.filter((book) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q);

      const matchesCategory = category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });

    return list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "copies") {
        return b.availableCopies - a.availableCopies;
      }
      return 0;
    });
  }, [books, search, category, sortBy]);

  return (
    <div className="section-padding">
      <div className="container-width">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[var(--primary)] px-8 py-12 text-white shadow-xl sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent)] backdrop-blur-xs">
              Complete Catalog
            </span>
            <h1 className="mt-3 font-serif text-3xl font-extrabold sm:text-5xl text-white">
              Explore All Books
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#d4ded6] sm:text-base">
              Browse our complete library collection. Discover new titles, check copy availability, and borrow your next story.
            </p>
          </div>
        </div>

        {/* Filter and Search Controls Bar */}
        <div className="mt-10 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Select & Sort Select */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[var(--muted)]" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-xs font-semibold text-[var(--foreground)] outline-none transition focus:border-[var(--primary)]"
                >
                  <option value="All">All Categories ({books.length})</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "newest" || value === "title" || value === "copies") {
                    setSortBy(value);
                  }
                }}
                className="rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3.5 py-2.5 text-xs font-semibold text-[var(--foreground)] outline-none transition focus:border-[var(--primary)]"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="title">Sort: Title (A-Z)</option>
                <option value="copies">Sort: Most Copies</option>
              </select>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--card-border)] pt-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Categories:
            </span>
            <button
              onClick={() => setCategory("All")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                category === "All"
                  ? "bg-[var(--primary)] text-[var(--primary-fg)]"
                  : "bg-[var(--sage)]/50 text-[var(--foreground)] hover:bg-[var(--sage)]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  category === cat
                    ? "bg-[var(--primary)] text-[var(--primary-fg)]"
                    : "bg-[var(--sage)]/50 text-[var(--foreground)] hover:bg-[var(--sage)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>
            Showing <strong className="text-[var(--foreground)]">{filteredBooks.length}</strong> of {books.length} books
          </span>
          {(search || category !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] hover:underline"
            >
              <RotateCcw size={12} />
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-xs animate-pulse"
              >
                <div className="h-64 rounded-xl bg-[var(--sage)]/50" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-1/3 rounded bg-[var(--sage)]/60" />
                  <div className="h-5 w-4/5 rounded bg-[var(--sage)]/80" />
                  <div className="h-4 w-1/2 rounded bg-[var(--sage)]/50" />
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <div className="h-4 w-1/4 rounded bg-[var(--sage)]/40" />
                    <div className="h-9 w-28 rounded-lg bg-[var(--sage)]/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center">
            <h3 className="font-serif text-lg font-bold text-red-600 dark:text-red-400">
              Unable to load books
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{error}</p>
            <button
              onClick={fetchBooks}
              className="primary-button mt-5 text-xs"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Search Results */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="mt-12 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center">
            <BookOpen size={48} className="mx-auto text-[var(--muted)] opacity-50" />
            <h3 className="mt-4 font-serif text-xl font-bold text-[var(--heading)]">
              No matching books found
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              We couldn&apos;t find any books matching your search or filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="primary-button mt-6 text-xs"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* 3 cards per row on desktop (as specified: grid 3 cards per row on desktop) */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => {
              const isAvailable = book.availableCopies > 0;
              return (
                <article
                  key={book._id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent)]"
                >
                  <div>
                    {/* Image Cover */}
                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-[var(--sage)]/30">
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                          <BookOpen size={40} />
                        </div>
                      )}

                      {/* Category Badge */}
                      <span className="absolute left-3 top-3 rounded-full bg-[var(--card-bg)]/95 px-3 py-1 text-[11px] font-bold text-[var(--foreground)] shadow-xs backdrop-blur-xs">
                        {book.category}
                      </span>

                      {/* Available copies indicator */}
                      <span
                        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs backdrop-blur-xs ${
                          isAvailable
                            ? "bg-emerald-600/90 text-white"
                            : "bg-rose-600/90 text-white"
                        }`}
                      >
                        {isAvailable ? `${book.availableCopies} Available` : "Not Available"}
                      </span>
                    </div>

                    {/* Book Metadata */}
                    <div className="mt-4">
                      <h2
                        className="line-clamp-1 font-serif text-lg font-bold text-[var(--heading)] group-hover:text-[var(--accent)] transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h2>

                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-[var(--muted)]">
                        By {book.author}
                      </p>

                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[var(--foreground)]/80">
                        {book.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--card-border)] pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                      <Layers size={14} className="text-[var(--accent)]" />
                      <span>Total: {book.totalCopies}</span>
                    </div>

                    <Link
                      href={`/books/${book._id}`}
                      className="primary-button text-xs py-2 px-4.5 rounded-lg"
                    >
                      <span>View Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
