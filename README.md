# Wanderlust – Travel & Stay Rental Platform

A full-stack web application for discovering and renting unique accommodations around the world. Similar to Airbnb, Wanderlust lets users browse listings, book stays, leave reviews, and host their own properties with interactive maps and real-time search filters.

---

## ✨ Features

- **Browse & Search Listings** – Filter by category, location, check-in/checkout dates, and number of guests
- **Interactive Maps** – View each listing’s location on an interactive map powered by TomTom
- **User Authentication** – Secure signup, login, and logout with Passport.js
- **Create & Manage Listings** – Hosts can add, edit, and delete their properties
- **Image Upload** – Cloudinary integration for property photos
- **Reviews & Ratings** – Users can leave reviews (1–5 stars) and comments
- **Booking System** – Date-based availability and guest management
- **Responsive UI** – EJS-based views with a clean, user-friendly interface
- **Performance** – Response caching, compression, and optimized database queries

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (Atlas) |
| **ORM** | Mongoose |
| **View Engine** | EJS (with EJS-Mate) |
| **Authentication** | Passport.js (Local Strategy) |
| **File Storage** | Cloudinary |
| **Maps** | TomTom Web SDK |
| **Sessions** | express-session + connect-mongo |
| **Caching** | node-cache |

---

## 📁 Project Structure

```
major project/
├── app.js              # Application entry point
├── cloudinary/
│   └── index.js        # Cloudinary config & storage
├── controllers/
│   ├── listings.js     # Listing business logic
│   ├── reviews.js      # Review logic
│   └── users.js        # Auth logic
├── middleware.js       # Auth, validation, ownership checks
├── middleware/
│   ├── app.js
│   ├── cache.js        # Cache headers
│   └── logger.js
├── models/
│   ├── listing.js      # Listing schema
│   ├── review.js       # Review schema
│   └── user.js         # User schema
├── public/             # Static assets (CSS, JS, images)
├── routes/
│   ├── listing.js      # Listing routes
│   ├── review.js       # Review routes (nested under listings)
│   └── user.js         # Auth routes
├── utils/
│   ├── ExpressError.js
│   ├── cache.js        # In-memory cache middleware
│   └── wrapAsync.js
└── views/              # EJS templates
    ├── listings/       # Index, show, new, edit
    ├── users/          # Login, signup
    └── error.ejs
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16 or higher
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account
- **TomTom** API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/workwithom/wanderlust.git
   cd wanderlust
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root with:

   ```env
   # MongoDB
   ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

   # Session
   SECRET=your-session-secret-key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret

   # TomTom Maps
   MAP_TOKEN=your_tomtom_api_key

   # Production (optional)
   PORT=8080
   NODE_ENV=development
   ALLOWED_ORIGIN=https://your-domain.com
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

5. **Open in browser**

   Visit [http://localhost:8080](http://localhost:8080). You’ll be redirected to `/listings`.

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `ATLASDB_URL` | MongoDB Atlas connection string |
| `SECRET` | Secret for signing session cookies |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `MAP_TOKEN` | TomTom API key for maps & geocoding |
| `PORT` | Server port (default: 8080) |
| `NODE_ENV` | `development` or `production` |
| `ALLOWED_ORIGIN` | Allowed CORS origin in production |

---

## 📌 Main Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/listings` | Browse listings (supports query filters) |
| GET | `/listings/new` | Create new listing (requires auth) |
| POST | `/listings` | Create listing (requires auth) |
| GET | `/listings/:id` | View listing details |
| GET | `/listings/:id/edit` | Edit listing form (owner only) |
| PUT | `/listings/:id` | Update listing (owner only) |
| DELETE | `/listings/:id` | Delete listing (owner only) |
| POST | `/listings/:id/reviews` | Add review (requires auth) |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review (author only) |
| GET | `/signup` | Signup form |
| POST | `/signup` | Register user |
| GET | `/login` | Login form |
| POST | `/login` | Log in |
| GET | `/logout` | Log out |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome. Feel free to open issues and submit pull requests.
