import { Suspense } from "react";
import BannerSlider from "@/components/home/BannerSlider";
import NewArrivals from "@/components/home/NewArrivals";
import HowBorrowingWorks from "@/components/home/HowBorrowingWorks";
import ReaderReviews from "@/components/home/ReaderReviews";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Sparkles, Feather } from "lucide-react";

export const metadata = {
  title: "BookNook | Your Little Reading Corner",
  description: "Browse all books, add your own titles, borrow favorite stories, and return them seamlessly in our cozy online library.",
};

const categories = [
  {
    name: "Fiction",
    description: "Stories of love, imagination, and faraway worlds.",
    icon: Feather,
    count: "Novel & Tales",
    color: "from-amber-500/10 to-transparent",
  },
  {
    name: "Science",
    description: "Curious explorations of the cosmos, nature, and minds.",
    icon: Sparkles,
    count: "Cosmos & Tech",
    color: "from-sky-500/10 to-transparent",
  },
  {
    name: "History",
    description: "Witness the triumphs, tragedies, and epochs of our past.",
    icon: Compass,
    count: "Civilizations",
    color: "from-emerald-500/10 to-transparent",
  },
  {
    name: "Kids",
    description: "Little books filled with wonder for growing imaginations.",
    icon: BookOpen,
    count: "Bedtime Stories",
    color: "from-rose-500/10 to-transparent",
  },
];

export default function Home() {
  return (
    <div className="space-y-4">
      {/* 1. Hero Swiper.js Banner Slider (Requirement 2) */}
      <section className="container-width pt-6">
        <Suspense
          fallback={
            <div className="h-[520px] w-full animate-pulse rounded-3xl bg-[var(--sage)]/40" />
          }
        >
          <BannerSlider />
        </Suspense>
      </section>

      {/* 2. Dynamic New Arrivals (Latest 6 books from MongoDB) */}
      <Suspense
        fallback={
          <div className="container-width section-padding">
            <div className="h-10 w-48 animate-pulse rounded-lg bg-[var(--sage)]/50 mb-8" />
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-[var(--sage)]/30" />
              ))}
            </div>
          </div>
        }
      >
        <NewArrivals />
      </Suspense>

      {/* 3. Explore by Category Section */}
      <section className="section-padding bg-[var(--sage)]/15 border-y border-[var(--card-border)]">
        <div className="container-width">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-label">Curated Collections</span>
            <h2 className="section-title mt-2">Explore by Category</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Find exactly what sparks your curiosity from our diverse library shelves.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/books?category=${cat.name}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[var(--accent)]"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${cat.color} opacity-50`} />

                  <div className="relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] shadow-xs transition-transform group-hover:scale-110">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-6 font-serif text-xl font-bold text-[var(--heading)] group-hover:text-[var(--accent)] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                      {cat.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[var(--card-border)] pt-4 text-xs font-bold text-[var(--accent)]">
                    <span>{cat.count}</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Extra Section 1: How Borrowing Works */}
      <HowBorrowingWorks />

      {/* 5. Extra Section 2: Reader Reviews & Testimonials */}
      <ReaderReviews />

      {/* 6. Warm Community Invitation Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--primary)] px-8 py-14 text-center text-white shadow-xl sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-emerald-500 opacity-20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--accent)] backdrop-blur-xs">
                Your Next Chapter
              </span>

              <h2 className="mt-4 font-serif text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                Ready to dive into a great story?
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/80">
                Join thousands of readers who borrow, share, and discuss their favorite books every single day.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-[#1b2b23] shadow-lg transition-all hover:bg-[#e4b57e] hover:scale-105 active:scale-95"
                >
                  Join BookNook Free
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition hover:bg-white/20"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
