"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, LogIn, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Page Title
  useEffect(() => {
    document.title = "BookNook | Login";
  }, []);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Registration successful! Please log in with your credentials.");
    }
  }, [searchParams]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password) {
      const msg = "Please enter both email and password.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const errorMsg = error.message || "Invalid email or password. Please try again.";
        setFormError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Welcome back! Logged in successfully.");

      if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }

      router.refresh();
    } catch {
      const errorMsg = "Something went wrong during login. Please try again.";
      setFormError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectTo && redirectTo.startsWith("/") ? redirectTo : "/",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate Google sign-in.");
    }
  }

  return (
    <div className="flex min-h-[78vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl">
        {/* Header Banner */}
        <div className="border-b border-[var(--card-border)] bg-[var(--sage)]/25 px-8 py-8 text-center sm:px-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] shadow-xs">
              <BookOpen size={20} strokeWidth={2.2} />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[var(--heading)]">
              BookNook
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[var(--heading)] sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Log in to borrow books and manage your reading list.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 sm:p-10">
          {formError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Password reset is omitted as specified in assignment requirements.")
                  }
                  className="text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full justify-center py-3.5 rounded-xl font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              <LogIn size={16} />
              <span>{loading ? "Signing in..." : "Login to BookNook"}</span>
            </button>
          </form>

          {/* Social Login Separator */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--card-border)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Or Social Login
            </span>
            <div className="h-px flex-1 bg-[var(--card-border)]" />
          </div>

          {/* Google Social Login Button (Requirement 3.1) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-xs font-bold text-[var(--foreground)] transition hover:bg-[var(--sage)]/50 hover:shadow-xs active:scale-[0.99]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Registration Link */}
          <p className="mt-8 text-center text-xs text-[var(--muted)]">
            New to BookNook?{" "}
            <Link
              href="/register"
              className="font-bold text-[var(--accent)] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
