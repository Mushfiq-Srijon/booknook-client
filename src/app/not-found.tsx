import Link from "next/link";
import { BookX, Home, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | Page Not Found",
  description: "Sorry, the page or book you are looking for does not exist in our library.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[72vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--sage)] text-[var(--primary)] shadow-sm">
          <BookX size={52} strokeWidth={1.75} />
        </div>

        <span className="inline-block rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
          404 • Page Not Found
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--heading)] sm:text-4xl">
          Lost in the Stacks?
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          The page or book chapter you are looking for has been misplaced, moved, or never existed in our library.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="primary-button">
            <Home size={16} />
            Back to Home
          </Link>

          <Link href="/books" className="secondary-button">
            <ArrowLeft size={16} />
            Browse All Books
          </Link>
        </div>
      </div>
    </div>
  );
}
