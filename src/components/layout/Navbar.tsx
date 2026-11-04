
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Menu,
    X,
    BookOpen,
    ChevronDown,
    User,
    LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const { data: session, isPending } = useSession();

    const user = session?.user;
    const isLoggedIn = !!user;

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
        <header className="sticky top-0 z-50 border-b border-[#243d32]/10 bg-[#f7f4ea]/95 backdrop-blur-md">
            <div className="container-width flex h-[76px] items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#243d32] text-[#f7f4ea]">
                        <BookOpen size={23} />
                    </div>

                    <div>
                        <h1 className="text-[22px] font-bold tracking-tight text-[#243d32]">
                            BookNook
                        </h1>
                        <p className="text-[9px] uppercase tracking-[2px] text-[#777b70]">
                            Your reading corner
                        </p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-8 lg:flex">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-[13px] font-medium text-[#46564b] transition hover:text-[#b17b43]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    {isPending ? (
                        <div className="h-9 w-24 animate-pulse rounded-lg bg-[#dce5db]" />
                    ) : isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-[#dce5db]"
                                aria-expanded={profileOpen}
                            >
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="h-9 w-9 rounded-full border border-[#243d32]/20 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243d32] text-sm font-semibold text-white">
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}

                                <span className="max-w-[120px] truncate text-sm font-semibold text-[#243d32]">
                                    {user.name}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-[#243d32] transition ${profileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#243d32]/10 bg-[#fffdf6] p-2 shadow-lg">
                                    <div className="border-b border-[#243d32]/10 px-3 py-2">
                                        <p className="truncate text-sm font-semibold text-[#243d32]">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-[#777b70]">
                                            {user.email}
                                        </p>
                                    </div>

                                    <Link
                                        href="/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#46564b] transition hover:bg-[#dce5db]"
                                    >
                                        <User size={16} />
                                        My Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <LogOut size={16} />
                                        {loggingOut ? "Logging out..." : "Logout"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-[#243d32] hover:text-[#b17b43]"
                            >
                                Login
                            </Link>

                            <Link href="/register" className="primary-button">
                                Join BookNook
                                <ChevronDown
                                    size={15}
                                    className="rotate-[-90deg]"
                                />
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-md p-2 text-[#243d32] hover:bg-[#dce5db] lg:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-[#243d32]/10 bg-[#f7f4ea] px-5 py-5 lg:hidden">
                    <nav className="flex flex-col gap-4">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-sm font-medium text-[#243d32]"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="border-t border-[#243d32]/10 pt-4">
                            {isPending ? (
                                <p className="text-sm text-[#777b70]">
                                    Loading account...
                                </p>
                            ) : isLoggedIn ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#243d32] text-white">
                                                {user.name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-[#243d32]">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-[#777b70]">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href="/profile"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 text-sm text-[#243d32]"
                                    >
                                        <User size={16} />
                                        My Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="flex items-center gap-2 text-sm text-red-600 disabled:opacity-50"
                                    >
                                        <LogOut size={16} />
                                        {loggingOut ? "Logging out..." : "Logout"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Link
                                        href="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="secondary-button flex-1"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={() => setMenuOpen(false)}
                                        className="primary-button flex-1"
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
