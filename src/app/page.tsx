import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BookMarked,
  Clock3,
  Heart,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Stories that take you somewhere new.",
    icon: "✦",
  },
  {
    name: "Science",
    description: "Explore the wonders of our universe.",
    icon: "⌘",
  },
  {
    name: "History",
    description: "Discover stories from the past.",
    icon: "◷",
  },
  {
    name: "Kids",
    description: "Little books for big imaginations.",
    icon: "☆",
  },
];

export default function Home() {
  return (
    <>
      <section className="overflow-hidden bg-[#f7f4ea]">
        <div className="container-width grid min-h-[590px] items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#243d32]/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#a16f39]">
              <Sparkles size={15} />
              A little world of stories
            </div>

            <h1 className="max-w-xl text-5xl leading-[1.12] font-bold tracking-[-2px] text-[#243d32] sm:text-6xl lg:text-[68px]">
              Every book has a story.
              <span className="block font-serif font-normal italic text-[#b17b43]">
                Find yours.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#777b70]">
              Welcome to BookNook, your little reading corner.
              Discover interesting books, explore new ideas,
              and borrow your next favorite story.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/books" className="primary-button">
                Browse Books
                <ArrowRight size={17} />
              </Link>

              <Link href="/register" className="secondary-button">
                Join Our Community
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-[#243d32]/10 pt-7">
              <div>
                <p className="text-2xl font-bold text-[#243d32]">Explore</p>
                <p className="mt-1 text-xs text-[#777b70]">New stories</p>
              </div>

              <div className="h-10 w-px bg-[#243d32]/15" />

              <div>
                <p className="text-2xl font-bold text-[#243d32]">Borrow</p>
                <p className="mt-1 text-xs text-[#777b70]">Read anywhere</p>
              </div>

              <div className="h-10 w-px bg-[#243d32]/15" />

              <div>
                <p className="text-2xl font-bold text-[#243d32]">Enjoy</p>
                <p className="mt-1 text-xs text-[#777b70]">Every page</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex h-[440px] w-full max-w-[480px] items-center justify-center">
            <div className="absolute h-[340px] w-[340px] rounded-full bg-[#dce5db]" />

            <div className="absolute left-[5%] top-[15%] h-64 w-40 -rotate-12 rounded-r-xl rounded-l-sm bg-[#9d6849] p-5 shadow-xl">
              <div className="flex h-full flex-col justify-between border border-white/30 p-3 text-[#fff5e8]">
                <BookOpen size={24} />
                <div>
                  <p className="font-serif text-2xl font-bold">The</p>
                  <p className="font-serif text-3xl font-bold">Quiet</p>
                  <p className="font-serif text-2xl italic">Pages</p>
                  <div className="mt-4 h-px bg-white/50" />
                  <p className="mt-3 text-[9px] uppercase tracking-widest">
                    A collection of stories
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-[5%] top-[8%] h-64 w-40 rotate-12 rounded-r-xl rounded-l-sm bg-[#344f65] p-5 shadow-xl">
              <div className="flex h-full flex-col justify-between border border-white/30 p-3 text-[#f7f4ea]">
                <Sparkles size={23} />
                <div>
                  <p className="font-serif text-2xl">Beyond</p>
                  <p className="font-serif text-3xl font-bold">The</p>
                  <p className="font-serif text-3xl italic">Stars</p>
                  <div className="mt-4 h-px bg-white/50" />
                  <p className="mt-3 text-[9px] uppercase tracking-widest">
                    An endless journey
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[5%] left-[28%] h-64 w-40 -rotate-2 rounded-r-xl rounded-l-sm bg-[#d6a35f] p-5 shadow-2xl">
              <div className="flex h-full flex-col justify-between border border-[#243d32]/30 p-3 text-[#243d32]">
                <Heart size={23} />
                <div>
                  <p className="font-serif text-2xl">A</p>
                  <p className="font-serif text-3xl font-bold">World</p>
                  <p className="font-serif text-2xl italic">Within</p>
                  <div className="mt-4 h-px bg-[#243d32]/40" />
                  <p className="mt-3 text-[9px] uppercase tracking-widest">
                    Stories to remember
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 right-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[#243d32] shadow-lg">
              Your next chapter awaits ✨
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-width">
          <div className="mb-12 text-center">
            <p className="section-label">Find your next adventure</p>
            <h2 className="section-title mt-3">
              Explore by Category
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#777b70]">
              From fascinating discoveries to unforgettable stories,
              find something that matches your curiosity.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href="/books"
                className="group rounded-xl border border-[#243d32]/10 bg-[#f7f4ea] p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dce5db] text-2xl text-[#243d32]">
                  {category.icon}
                </span>

                <h3 className="mt-6 text-xl font-bold text-[#243d32]">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#777b70]">
                  {category.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#a16f39]">
                  Explore category
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#dce5db] py-20">
        <div className="container-width grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="section-label">Reading made simple</p>
            <h2 className="section-title mt-4 max-w-lg">
              Your next favorite book is just a few clicks away.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-8 text-[#59695c]">
              Browse our collection, choose a book you love,
              and borrow it. Keep track of your borrowed books
              and return them when you&apos;re done.
            </p>

            <Link href="/books" className="primary-button mt-7">
              Start Exploring
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#243d32] p-7 text-white">
              <BookOpen size={30} />
              <h3 className="mt-8 text-xl font-bold">Discover</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Explore books across different categories.
              </p>
            </div>

            <div className="mt-10 rounded-xl bg-[#d9a66b] p-7 text-[#243d32]">
              <BookMarked size={30} />
              <h3 className="mt-8 text-xl font-bold">Borrow</h3>
              <p className="mt-3 text-sm leading-6 text-[#243d32]/75">
                Take a book home and enjoy reading.
              </p>
            </div>

            <div className="rounded-xl bg-white p-7 text-[#243d32]">
              <Clock3 size={30} />
              <h3 className="mt-8 text-xl font-bold">Track</h3>
              <p className="mt-3 text-sm leading-6 text-[#777b70]">
                Keep an eye on your borrowing dates.
              </p>
            </div>

            <div className="mt-10 rounded-xl bg-[#344f65] p-7 text-white">
              <Heart size={30} />
              <h3 className="mt-8 text-xl font-bold">Enjoy</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Make every reading moment special.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ea] py-20">
        <div className="container-width rounded-2xl bg-[#243d32] px-7 py-16 text-center text-white sm:px-16">
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#d9a66b]">
            Your reading journey starts here
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            A good book can take you a thousand places.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/70">
            Join BookNook and find your next story.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#d9a66b] px-7 py-3.5 text-sm font-bold text-[#243d32] transition hover:bg-[#e8bb85]"
          >
            Become a Member
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}