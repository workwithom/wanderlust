if (process.env.NODE_ENV !== "production") {
  // If not in production, load environment variables from .env file
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const cors = require("cors");
const ExpressError = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const session= require("express-session");
const MongoStore = require("connect-mongo");
const compression = require('compression');
const setCacheHeaders = require('./middleware/cache');
const { cacheMiddleware } = require('./utils/cache');

const flash = require("connect-flash");
const User  = require("./models/user"); // Import User model

const passport = require("passport");
const LocalStrategy = require("passport-local") // Import LocalStrategy


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

// Optimize MongoDB connection options
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4 // Use IPv4, skip trying IPv6
};

const store = MongoStore.create({
  mongoUrl: dbUrl, // MongoDB connection URL 
  crypto: {
    secret: process.env.SECRET , // Secret for encrypting session data
  },
  touchAfter: 24 * 60 * 60, // Time in seconds to wait before updating session data
});
store.on("error", function (e) {
  console.error("Session store error:", e.message);
});

const sessionOptions = { 
  store,
  secret: process.env.SECRET, // Secret for signing the session ID cookie
  resave: false,
  saveUninitialized:true,
  cookie: { 
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 day
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false, // Set to true if using HTTPS
  },
  };


 

main()
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Connected to DB");
    }
  })
  .catch((err) => console.error("Error connecting to DB:", err));

async function main() {
  await mongoose.connect(dbUrl, mongooseOptions);
}

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware
app.use(compression());
app.use(setCacheHeaders);

// Serve static files with caching
app.use(express.static(path.join(__dirname, "/public"), {
  maxAge: '1w', // Cache for 1 week
  etag: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride("_method"));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN : '*',
  credentials: true
}));
app.use(cookieParser("secretcode")); // Use cookie-parser middleware

// Routes
app.get("/", (req, res) => {
  res.redirect("/listings"); // Redirect to listings page
});

// session and flash setup
app.use(session(sessionOptions)); // Use express-session middleware
app.use(flash()); // Use connect-flash middleware

// Passport.js setup
app.use(passport.initialize()); // Initialize Passport.js
app.use(passport.session()); // Use Passport.js session management
passport.use(new LocalStrategy(User.authenticate())); // Use LocalStrategy for authentication
passport.serializeUser(User.serializeUser()); // Serialize user
passport.deserializeUser(User.deserializeUser()); // Deserialize user



//locals middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Make flash messages available in response locals
  res.locals.error = req.flash("error"); // Make flash messages available in response locals
  res.locals.currentUser = req.user; // Make current user available in response locals
  next(); // Call the next middleware function
});
//routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/",userRoutes);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { message: err.message, err });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server is listening on port ${PORT}`);
  }
});
