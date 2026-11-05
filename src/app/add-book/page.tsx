"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookPlus,
  Image as ImageIcon,
  Upload,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Layers,
  User,
  Mail,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { BookCategory } from "@/types/book";

const categories: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<BookCategory>("Fiction");
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Set Page Title
  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  // Private Route check
  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login?redirect=/add-book");
    }
  }, [sessionPending, user, router]);

  // ImgBB / Image file upload handler
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB.");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading cover image to ImgBB...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Using public ImgBB API key
      const imgbbApiKey = "c1860b7405e366a7b7bc36fb48fb8fa8";
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        setImageUrl(data.data.url);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        throw new Error(data.error?.message || "ImgBB upload failed.");
      }
    } catch {
      // Fallback: create an object URL or inform user
      toast.error("Image upload failed. You can paste an image URL directly instead.", {
        id: toastId,
      });
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to add a book.");
      router.push("/login?redirect=/add-book");
      return;
    }

    if (!title.trim() || !author.trim() || !description.trim() || !imageUrl.trim()) {
      toast.error("Please fill in all required fields, including a cover image.");
      return;
    }

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setSubmitting(true);

    try {
      const newBookPayload = {
        title: title.trim(),
        author: author.trim(),
        category,
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        totalCopies: Number(totalCopies),
      };

      const result = await apiFetch<{
        success: boolean;
        message: string;
        data: { _id: string };
      }>("/books", {
        method: "POST",
        body: JSON.stringify(newBookPayload),
        requireAuth: true,
      });

      if (result.success) {
        toast.success(result.message || "Book added to BookNook successfully!");
        router.push(`/books/${result.data._id}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add book.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (sessionPending) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-width max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Library Catalog
          </Link>
        </div>

        {/* Form Container */}
        <div className="overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl">
          {/* Header Banner */}
          <div className="border-b border-[var(--card-border)] bg-[var(--sage)]/25 px-8 py-8 sm:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-fg)] shadow-xs">
                <BookPlus size={24} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Lend to the Community
                </span>
                <h1 className="font-serif text-2xl font-bold sm:text-3xl text-[var(--heading)]">
                  Add a New Book
                </h1>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              Share your favorite titles with fellow readers. Provide accurate details and set the total number of physical copies available.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
            {/* Primary Details Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Midnight Library"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matt Haig"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BookCategory)}
                  className="mt-2 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Copies (Challenge Requirement) */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  <Layers size={14} className="text-[var(--accent)]" />
                  <span>Total Copies * (Available for Borrowing)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(parseInt(e.target.value) || 1)}
                  className="mt-2 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
                <p className="mt-1.5 text-[11px] text-[var(--muted)]">
                  This sets both initial total and available copies in the library.
                </p>
              </div>
            </div>

            {/* Book Image Upload / URL Section */}
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--sage)]/15 p-6">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <ImageIcon size={15} className="text-[var(--accent)]" />
                <span>Book Cover Image * (Upload or Image URL)</span>
              </label>

              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-12">
                {/* Upload Input & URL input */}
                <div className="sm:col-span-8 space-y-4">
                  {/* Direct File Upload button */}
                  <div>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--input-border)] bg-[var(--card-bg)] px-4 py-5 text-center text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--foreground)]">
                      {uploadingImage ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                          <span>Uploading to ImgBB...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="text-[var(--accent)]" />
                          <span>Click to Upload Cover Image File (ImgBB)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--card-border)]" />
                    <span className="text-[11px] font-bold text-[var(--muted)] uppercase">or paste image url</span>
                    <div className="h-px flex-1 bg-[var(--card-border)]" />
                  </div>

                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                  />
                </div>

                {/* Live Image Preview */}
                <div className="sm:col-span-4 flex items-center justify-center">
                  <div className="relative aspect-[3/4] w-28 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Cover Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center text-[var(--muted)]">
                        <ImageIcon size={24} />
                        <span className="mt-1 text-[10px]">Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Short Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write a concise overview of the book, themes, and what readers will discover..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
              />
            </div>

            {/* Read-Only Contributor Info (Requirement 4.1) */}
            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--sage)]/25 p-5 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  <User size={13} />
                  <span>Contributor Name (Read-only)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || "Member"}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--card-bg)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  <Mail size={13} />
                  <span>Contributor Email (Read-only)</span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || "member@booknook.local"}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--card-bg)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 border-t border-[var(--card-border)] pt-6">
              <Link href="/books" className="secondary-button text-xs py-3 px-6">
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="primary-button text-sm py-3 px-8 rounded-xl font-bold shadow-md hover:scale-105 active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Book to Catalog...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Add Book to Library</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
