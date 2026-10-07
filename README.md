# 🌍 Wanderlust — Travel & Stay Rental Platform

> A full-stack Airbnb-inspired web application where users can discover, list, and book unique accommodations worldwide — complete with interactive maps, review systems, image hosting, and availability-based filtering.

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Live Demo & Screenshots](#-live-demo--screenshots)
3. [Core Features](#-core-features)
4. [Tech Stack & Versions](#-tech-stack--versions)
5. [Architecture & Design Decisions](#-architecture--design-decisions)
6. [Data Models](#-data-models)
7. [Project Structure](#-project-structure)
8. [API Routes](#-api-routes)
9. [Security Implementation](#-security-implementation)
10. [Performance Optimizations](#-performance-optimizations)
11. [Getting Started](#-getting-started)
12. [Environment Variables](#-environment-variables)
13. [Known Limitations](#-known-limitations)
14. [Future Scope & Potential Features](#-future-scope--potential-features)
15. [Interview Q&A — Design Decisions](#-interview-qa--design-decisions)
16. [License](#-license)

---

## 🧭 Project Overview

**Wanderlust** is a full-stack **MVC (Model-View-Controller)** web application built with **Node.js + Express.js** on the backend and **EJS (Embedded JavaScript Templates)** on the frontend. It replicates core Airbnb-like functionality:

- Hosts can create listings with photos, pricing, location, category, and guest capacity.
- Guests can search and filter listings by **category**, **location**, **check-in/check-out dates**, and **number of guests**.
- Each listing is **geocoded** using the TomTom REST API and displayed on an **interactive map**.
- Users can **register, log in, and log out** securely with **Passport.js Local Strategy**.
- Guests can leave **star ratings (1–5)** and comments; only authors can delete their own reviews.
- Only listing **owners** can edit or delete their properties.
- Images are stored in **Cloudinary** (cloud-based media management) via `multer` and `multer-storage-cloudinary`.
- Sessions are persisted to **MongoDB Atlas** using `connect-mongo`, so sessions survive server restarts.
- Response **compression**, **in-memory caching**, and **static asset caching** are implemented for performance.

This project was built as a capstone full-stack MERN-adjacent project to demonstrate end-to-end web development skills.

---

## 🎥 Live Demo & Screenshots

```
Live URL: https://wanderlust-u7hv.onrender.com/listings
```

---

## ✨ Core Features

| Feature | Description |
|---|---|
| **Browse Listings** | View all available accommodations on a responsive grid |
| **Category Filter** | Filter by 24 categories: Beach, Mountain, Castles, Tiny Homes, Vineyards, etc. |
| **Search & Filter** | Filter by location (regex), check-in/check-out dates, and number of guests |
| **Date Availability** | Listings with conflicting bookings are excluded from search results |
| **Interactive Map** | Each listing's exact location shown on a TomTom-powered map marker |
| **Geocoding** | Location + Country string is auto-converted to GeoJSON coordinates on create/update |
| **User Auth** | Register, login, logout using Passport.js Local Strategy with session persistence |
| **Create Listings** | Authenticated users can post listings with title, description, price, category, location, image |
| **Image Upload** | Photos uploaded via `multer` → stored in Cloudinary, URL saved to MongoDB |
| **Edit / Delete** | Listing owners can update or remove their properties (ownership enforced server-side) |
| **Reviews** | Logged-in users can leave 1–5 star ratings + text comments |
| **Review Authorship** | Only the review author can delete their review |
| **Flash Messages** | Success and error feedback on every action using `connect-flash` |
| **Session Persistence** | Sessions stored in MongoDB via `connect-mongo` — survives server restarts |
| **Cascading Delete** | Deleting a listing automatically deletes all its associated reviews via Mongoose middleware |
| **Responsive Design** | Mobile-friendly UI built with custom CSS |

---

## 🛠 Tech Stack & Versions

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | `>=16.0.0` | JavaScript runtime |
| **Express.js** | `^4.18.2` | Web framework — routing, middleware pipeline |
| **Mongoose** | `^8.0.0` | MongoDB ODM — schema definition, validation, population |
| **MongoDB Atlas** | Cloud (M0 Free Tier) | NoSQL document database |
| **Passport.js** | `^0.7.0` | Authentication middleware |
| **passport-local** | `^1.0.0` | Username/password authentication strategy |
| **passport-local-mongoose** | `^8.0.0` | Plugin: auto-adds username, hash, salt + serialize/deserialize |
| **express-session** | `^1.18.1` | Server-side session management |
| **connect-mongo** | `^5.1.0` | MongoDB-backed session store |
| **connect-flash** | `^0.1.1` | One-time flash messages via session |
| **multer** | `^1.4.5-lts.2` | Multipart/form-data file upload handling |
| **multer-storage-cloudinary** | `^4.0.0` | Cloudinary storage engine for multer |
| **cloudinary** | `^1.41.3` | Cloud image storage & transformation API |
| **joi** | `^17.13.3` | Server-side schema validation for request bodies |
| **method-override** | `^3.0.0` | Enables PUT/DELETE in HTML forms via `?_method=` |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing control |
| **compression** | `^1.8.0` | Gzip response compression |
| **cookie-parser** | `^1.4.7` | Cookie parsing middleware |
| **node-cache** | `^5.1.2` | In-memory response caching (TTL: 10 min) |
| **node-fetch** | `^2.7.0` | HTTP client for TomTom Geocoding REST API calls |
| **dotenv** | `^16.5.0` | `.env` environment variable loader |
| **axios** | `^1.9.0` | Additional HTTP client (available in project) |
| **@supabase/supabase-js** | `^2.49.5` | Supabase client (available for future DB experiments) |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **EJS** | `^3.1.10` | Server-side HTML templating |
| **EJS-Mate** | `^4.0.0` | Layout/partial inheritance for EJS |
| **TomTom Web SDK Maps** | `^6.25.0` | Interactive map rendering on listing detail pages |
| **Custom CSS** | — | Responsive styles, component-level organization |
| **Vanilla JS** | — | Category scroll, tax toggle switch, navbar interaction |

### DevOps / Tooling

| Tool | Purpose |
|---|---|
| **nodemon** | Auto-restart server on file changes during development |
| **MongoDB Atlas** | Managed cloud database with connection pooling |
| **Cloudinary** | CDN-backed image storage |
| **dotenv** | Environment variable management |

---

## 🏗 Architecture & Design Decisions

### Pattern: MVC (Model-View-Controller)

```
Request → Express Router → Controller → Model (Mongoose) → MongoDB
                                     ↓
                               EJS View (rendered HTML)
                                     ↓
                               Response to Client
```

- **Models** (`/models`) — Mongoose schemas define data shape and relationships.
- **Views** (`/views`) — EJS templates render HTML server-side with data from controllers.
- **Controllers** (`/controllers`) — Business logic is separated from route definitions for clean code.
- **Routes** (`/routes`) — Express routers map HTTP methods + paths to controller functions.

### Why Server-Side Rendering (EJS) instead of React?

This project intentionally uses **SSR with EJS** instead of a React SPA to:
- Demonstrate traditional MVC architecture understanding.
- Achieve faster initial page loads without a separate API layer.
- Simplify auth flow (no JWT needed — sessions work naturally with SSR).

### Why MongoDB over SQL?

- Listings naturally fit a **document model** (variable fields, embedded reviews/bookings).
- Schema flexibility allows adding new listing categories without migrations.
- MongoDB Atlas provides free-tier hosting with built-in replication.

### Why Passport.js Local Strategy?

- Keeps auth **self-contained** without third-party OAuth dependency for initial version.
- `passport-local-mongoose` automatically handles **bcrypt password hashing + salting**, so plaintext passwords are never stored.
- Session-based auth is simpler for a server-rendered app than JWT.

### MongoDB Connection Pooling

```javascript
maxPoolSize: 10,   // Max concurrent connections
minPoolSize: 2,    // Keep 2 connections warm
socketTimeoutMS: 45000
```

Connection pool is tuned for a small-to-medium traffic scenario on Atlas free tier.

### Session Design

- Sessions expire in **7 days** (`maxAge: 7 * 24 * 60 * 60 * 1000`)
- Session data is encrypted and stored in MongoDB (`connect-mongo`) — survives restarts.
- `touchAfter: 24 * 3600` — sessions are lazily updated (writes only once per 24h if unchanged) to reduce DB writes.

---

## 📦 Data Models

### Listing Schema

```
title        : String (required)
description  : String
image        : { url: String, filename: String }
price        : Number
location     : String
country      : String
maxGuests    : Number (default: 1)
category     : String (enum — 24 categories)
geometry     : GeoJSON Point { type: "Point", coordinates: [lon, lat] }
owner        : ObjectId → User
reviews      : [ObjectId → Review]
bookings     : [{ startDate: Date, endDate: Date, guest: ObjectId → User }]
createdAt    : Date (auto)
```

**Categories (24):** `rooms`, `beach`, `mountain`, `village`, `city`, `camping`, `arctic`, `desert`, `countryside`, `lakefront`, `amazing-pools`, `camper-vans`, `castles`, `containers`, `design`, `earth-homes`, `farms`, `national-parks`, `vineyards`, `omg`, `tiny-homes`, `towers`, `windmills`, `luxe`

### Review Schema

```
comment   : String
rating    : Number (1–5)
author    : ObjectId → User
createdAt : Date (auto)
```

### User Schema

```
email    : String (required)
username : String (via passport-local-mongoose)
hash     : String (bcrypt — stored by passport-local-mongoose)
salt     : String (per-user salt — stored by passport-local-mongoose)
```

> Password is **never stored in plaintext**. `passport-local-mongoose` uses **pbkdf2** with a random salt.

### Relationships

```
User  1──────*  Listing    (owner)
User  1──────*  Review     (author)
Listing *──────*  Review   (embedded array of ObjectIds)
Listing 1──────*  Booking  (embedded array in Listing document)
```

**Cascading Delete:** A Mongoose `post("findOneAndDelete")` hook on the Listing schema automatically deletes all linked reviews when a listing is removed.

---

## 📁 Project Structure

```
Wanderlust/
├── app.js                    # Entry point — Express app setup, middleware, DB connection
├── middleware.js             # Auth guards, ownership checks, Joi validation middleware
├── schema.js                 # Joi validation schemas for Listing and Review
│
├── models/
│   ├── listing.js            # Mongoose Listing schema (with GeoJSON, bookings, categories)
│   ├── review.js             # Mongoose Review schema
│   └── user.js               # Mongoose User schema (passport-local-mongoose plugin)
│
├── controllers/
│   ├── listings.js           # CRUD logic + geocoding + date-availability filtering
│   ├── reviews.js            # Create + delete review logic
│   └── users.js              # Register, login, logout logic
│
├── routes/
│   ├── listing.js            # /listings routes (RESTful)
│   ├── review.js             # /listings/:id/reviews routes (nested)
│   └── user.js               # /signup, /login, /logout routes
│
├── cloudinary/
│   └── index.js              # Cloudinary config + multer-storage-cloudinary setup
│
├── middleware/
│   ├── cache.js              # HTTP Cache-Control headers middleware
│   └── logger.js             # Request logger
│
├── utils/
│   ├── ExpressError.js       # Custom error class (message + statusCode)
│   ├── wrapAsync.js          # Async error wrapper (replaces try/catch in controllers)
│   ├── cache.js              # node-cache instance + cacheMiddleware factory
│   └── geocoding.js          # (Reserved for future geocoding utilities)
│
├── public/
│   ├── css/
│   │   ├── style.css         # Global styles
│   │   ├── rating.css        # Star rating component styles
│   │   ├── components/       # Component-level CSS
│   │   └── pages/            # Page-level CSS
│   └── js/
│       ├── map.js            # TomTom map initialization for listing detail
│       ├── script.js         # Bootstrap form validation
│       ├── navbar.js         # Navbar scroll behavior
│       ├── categoryScroll.js # Horizontal category scroll
│       └── taxSwitch.js      # Price/tax toggle switch
│
└── views/
    ├── layouts/
    │   └── boilerplate.ejs   # Base HTML layout (EJS-Mate)
    ├── includes/
    │   ├── navbar.ejs         # Navigation bar partial
    │   ├── footer.ejs         # Footer partial
    │   └── flash.ejs          # Flash message partial
    ├── listings/
    │   ├── index.ejs          # Browse all listings
    │   ├── show.ejs           # Listing detail + map + reviews
    │   ├── new.ejs            # Create listing form
    │   └── edit.ejs           # Edit listing form
    ├── users/
    │   ├── login.ejs          # Login form
    │   └── signup.ejs         # Registration form
    └── error.ejs              # Generic error page
```

---

## 📌 API Routes

### Listings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/listings` | Public | Browse all listings; supports `?category`, `?location`, `?checkin`, `?checkout`, `?guests` query params |
| `GET` | `/listings/new` | 🔒 Login | Render create listing form |
| `POST` | `/listings` | 🔒 Login | Create a new listing (with image upload + geocoding) |
| `GET` | `/listings/:id` | Public | View listing detail, map, and reviews |
| `GET` | `/listings/:id/edit` | 🔒 Owner | Render edit form |
| `PUT` | `/listings/:id` | 🔒 Owner | Update listing data and/or image |
| `DELETE` | `/listings/:id` | 🔒 Owner | Delete listing + cascade-delete reviews |

### Reviews

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/listings/:id/reviews` | 🔒 Login | Create a review for a listing |
| `DELETE` | `/listings/:id/reviews/:reviewId` | 🔒 Author | Delete a specific review |

### Users / Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/signup` | Public | Render registration form |
| `POST` | `/signup` | Public | Register new user + auto-login |
| `GET` | `/login` | Public | Render login form |
| `POST` | `/login` | Public | Authenticate and establish session |
| `GET` | `/logout` | 🔒 Login | Destroy session and redirect |

> **Query Parameters for `/listings`:**
> - `category` — exact match against 24 enum values
> - `location` — case-insensitive regex matched against `title` or `location` fields
> - `checkin` / `checkout` — ISO date strings; listings with overlapping bookings are excluded
> - `guests` — integer; filters listings with `maxGuests >= guests`

---

## 🔐 Security Implementation

| Concern | Implementation |
|---|---|
| **Password storage** | `passport-local-mongoose` uses **PBKDF2** with a random per-user salt — no plaintext passwords |
| **Session security** | Sessions signed with `SECRET`, stored encrypted in MongoDB, `httpOnly: true` cookie flag |
| **Ownership enforcement** | `isOwner` middleware verifies `listing.owner === currentUser._id` server-side before edit/delete |
| **Review authorship** | `isReviewAuthor` middleware verifies `review.author === currentUser._id` before delete |
| **Input validation** | All form inputs validated with **Joi** schemas server-side before hitting the database |
| **Auth guard** | `isLoggedIn` middleware redirects unauthenticated users; stores intended URL in session for post-login redirect |
| **CORS** | Restricted to `ALLOWED_ORIGIN` in production; open in development |
| **File upload** | `multer` limits file type/size; files go directly to Cloudinary (not stored on disk) |
| **XSS** | EJS auto-escapes output by default (`<%= %>` syntax) |
| **returnTo redirect** | After login, user is redirected back to the page they originally tried to visit |

---

## ⚡ Performance Optimizations

| Optimization | How It's Done |
|---|---|
| **Gzip compression** | `compression` middleware compresses all HTTP responses |
| **In-memory caching** | `node-cache` caches GET responses for unauthenticated users (TTL: 10 min) — skips DB on repeated requests |
| **Static asset caching** | `express.static` serves `/public` with `max-age: 1 week` + ETag headers |
| **Cache-Control headers** | `middleware/cache.js` sets appropriate HTTP cache headers per route type |
| **MongoDB connection pool** | `maxPoolSize: 10`, `minPoolSize: 2` — avoids cold-start connection overhead |
| **Session lazy update** | `touchAfter: 24 * 3600` — sessions only written to DB once per 24h if unchanged |
| **Cloudinary CDN** | Images served from Cloudinary's global CDN with transformation support |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>=16.0.0`
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/atlas))
- **Cloudinary** account ([free tier](https://cloudinary.com))
- **TomTom** Developer account for API key ([free](https://developer.tomtom.com))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/workwithom/wanderlust.git
cd wanderlust
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
# MongoDB Atlas
ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Session secret (any long random string)
SECRET=your-long-random-session-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# TomTom Maps & Geocoding
MAP_TOKEN=your_tomtom_api_key

# Server
PORT=8080
NODE_ENV=development

# Production only
ALLOWED_ORIGIN=https://your-domain.com
```

**4. Start the server**

```bash
# Production
npm start

# Development (auto-restart with nodemon)
npm run dev
```

**5. Open in browser**

Visit [http://localhost:8080](http://localhost:8080) — you will be redirected to `/listings`.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ATLASDB_URL` | ✅ | Full MongoDB Atlas connection string |
| `SECRET` | ✅ | Session cookie signing secret |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_SECRET` | ✅ | Cloudinary API secret |
| `MAP_TOKEN` | ✅ | TomTom API key (maps + geocoding) |
| `PORT` | ❌ | Server port (default: `8080`) |
| `NODE_ENV` | ❌ | `development` or `production` (default: `development`) |
| `ALLOWED_ORIGIN` | ❌ | Allowed CORS origin in production mode |

---

## ⚠️ Known Limitations

These are honest trade-offs made during development — common interview talking points:

1. **No real-time availability calendar UI** — Date filtering works in search results, but individual listing pages don't show a visual calendar of booked dates. Users must rely on search filters.

2. **No payment integration** — The booking system stores dates and guest info but has no payment gateway (Stripe, Razorpay, etc.). Bookings are stored without financial transactions.

3. **Single image per listing** — The schema stores one `{ url, filename }` object per listing. Multiple photo uploads per listing are not currently supported.

4. **In-memory cache is not distributed** — `node-cache` stores cached responses in process memory. If you run multiple server instances (e.g., cluster mode or horizontal scaling), caches will be independent per instance. A shared cache like **Redis** would be needed for distributed setups.

5. **No pagination on listings** — The `/listings` page loads all matching results at once. With a large dataset, this will cause performance issues. Cursor-based or offset pagination is needed.

6. **No email verification** — Users can register with any email string without verification. A token-based email confirmation step is absent.

7. **Sessions not HTTPS-secured in dev** — `cookie.secure: false` is hardcoded. In production, this should be set based on `NODE_ENV` and served over HTTPS only.

8. **No rate limiting** — There is no protection against brute-force login attacks or API abuse. `express-rate-limit` should be added in production.

9. **No image cleanup on update** — When a listing's image is replaced, the old Cloudinary image is not deleted, leading to orphaned files in the Cloudinary account.

10. **TomTom Geocoding failures are silent** — If geocoding fails (bad location string or API error), the listing is saved without coordinates. The map on the detail page will not render correctly in this case.

11. **`@supabase/supabase-js` is installed but unused** — The package exists as a dependency but is not integrated. Intended for a future migration or secondary data store experiment.

12. **No test suite** — There are no unit tests, integration tests, or end-to-end tests. This is a significant gap for production readiness.

---

## 🔭 Future Scope & Potential Features

### Short-Term (Next Sprint)

- [ ] **Pagination** — Add cursor-based or offset pagination for `/listings` to handle large datasets.
- [ ] **Multiple image uploads** — Refactor the `image` field to an array and allow up to 5 photos per listing.
- [ ] **Cloudinary image cleanup** — Delete the old image from Cloudinary when a listing photo is replaced.
- [ ] **Rate limiting** — Add `express-rate-limit` on auth routes to prevent brute-force attacks.
- [ ] **HTTPS-only cookies in production** — Make `cookie.secure` conditional on `NODE_ENV`.
- [ ] **Input sanitization** — Add `express-mongo-sanitize` to prevent NoSQL injection.
- [ ] **Helmet.js** — Add security headers (CSP, HSTS, X-Frame-Options, etc.).

### Medium-Term

- [ ] **Payment Gateway** — Integrate **Stripe** or **Razorpay** for real booking transactions.
- [ ] **Booking Calendar UI** — Visual date-range picker on listing detail page showing availability.
- [ ] **Email notifications** — Booking confirmation and review notifications via **Nodemailer** + SMTP.
- [ ] **Email verification** — Token-based email confirmation on signup.
- [ ] **User profile page** — Show user's listings, bookings, and reviews on a dedicated profile.
- [ ] **Google OAuth** — Add `passport-google-oauth20` for one-click Google sign-in.
- [ ] **Redis caching** — Replace `node-cache` with **Redis** (`ioredis`) for distributed, scalable caching.
- [ ] **Search autocomplete** — Typeahead suggestions for location search using TomTom's Search API.

### Long-Term / Major Features

- [ ] **REST API + React frontend** — Decouple backend into a proper REST API and migrate frontend to **React + React Query** or **Next.js** for better interactivity.
- [ ] **Real-time messaging** — Host–guest chat using **Socket.io** for booking inquiries.
- [ ] **Admin dashboard** — Moderation panel to manage flagged listings and reviews.
- [ ] **Wishlist / Saved Listings** — Let users bookmark listings to a personal saved list.
- [ ] **Pricing calendar** — Dynamic pricing per date range set by the host.
- [ ] **Review analytics** — Aggregate star ratings, average score per listing, and review sentiment analysis.
- [ ] **Map cluster view** — Cluster map markers when multiple listings are near each other (TomTom clustering API).
- [ ] **PWA support** — Service Worker + manifest for installable offline-capable app.
- [ ] **CI/CD pipeline** — GitHub Actions for automated testing, linting, and deployment.
- [ ] **Docker** — Containerize the app for consistent local and production environments.
- [ ] **Supabase integration** — The `@supabase/supabase-js` dependency is already installed; could be used for real-time features or as a Postgres alternative for relational data (e.g., bookings).

---

## 🎓 Interview Q&A — Design Decisions

**Q: Why did you use MongoDB instead of SQL (PostgreSQL/MySQL)?**
> The listing data is naturally document-oriented with variable fields, embedded bookings, and category arrays. MongoDB's schema flexibility was a good fit. However, for a production system with complex transactions (payments, booking conflicts), a relational DB with ACID guarantees would be preferable — which is why Supabase (Postgres) is installed as a future option.

**Q: How does authentication work in Wanderlust?**
> Passport.js with Local Strategy. `passport-local-mongoose` automatically adds username, salt, and hash fields to the User schema and handles PBKDF2 password hashing. On login, Passport verifies credentials, serializes the user ID into the session, and deserializes it on each subsequent request. Sessions are stored in MongoDB via `connect-mongo`.

**Q: How do you prevent unauthorized users from editing listings?**
> The `isOwner` middleware runs before edit/update/delete routes. It fetches the listing from DB and compares `listing.owner` (ObjectId) to `req.user._id`. If they don't match, it redirects with a flash error. This check happens server-side — it cannot be bypassed by manipulating the frontend.

**Q: How does geocoding work?**
> When a listing is created or updated, the controller calls the TomTom Geocoding REST API with the `location + country` string. The API returns lat/lon, which is stored in the listing as a GeoJSON `{ type: "Point", coordinates: [lon, lat] }` object. On the listing detail page, the JS map reads these coordinates to place a marker.

**Q: What happens if geocoding fails?**
> Currently, the listing is saved without coordinates (a known limitation). The map on the detail page won't render a marker. In a production system, geocoding failure should either block listing creation or trigger a manual location pin fallback.

**Q: How does date-based availability filtering work?**
> The `/listings` route queries MongoDB with category/location/guest filters first. Then, if check-in/check-out dates are provided, it filters the results in JavaScript: a listing is excluded if any of its bookings overlap the requested dates (overlap check: `checkin <= bookingEnd && checkout >= bookingStart`). A limitation is that this filtering happens in-memory after the DB query, which doesn't scale well with large datasets — a proper MongoDB `$nor` aggregation or a separate Bookings collection would be more scalable.

**Q: How is the in-memory cache implemented?**
> `node-cache` stores responses keyed by `req.originalUrl` for 10 minutes. The middleware skips caching for logged-in users (personalized content) and non-GET requests. It intercepts `res.send` to cache the response body before sending it. Limitation: it's per-process and not suitable for multi-instance deployments.

**Q: What is `wrapAsync` and why is it used?**
> It's a higher-order function that wraps async route handlers and forwards any rejected Promise to Express's `next(err)`. Without it, unhandled async errors in Express 4.x would cause silent failures. Express 5.x handles this natively, but the project uses Express 4.x.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

_Built with ❤️ as a full-stack learning project. Every design decision is intentional and documented above._
