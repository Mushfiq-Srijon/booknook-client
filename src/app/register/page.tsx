"use client";

import { FormEvent, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  UserPlus,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Set Page Title
  useEffect(() => {
    document.title = "BookNook | Register";
  }, []);

  // Real-time password validation criteria (Requirement 3.2)
  const validation = useMemo(() => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasMinLength: password.length >= 6,
    };
  }, [password]);

  const isPasswordValid =
    validation.hasUppercase && validation.hasLowercase && validation.hasMinLength;

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !password) {
      const msg = "Please fill in all required fields.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    // Strict Password Validation per Assignment Rules
    if (!validation.hasMinLength) {
      const msg = "Password must be at least 6 characters long.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (!validation.hasUppercase) {
      const msg = "Password must include at least one uppercase letter (A-Z).";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (!validation.hasLowercase) {
      const msg = "Password must include at least one lowercase letter (a-z).";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (photoUrl.trim()) {
      try {
        new URL(photoUrl.trim());
      } catch {
        const msg = "Please provide a valid Photo URL.";
        setFormError(msg);
        toast.error(msg);
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (error) {
        const msg = error.message || "Registration failed. Please try again.";
        setFormError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Account created successfully! Please log in.");
      // Navigate to Login page on successful registration per Requirement 3.2
      router.push("/login?registered=true");
    } catch {
      const msg = "Something went wrong during registration. Please try again.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate Google sign-in.");
    }
  }

  return (
    <div className="flex min-h-[82vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl">
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
            Create an Account
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Join our warm community to borrow books and share your collection.
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

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
              >
                Full Name *
              </label>
              <div className="relative mt-1.5">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
              >
                Email Address *
              </label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label
                htmlFor="photoUrl"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
              >
                Profile Photo URL (Optional)
              </label>
              <div className="relative mt-1.5">
                <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="photoUrl"
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
              >
                Password *
              </label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong password"
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>

              {/* Real-time Password Validation Checklist */}
              {password.length > 0 && (
                <div className="mt-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--sage)]/25 p-3 text-[11px] space-y-1.5">
                  <p className="font-bold text-[var(--muted)] uppercase tracking-wider">
                    Password Requirements:
                  </p>
                  <div className="flex items-center gap-1.5">
                    {validation.hasMinLength ? (
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    ) : (
                      <XCircle size={13} className="text-red-400" />
                    )}
                    <span className={validation.hasMinLength ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-[var(--muted)]"}>
                      At least 6 characters long
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {validation.hasUppercase ? (
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    ) : (
                      <XCircle size={13} className="text-red-400" />
                    )}
                    <span className={validation.hasUppercase ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-[var(--muted)]"}>
                      At least one uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {validation.hasLowercase ? (
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    ) : (
                      <XCircle size={13} className="text-red-400" />
                    )}
                    <span className={validation.hasLowercase ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-[var(--muted)]"}>
                      At least one lowercase letter (a-z)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]"
              >
                Confirm Password *
              </label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full justify-center py-3.5 rounded-xl font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-2"
            >
              <UserPlus size={16} />
              <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
            </button>
          </form>

          {/* Social Login */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--card-border)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Or Social Registration
            </span>
            <div className="h-px flex-1 bg-[var(--card-border)]" />
          </div>

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
            <span>Register with Google</span>
          </button>

          {/* Login Link */}
          <p className="mt-8 text-center text-xs text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--accent)] hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
