# 📚 BookNook – A Small Online Library

> **"Add a book, borrow a book, return a book."**  
> BookNook is a warm, modern digital library platform connecting book lovers. Readers can explore diverse genres, add books to the catalog, borrow available copies with transparent real-time tracking, and return them seamlessly in a clean, distraction-free environment.

---

## 🌐 Live Website & Links
- **Live Site URL:** [https://booknook-client.vercel.app](https://booknook-client.vercel.app) *(or your deployed Vercel domain)*
- **Client Repository:** [https://github.com/Mushfiq-Srijon/booknook-client](https://github.com/Mushfiq-Srijon/booknook-client)
- **Server Repository:** [https://github.com/Mushfiq-Srijon/booknook-server](https://github.com/Mushfiq-Srijon/booknook-server)

---

## ✨ Key Features (Minimum 5 Core Highlights)

1. **Interactive Swiper.js Hero Banner & Dynamic New Arrivals:**
   - Multi-slide interactive showcase highlighting community collections, lending perks, and reading convenience.
   - Live MongoDB-powered New Arrivals feed loading the latest 6 additions with responsive cover presentations and availability badges.
2. **Robust Borrowing Lifecycle with Double-Borrow Protection:**
   - One-click modal reservation with read-only borrower verification and automatic 14-day due date computation.
   - Built-in prevention against duplicate concurrent borrows and real-time error toasts.
3. **Atomic Inventory Tracking (`$inc` Availability Management):**
   - Book catalog tracks both total physical copies and currently available copies.
   - Available count automatically decrements by 1 upon borrowing and increments by 1 upon return using MongoDB atomic operators.
   - Books with 0 copies disable the Borrow action and visibly display an interactive "Not Available" badge.
4. **Comprehensive Book Management (CRUD for Contributors):**
   - Authenticated contributors can add new books with ImgBB direct file upload integration or custom image URLs.
   - Dedicated "My Books" dashboard supporting view toggling (Card Grid vs. Table view), pre-filled editing modal, and custom accessible deletion confirmation dialogs.
5. **Modern Authentication & JWT Token Validation:**
   - Powered by Next.js BetterAuth with MongoDB adapter and JWT issuance.
   - Express.js backend validates asymmetric tokens against BetterAuth JWKS endpoints, securing private CRUD and borrowing endpoints.
6. **Cozy Literary Aesthetics with Dark / Light Mode Toggle:**
   - Bespoke color palette featuring parchment warmth (`#f7f4ea`), forest greens (`#243d32`), amber highlights (`#d9a66b`), and evening dark mode.
   - Smooth transitions, accessible dialogs with backdrop containment, and custom 404 navigation.

---

## 🛠️ Technology Stack

### **Frontend (Client)**
- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript & React 19
- **Styling:** Tailwind CSS v4, HeroUI, Custom CSS Variables
- **UI Components & Icons:** Lucide React, Swiper.js, Sonner (rich toast notifications)
- **Auth Client:** BetterAuth Client with JWT plugin

### **Backend (Server)**
- **Runtime:** Node.js & Express.js
- **Language:** TypeScript
- **Database:** MongoDB Atlas (Native MongoDB Driver 7.x)
- **Security & Tokens:** `jose` (JWKS & JWT verification), CORS, dotenv

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or newer)
- MongoDB Atlas database connection string

### 2. Server Setup
```bash
cd booknook-server
npm install
npm run dev
```
Server environment variables (`booknook-server/.env`):
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=booknook
AUTH_JWKS_URL=http://localhost:3000/api/auth/jwks
AUTH_ISSUER=http://localhost:3000
AUTH_AUDIENCE=http://localhost:3000
```

### 3. Client Setup
```bash
cd booknook-client
npm install
npm run dev
```
Client environment variables (`booknook-client/.env.local`):
```env
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=booknook
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 API Endpoints Summary

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/api/books` | Public | Get all books (supports `?limit=6`, `?category=...`, `?email=...`, `?search=...`) |
| `GET` | `/api/books/:id` | Public | Get single book details |
| `POST` | `/api/books` | JWT Protected | Add new book to catalog |
| `PATCH` | `/api/books/:id` | JWT Protected | Update book (creator only) |
| `DELETE` | `/api/books/:id` | JWT Protected | Delete book (creator only, blocked if active borrows exist) |
| `POST` | `/api/borrows` | JWT Protected | Borrow an available book |
| `GET` | `/api/borrows` | JWT Protected | Get active borrows for authenticated user |
| `DELETE` | `/api/borrows/:id` | JWT Protected | Return borrowed book and restore inventory copy |

---

## 📜 License
Developed with care for BookNook assignment submission.
