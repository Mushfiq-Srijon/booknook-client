import { Compass, BookCheck, Sparkles, RefreshCw } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Browse the Library",
    description: "Explore our rich digital catalog across Fiction, Science, History, and Kids categories to find your next read.",
    icon: Compass,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    step: "02",
    title: "Instant 1-Click Borrow",
    description: "Logged-in readers can reserve any available book instantly with automatic 14-day tracking and zero hidden fees.",
    icon: BookCheck,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    step: "03",
    title: "Read at Your Pace",
    description: "Enjoy peaceful reading without disruptions. Check due dates and days remaining anytime in your personal dashboard.",
    icon: Sparkles,
    accent: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  {
    step: "04",
    title: "Effortless Return",
    description: "Finished reading? Return the book with a single click. The shelf inventory automatically increments for the next reader.",
    icon: RefreshCw,
    accent: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="section-padding bg-[var(--sage)]/25 border-y border-[var(--card-border)]">
      <div className="container-width">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label">Simple & Joyful</span>
          <h2 className="section-title mt-2">How Borrowing Works</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            A small online library designed with simplicity at heart. Add a book, borrow a book, return a book.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold tracking-tighter text-[var(--accent)] font-serif">
                      {item.step}
                    </span>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${item.accent}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[var(--heading)]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent)]">
                  <span>Step {index + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
