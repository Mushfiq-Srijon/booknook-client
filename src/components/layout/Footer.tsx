import Link from "next/link";
import {
  BookOpen,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#20372d] text-[#f7f4ea]">
      <div className="container-width grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="mb-5 inline-flex items-center gap-2">
            <BookOpen size={30} />
            <span className="text-2xl font-bold">BookNook</span>
          </Link>

          <p className="max-w-sm text-sm leading-7 text-[#d0d9d0]">
            A little corner for every book lover. Discover new stories,
            explore different worlds, and make reading a part of your everyday life.
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
            >
              <span className="text-lg font-bold">f</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
            >
              <span className="text-lg font-bold">◎</span>
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
            >
              <span className="text-lg font-bold">𝕏</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider">
            Explore
          </h3>

          <div className="flex flex-col gap-3 text-sm text-[#d0d9d0]">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/books" className="hover:text-white">All Books</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/register" className="hover:text-white">Register</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider">
            Get in Touch
          </h3>

          <div className="flex flex-col gap-4 text-sm text-[#d0d9d0]">
            <div className="flex items-center gap-3">
              <Mail size={17} />
              <span>hello@booknook.com</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={17} />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-width flex flex-col justify-between gap-3 py-5 text-xs text-[#c4cec4] sm:flex-row">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p>Made with love for book lovers.</p>
        </div>
      </div>
    </footer>
  );
}