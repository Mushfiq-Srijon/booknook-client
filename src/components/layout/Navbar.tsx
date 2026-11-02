"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Menu,
    X,
    BookOpen,
    ChevronDown,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-[#243d32]/10 bg-[#f7f4ea]/95 backdrop-blur-md">
            <div className="container-width flex h-[76px] items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
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
                    {siteConfig.navigation
                        .filter((item) => !item.private)
                        .map((item) => (
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
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-[#243d32] hover:text-[#b17b43]"
                    >
                        Login
                    </Link>

                    <Link href="/register" className="primary-button">
                        Join BookNook
                        <ChevronDown size={15} className="rotate-[-90deg]" />
                    </Link>
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
                        {siteConfig.navigation
                            .filter((item) => !item.private)
                            .map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-sm font-medium text-[#243d32]"
                                >
                                    {item.label}
                                </Link>
                            ))}

                        <div className="flex gap-3 border-t border-[#243d32]/10 pt-4">
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
                    </nav>
                </div>
            )}
        </header>
    );
}