import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[#1b2b23] text-[#edf2ee]">
      <div className="container-width grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link href="/" className="mb-4 inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[#1b2b23] shadow-sm">
              <BookOpen size={22} strokeWidth={2.2} />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              BookNook
            </span>
          </Link>

          <p className="max-w-md text-sm leading-relaxed text-[#c2cfc5]">
            A quiet sanctuary for every curious mind. Discover extraordinary stories,
            share your beloved books, and borrow from a vibrant community of readers.
            Simple, seamless, and joyful reading.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-sm font-bold text-white transition hover:border-[var(--accent)] hover:bg-white/10"
            >
              f
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-sm font-bold text-white transition hover:border-[var(--accent)] hover:bg-white/10"
            >
              ◎
            </a>

            {/* Official 𝕏 logo per requirements */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-sm font-bold text-white transition hover:border-[var(--accent)] hover:bg-white/10"
            >
              𝕏
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[2px] text-[var(--accent)]">
            Explore Library
          </h3>

          <div className="flex flex-col gap-2.5 text-sm text-[#c2cfc5]">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/books" className="transition hover:text-white">
              All Books
            </Link>
            <Link href="/add-book" className="transition hover:text-white">
              Add a Book
            </Link>
            <Link href="/my-borrows" className="transition hover:text-white">
              Borrowed Books
            </Link>
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[2px] text-[var(--accent)]">
            Get in Touch
          </h3>

          <div className="flex flex-col gap-3.5 text-sm text-[#c2cfc5]">
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-[var(--accent)]" />
              <span>reader@booknook.local</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-[var(--accent)]" />
              <span>+1 (800) 266-5665</span>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-[var(--accent)]" />
              <span>42 Library Way, Reading Corner</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-width flex flex-col items-center justify-between gap-3 text-xs text-[#a2b3a6] sm:flex-row">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
