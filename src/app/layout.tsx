import type { Metadata } from "next";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookNook | Your Little Reading Corner",
  description:
    "Discover books, explore new stories, borrow books, and manage your personal library with BookNook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />

        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}