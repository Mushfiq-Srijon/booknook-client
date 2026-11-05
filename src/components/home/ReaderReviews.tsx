import { Star, Quote, CheckCircle2 } from "lucide-react";

const reviews = [
  {
    quote: "BookNook completely revitalized my love for fiction. The borrowing system is delightfully frictionless, and tracking my read returns has never been simpler.",
    author: "Elena Vance",
    role: "Avid Fiction Reader",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    tag: "Fiction Lover",
  },
  {
    quote: "As a student researcher, finding science and history books shared by other members has been invaluable. Clean, ad-free, and respectful of readers' time.",
    author: "Marcus Sterling",
    role: "History & Science Researcher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    tag: "History & Science",
  },
  {
    quote: "My kids look forward to picking new bedtime reads every weekend. Returning books takes one single click, and the cozy interface is a breath of fresh air.",
    author: "Sarah Jenkins",
    role: "Parent & Educator",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    tag: "Kids Corner",
  },
];

export default function ReaderReviews() {
  return (
    <section className="section-padding">
      <div className="container-width">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Community Stories</span>
          <h2 className="section-title mt-2">Loved by Book Lovers Everywhere</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Discover what our reading community has to say about their experience in the BookNook sanctuary.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote size={20} className="text-[var(--accent)] opacity-40" />
                </div>

                <p className="mt-4 font-serif text-sm italic leading-relaxed text-[var(--foreground)]/90">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[var(--card-border)] pt-4">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="h-10 w-10 rounded-full border border-[var(--card-border)] object-cover"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-[var(--heading)]">
                      {item.author}
                    </p>
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  </div>
                  <p className="truncate text-[11px] text-[var(--muted)]">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats Callout */}
        <div className="mt-14 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            <div>
              <p className="font-serif text-3xl font-extrabold text-[var(--heading)]">9+ Books</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Active in Catalog</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-extrabold text-[var(--heading)]">100% Free</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Open Source & Community</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-extrabold text-[var(--heading)]">14 Days</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Comfortable Reading Window</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-extrabold text-[var(--heading)]">4.9 / 5</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Community Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
