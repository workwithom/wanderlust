const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview , isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/reviews");

// Create Review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review
router.delete("/:reviewId",isReviewAuthor ,wrapAsync(reviewController.deleteReview)); 

module.exports = router;
