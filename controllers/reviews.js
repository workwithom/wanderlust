const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) return res.status(404).send("Listing not found");

  const newReview = new Review({
    ...req.body.review,
    rating: Number(req.body.review.rating),
  });
  newReview.author = req.user._id; // Set the author to the logged-in user
  await newReview.save();
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "new review added successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted successfully!");
  res.redirect(`/listings/${id}`);
}