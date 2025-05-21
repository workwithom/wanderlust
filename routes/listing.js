const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudinary/index")
const upload = multer({ storage });
const { cacheMiddleware } = require('../utils/cache');


router.route("/")
.get(cacheMiddleware(300), wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.createListing)
);

// New form
router.get("/new",
  isLoggedIn,
  listingController.renderNewForm);


router.route("/:id")
.get(cacheMiddleware(300), wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('image'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));


router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;
