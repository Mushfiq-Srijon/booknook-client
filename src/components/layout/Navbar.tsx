"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  ChevronDown,
  User,
  LogOut,
  Sun,
  Moon,
  PlusCircle,
  BookMarked,
  Library,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { signOut, useSession } from "@/lib/auth-client";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const isLoggedIn = !!user;

  // Close profile dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Logged out successfully.");
      setProfileOpen(false);
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const navigationItems = siteConfig.navigation.filter(
    (item) => !item.private || isLoggedIn
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="container-width flex h-[74px] items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-[1.02]"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm">
            <BookOpen size={22} strokeWidth={2.2} />
          </div>

          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--heading)]">
              BookNook
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[1.5px] text-[var(--muted)] sm:block">
              Online Library
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-fg)] shadow-xs"
                    : "text-[var(--foreground)]/80 hover:bg-[var(--sage)]/50 hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle + Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] transition-all hover:bg-[var(--sage)]/40 hover:scale-105"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon size={18} className="text-[var(--foreground)]" />
            ) : (
              <Sun size={18} className="text-[var(--accent)]" />
            )}
          </button>

          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-lg bg-[var(--sage)]/60" />
          ) : isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-2.5 py-1.5 transition hover:border-[var(--accent)] hover:shadow-xs"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User avatar"}
                    className="h-8 w-8 rounded-full border border-[var(--card-border)] object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-fg)]">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <span className="max-w-[130px] truncate text-xs font-bold text-[var(--foreground)]">
                  {user.name || "User"}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[var(--muted)] transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-1.5 shadow-xl transition-all"
                  role="menu"
                >
                  <div className="border-b border-[var(--card-border)] px-3 py-2.5">
                    <p className="truncate text-xs font-bold text-[var(--heading)]">
                      {user.name}
                    </p>
                    <p className="truncate text-[11px] text-[var(--muted)]">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--sage)]/50"
                      role="menuitem"
                    >
                      <User size={15} className="text-[var(--accent)]" />
                      My Profile
                    </Link>

                    <Link
                      href="/my-books"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--sage)]/50"
                      role="menuitem"
                    >
                      <Library size={15} className="text-[var(--accent)]" />
                      My Books
                    </Link>

                    <Link
                      href="/my-borrows"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--sage)]/50"
                      role="menuitem"
                    >
                      <BookMarked size={15} className="text-[var(--accent)]" />
                      My Borrows
                    </Link>

                    <Link
                      href="/add-book"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--sage)]/50"
                      role="menuitem"
                    >
                      <PlusCircle size={15} className="text-[var(--accent)]" />
                      Add Book
                    </Link>
                  </div>

                  <div className="border-t border-[var(--card-border)] pt-1">
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                      role="menuitem"
                    >
                      <LogOut size={15} />
                      {loggingOut ? "Signing out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:text-[var(--accent)]"
              >
                Login
              </Link>

              <Link href="/register" className="primary-button text-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls: Theme toggle + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)]"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)]"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="border-t border-[var(--card-border)] bg-[var(--background)] px-5 py-5 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--primary-fg)]"
                      : "text-[var(--foreground)] hover:bg-[var(--sage)]/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-[var(--card-border)] pt-4">
              {isPending ? (
                <p className="text-xs text-[var(--muted)]">Loading profile...</p>
              ) : isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-[var(--card-bg)] p-3 border border-[var(--card-border)]">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-[var(--primary-fg)]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[var(--heading)]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[var(--muted)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--sage)]/50"
                  >
                    <User size={16} className="text-[var(--accent)]" />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    {loggingOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="secondary-button justify-center text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="primary-button justify-center text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
