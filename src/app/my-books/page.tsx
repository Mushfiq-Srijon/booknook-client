"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Library,
  PlusCircle,
  Edit3,
  Trash2,
  BookOpen,
  Layers,
  ArrowRight,
  AlertTriangle,
  X,
  LayoutGrid,
  Table as TableIcon,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Book, BookCategory } from "@/types/book";

const categories: BookCategory[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState<BookCategory>("Fiction");
  const [editCopies, setEditCopies] = useState<number>(1);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete Modal State (Custom Confirm Modal per requirements)
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Page Title per requirements
  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  // Private Route check
  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/login?redirect=/my-books");
    }
  }, [sessionPending, user, router]);

  async function loadUserBooks() {
    if (!user?.email) return;
    try {
      setLoading(true);
      setError("");
      const response = await apiFetch<{ success: boolean; data: Book[] }>(
        `/books?email=${encodeURIComponent(user.email)}`
      );
      setBooks(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.email) {
      loadUserBooks();
    }
  }, [user]);

  // Open Edit Modal with pre-filled book data
  function openEditModal(book: Book) {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditCopies(book.totalCopies);
    setEditImageUrl(book.imageUrl);
    setEditDescription(book.description);
  }

  // Handle Edit Submit
  async function handleUpdateBook(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBook) return;

    if (!editTitle.trim() || !editAuthor.trim() || !editDescription.trim() || !editImageUrl.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setUpdating(true);

    try {
      const payload = {
        title: editTitle.trim(),
        author: editAuthor.trim(),
        category: editCategory,
        totalCopies: Number(editCopies),
        imageUrl: editImageUrl.trim(),
        description: editDescription.trim(),
      };

      const res = await apiFetch<{ success: boolean; message: string; data: Book }>(
        `/books/${editingBook._id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
          requireAuth: true,
        }
      );

      if (res.success) {
        toast.success(res.message || "Book updated successfully!");
        setBooks((prev) =>
          prev.map((b) => (b._id === editingBook._id ? { ...b, ...payload } : b))
        );
        setEditingBook(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update book.";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  }

  // Handle Delete Confirmation (Custom Modal per requirements)
  async function handleConfirmDelete() {
    if (!deletingBook) return;
    setIsDeleting(true);

    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/books/${deletingBook._id}`,
        {
          method: "DELETE",
          requireAuth: true,
        }
      );

      if (res.success) {
        toast.success(res.message || "Book deleted successfully!");
        setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
        setDeletingBook(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete book.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  if (sessionPending || (loading && books.length === 0)) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
        <p className="text-xs font-semibold text-[var(--muted)]">Loading your personal books...</p>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-width">
        {/* Header Hero Area */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--card-border)] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              <Library size={14} />
              Personal Library
            </div>
            <h1 className="font-serif text-3xl font-extrabold sm:text-4xl text-[var(--heading)] mt-2">
              My Books
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage the books you have contributed to the BookNook catalog.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  viewMode === "cards"
                    ? "bg-[var(--primary)] text-[var(--primary-fg)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Card View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-[var(--primary)] text-[var(--primary-fg)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Table View"
              >
                <TableIcon size={16} />
              </button>
            </div>

            <Link href="/add-book" className="primary-button text-xs py-2.5 px-4.5 rounded-xl">
              <PlusCircle size={15} />
              <span>Add New Book</span>
            </Link>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <div className="mt-12 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center shadow-xs">
            <BookOpen size={52} className="mx-auto text-[var(--accent)] opacity-60" />
            <h3 className="mt-4 font-serif text-2xl font-bold text-[var(--heading)]">
              You haven&apos;t added any books yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
              Share your favorite titles with fellow book lovers! When you add a book, it will appear here for you to edit or manage.
            </p>
            <Link href="/add-book" className="primary-button mt-6 text-sm">
              <PlusCircle size={16} />
              <span>Add Your First Book</span>
            </Link>
          </div>
        )}

        {/* View Mode: Cards */}
        {books.length > 0 && viewMode === "cards" && (
          <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const isAvailable = book.availableCopies > 0;
              return (
                <div
                  key={book._id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-[var(--accent)]"
                >
                  <div>
                    {/* Book Thumbnail */}
                    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-[var(--sage)]/30">
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                          <BookOpen size={40} />
                        </div>
                      )}

                      <span className="absolute left-3 top-3 rounded-full bg-[var(--card-bg)]/95 px-3 py-1 text-[11px] font-bold text-[var(--foreground)] shadow-xs">
                        {book.category}
                      </span>

                      <span
                        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs ${
                          isAvailable
                            ? "bg-emerald-600/90 text-white"
                            : "bg-rose-600/90 text-white"
                        }`}
                      >
                        {isAvailable ? `${book.availableCopies} Available` : "Not Available"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="line-clamp-1 font-serif text-lg font-bold text-[var(--heading)]">
                        {book.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-[var(--muted)]">
                        By {book.author}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs text-[var(--foreground)]/80">
                        {book.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)] border-t border-[var(--card-border)] pt-3">
                        <span className="flex items-center gap-1">
                          <Layers size={13} className="text-[var(--accent)]" />
                          Total: {book.totalCopies}
                        </span>
                        <span>Avail: {book.availableCopies}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View, Edit, Delete */}
                  <div className="mt-5 flex items-center gap-2 border-t border-[var(--card-border)] pt-4">
                    <Link
                      href={`/books/${book._id}`}
                      className="secondary-button flex-1 text-xs py-2 px-3 justify-center"
                    >
                      <span>View</span>
                    </Link>

                    {/* Requirement 4: "Each book has an 'Edit' button" */}
                    <button
                      onClick={() => openEditModal(book)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--sage)]/50 px-3.5 py-2 text-xs font-bold text-[var(--foreground)] transition hover:bg-[var(--accent)] hover:text-white"
                      title="Edit book details"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>

                    {/* Requirement 4: "Each book has a 'Delete' button. Before you delete, show a confirm modal" */}
                    <button
                      onClick={() => setDeletingBook(book)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                      title="Delete book from catalog"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode: Table (Requirement 4: "Show them in a table or as cards") */}
        {books.length > 0 && viewMode === "table" && (
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--card-border)] bg-[var(--sage)]/25 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="px-6 py-4">Cover & Title</th>
                  <th className="px-4 py-4">Author</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4 text-center">Copies</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {books.map((book) => (
                  <tr key={book._id} className="transition hover:bg-[var(--sage)]/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.imageUrl && (
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="h-12 w-9 rounded-md object-cover shadow-xs"
                          />
                        )}
                        <div>
                          <p className="font-serif text-sm font-bold text-[var(--heading)] line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-[11px] text-[var(--muted)]">Added: {new Date(book.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      {book.author}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-[var(--sage)]/50 px-2.5 py-1 text-[11px] font-bold text-[var(--foreground)]">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-bold">
                      <span className="text-[var(--heading)]">{book.availableCopies}</span>
                      <span className="text-[var(--muted)] font-normal"> / {book.totalCopies}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/books/${book._id}`}
                          className="rounded-lg border border-[var(--card-border)] px-2.5 py-1.5 text-xs font-semibold hover:bg-[var(--sage)]"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => openEditModal(book)}
                          className="rounded-lg bg-[var(--sage)]/50 px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingBook(book)}
                          className="rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal (Pre-filled form per Requirement 4) */}
      {editingBook && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingBook(null);
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Update Details
                </span>
                <h3 id="edit-dialog-title" className="font-serif text-2xl font-bold text-[var(--heading)] mt-1">
                  Edit Book
                </h3>
              </div>
              <button
                onClick={() => setEditingBook(null)}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--sage)]/50 hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateBook} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as BookCategory)}
                    className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Total Copies *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editCopies}
                  onChange={(e) => setEditCopies(parseInt(e.target.value) || 1)}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[var(--card-border)] pt-5">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="secondary-button text-xs py-2 px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="primary-button text-xs py-2 px-6"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Delete Modal (NOT browser confirm per Requirement 4) */}
      {deletingBook && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingBook(null);
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-red-500/20 bg-[var(--card-bg)] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <AlertTriangle size={28} />
            </div>

            <div className="mt-4 text-center">
              <h3 id="delete-dialog-title" className="font-serif text-xl font-bold text-[var(--heading)]">
                Delete This Book?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                Are you sure you want to permanently remove <strong className="text-[var(--foreground)]">&ldquo;{deletingBook.title}&rdquo;</strong> from the library catalog? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                autoFocus // safe action autofocus per Modern Web Guidance dialog rules
                onClick={() => setDeletingBook(null)}
                className="secondary-button flex-1 text-xs py-2.5 justify-center"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
