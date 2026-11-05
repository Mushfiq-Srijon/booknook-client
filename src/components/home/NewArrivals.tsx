"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Layers } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Book } from "@/types/book";

interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadNewArrivals() {
      try {
        setLoading(true);
        // Uses sort and limit in MongoDB via Express API
        const response = await apiFetch<BooksResponse>("/books?limit=6");
        if (active) {
          setBooks(response.data || []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load new arrivals.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadNewArrivals();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section-padding">
      <div className="container-width">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              <Sparkles size={14} />
              Fresh Additions
            </div>
            <h2 className="section-title mt-2">New Arrivals</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The latest 6 books added to our library collection by fellow readers.
            </p>
          </div>

          <Link
            href="/books"
            className="secondary-button hidden md:inline-flex items-center gap-2"
          >
            <span>See All Books</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-xs animate-pulse"
              >
                <div className="h-64 w-full rounded-xl bg-[var(--sage)]/50" />
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

        {/* Error Fallback */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Please check back soon.</p>
          </div>
        )}

        {/* Books Cards Grid */}
        {!loading && !error && books.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const isAvailable = book.availableCopies > 0;
              return (
                <div
                  key={book._id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)]"
                >
                  <div>
                    {/* Cover Image Container */}
                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-[var(--sage)]/30">
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback if image link broken
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

                      {/* Availability status badge */}
                      <span
                        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs backdrop-blur-xs ${
                          isAvailable
                            ? "bg-emerald-600/90 text-white"
                            : "bg-rose-600/90 text-white"
                        }`}
                      >
                        {isAvailable ? `${book.availableCopies} Copies` : "Not Available"}
                      </span>
                    </div>

                    {/* Book Details */}
                    <div className="mt-4">
                      <h3
                        className="line-clamp-1 font-serif text-lg font-bold text-[var(--heading)] group-hover:text-[var(--accent)] transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-[var(--muted)]">
                        By {book.author}
                      </p>

                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[var(--foreground)]/80">
                        {book.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer with Details Button */}
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
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile "See All Books" button */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/books" className="primary-button w-full justify-center">
            <span>See All Books</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
