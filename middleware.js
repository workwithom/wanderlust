const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // Store the current URL in session
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
}

module.exports.savereturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo; // Store the returnTo URL in locals for rendering
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error", "You do not have permission for this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  if (!req.body || !req.body.listing) {
    throw new ExpressError("Missing listing data", 400);
  }
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  if (!req.body || !req.body.review) {
    throw new ExpressError("Missing review data", 400);
  }
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id);
  const review = await Review.findById(reviewId);
  if (!listing || !review) {
    req.flash("error", "Listing or review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if (!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}