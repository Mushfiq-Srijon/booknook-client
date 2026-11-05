"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, BookMarked, ShieldCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    tag: "Welcome to BookNook",
    title: "A Quiet Corner for Every Curious Mind",
    text: "Discover a rich world of fiction, science, history, and children's literature. Borrow your next captivating story and let reading brighten your day.",
    badge: "Free & Open Library",
    accentColor: "#d9a66b",
    bgPattern: "from-[#243d32] to-[#162720]",
    icon: Sparkles,
    booksVisual: [
      { title: "The Quiet Pages", author: "Classic Collection", color: "bg-[#8b5a3e]" },
      { title: "Cosmic Horizons", author: "Astrophysics", color: "bg-[#2d495f]" },
      { title: "Golden Stories", author: "Fables & Lore", color: "bg-[#c68c4a]" },
    ],
  },
  {
    tag: "Community Powered",
    title: "Share Your Books, Inspire Fellow Readers",
    text: "Contribute to our growing library. List your favorite books in moments, track available copies, and help stories reach readers who will treasure them.",
    badge: "Lend & Share",
    accentColor: "#5ca37f",
    bgPattern: "from-[#1d352b] to-[#12231c]",
    icon: BookMarked,
    booksVisual: [
      { title: "Sapiens Journey", author: "Anthropology", color: "bg-[#3d6553]" },
      { title: "Little Explorer", author: "Bedtime Tales", color: "bg-[#9a6442]" },
      { title: "Atomic Habits", author: "Personal Growth", color: "bg-[#274b62]" },
    ],
  },
  {
    tag: "Seamless Borrowing",
    title: "Borrow in Seconds, Return with Ease",
    text: "Zero deposit, instant reservation, and clean tracking. Keep an eye on return dates and return with a single click whenever you are finished.",
    badge: "14-Day Free Borrow",
    accentColor: "#e6b375",
    bgPattern: "from-[#22392e] to-[#13221b]",
    icon: ShieldCheck,
    booksVisual: [
      { title: "Midnight Echoes", author: "Modern Fiction", color: "bg-[#354f5c]" },
      { title: "Ancient Epochs", author: "World History", color: "bg-[#805036]" },
      { title: "Starlight Voyage", author: "Pure Science", color: "bg-[#457258]" },
    ],
  },
];

export default function BannerSlider() {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={`relative min-h-[520px] sm:min-h-[560px] bg-gradient-to-br ${slide.bgPattern} px-6 py-16 sm:px-12 lg:px-20 text-white flex items-center`}
            >
              {/* Background ambient glow */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: slide.accentColor }}
              />

              <div className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-12">
                {/* Text Content */}
                <div className="lg:col-span-7">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md">
                    <slide.icon size={14} style={{ color: slide.accentColor }} />
                    <span className="uppercase tracking-wider">{slide.tag}</span>
                  </div>

                  <h1 className="font-serif text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-5xl text-[#f7f5ee]">
                    {slide.title}
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#d6dfd8] sm:text-base">
                    {slide.text}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-[#1b2b23] shadow-lg transition-all hover:bg-[#e4b57e] hover:scale-105 active:scale-95"
                    >
                      <BookOpen size={17} />
                      Browse Books
                      <ArrowRight size={17} />
                    </Link>

                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition hover:bg-white/15"
                    >
                      Join Free Library
                    </Link>
                  </div>
                </div>

                {/* Illustrated Book Stacks Visual */}
                <div className="hidden lg:col-span-5 lg:flex items-center justify-center">
                  <div className="relative h-80 w-80">
                    {/* Floating ambient circle */}
                    <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-xs" />

                    {/* Book 1 (Left tilt) */}
                    <div
                      className={`absolute left-4 top-10 h-60 w-36 -rotate-12 rounded-r-xl rounded-l-xs ${slide.booksVisual[0].color} p-4 shadow-2xl transition-transform hover:scale-105`}
                    >
                      <div className="flex h-full flex-col justify-between border border-white/20 p-2 text-white/90">
                        <BookOpen size={20} />
                        <div>
                          <p className="font-serif text-base font-bold leading-tight">
                            {slide.booksVisual[0].title}
                          </p>
                          <div className="my-2 h-px bg-white/30" />
                          <p className="text-[9px] uppercase tracking-wider text-white/70">
                            {slide.booksVisual[0].author}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Book 2 (Right tilt) */}
                    <div
                      className={`absolute right-4 top-6 h-60 w-36 rotate-12 rounded-r-xl rounded-l-xs ${slide.booksVisual[1].color} p-4 shadow-2xl transition-transform hover:scale-105`}
                    >
                      <div className="flex h-full flex-col justify-between border border-white/20 p-2 text-white/90">
                        <Sparkles size={20} />
                        <div>
                          <p className="font-serif text-base font-bold leading-tight">
                            {slide.booksVisual[1].title}
                          </p>
                          <div className="my-2 h-px bg-white/30" />
                          <p className="text-[9px] uppercase tracking-wider text-white/70">
                            {slide.booksVisual[1].author}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Book 3 (Center foreground) */}
                    <div
                      className={`absolute bottom-2 left-20 h-60 w-40 -rotate-1 rounded-r-xl rounded-l-xs ${slide.booksVisual[2].color} p-4 shadow-2xl transition-transform hover:scale-105`}
                    >
                      <div className="flex h-full flex-col justify-between border border-white/25 p-2 text-white">
                        <BookMarked size={20} />
                        <div>
                          <p className="font-serif text-lg font-bold leading-tight">
                            {slide.booksVisual[2].title}
                          </p>
                          <div className="my-2 h-px bg-white/40" />
                          <p className="text-[9px] uppercase tracking-wider text-white/80">
                            {slide.booksVisual[2].author}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute -bottom-3 right-0 rounded-full border border-white/20 bg-[#162720]/90 px-4 py-2 text-xs font-bold text-[var(--accent)] shadow-lg backdrop-blur-md">
                      ✦ {slide.badge}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
