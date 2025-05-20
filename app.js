
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

const flash = require("connect-flash");
const User  = require("./models/user"); // Import User model

const passport = require("passport");
const LocalStrategy = require("passport-local") // Import LocalStrategy


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl, // MongoDB connection URL 
  crypto: {
    secret: "mysupersecretcode", // Secret for encrypting session data
  },
  touchAfter: 24 * 60 * 60, // Time in seconds to wait before updating session data
});
store.on("error", function (e) {
  console.log("Session store error", e); // Log any errors with the session store
});

const sessionOptions = { 
  store,
  secret:"mysupersecretcode",
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
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Error connecting to DB:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
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
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
