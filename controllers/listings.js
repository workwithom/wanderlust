const Listing = require("../models/listing");
const fetch = require('node-fetch');
const API_KEY = process.env.MAP_TOKEN;

// Helper function to get coordinates from location using TomTom REST API
async function getCoordinates(location) {
  try {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://api.tomtom.com/search/2/geocode/${encodedLocation}.json?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const { lat, lon } = data.results[0].position;
      return [lon, lat]; // Note: MongoDB uses [longitude, latitude] format
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

module.exports.index = async (req, res) => {
  const { category, location, checkin, checkout, guests } = req.query;
  let query = {};
  
  // Add category filter if provided
  if (category) {
    query.category = category;
  }
  
  // Add location filter if provided
  if (location && location !== 'undefined') {
    // Use case-insensitive regex to match location in title or location field
    const locationRegex = new RegExp(location, 'i');
    query.$or = [
      { title: locationRegex },
      { location: locationRegex }
    ];
  }
  
  // Add guests filter if provided and is a valid number
  if (guests && guests !== 'undefined') {
    const guestsNum = parseInt(guests);
    if (!isNaN(guestsNum) && guestsNum > 0) {
      query.maxGuests = { $gte: guestsNum };
    }
  }
  
  // Get listings matching the query
  const allListings = await Listing.find(query);
  
  // Filter by availability if dates are provided and valid
  let filteredListings = allListings;
  if (checkin && checkout && checkin !== 'undefined' && checkout !== 'undefined') {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    
    if (!isNaN(checkinDate) && !isNaN(checkoutDate)) {
      filteredListings = allListings.filter(listing => {
        // Check if the listing is available for the requested dates
        return !listing.bookings || !listing.bookings.some(booking => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);
          return (checkinDate <= bookingEnd && checkoutDate >= bookingStart);
        });
      });
    }
  }
  
  res.render("listings/index", { 
    allListings: filteredListings, 
    category,
    searchParams: { 
      location: location !== 'undefined' ? location : '',
      checkin: checkin !== 'undefined' ? checkin : '',
      checkout: checkout !== 'undefined' ? checkout : '',
      guests: guests !== 'undefined' ? guests : ''
    }
  });
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
      .populate({path:"reviews",
         populate: { path: "author" }}) // Populate the reviews and their authors
      .populate("owner"); // Populate the owner field
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    // Get coordinates for the location
    const coordinates = await getCoordinates(req.body.listing.location + ', ' + req.body.listing.country);
    if (coordinates) {
      newListing.geometry = {
        type: 'Point',
        coordinates: coordinates
      };
    }
    
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    } else {
      // Set default image if no file was uploaded
      newListing.image = {
        url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157",
        filename: "Default"
      };
    }
    
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Error creating listing: " + error.message);
    res.redirect("/listings/new");
  }
}
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  // Get the current image URL for display
  const originalImageUrl = listing.image.url;
  res.render("listings/edit", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body.listing) {
      throw new ExpressError("Invalid Listing Data", 400);
    }
      // Update basic listing information first
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Update the listing with new data
    listing.set({ ...req.body.listing });
    
    // Update coordinates if location changed
    if (req.body.listing.location || req.body.listing.country) {
      const coordinates = await getCoordinates(req.body.listing.location + ', ' + req.body.listing.country);
      if (coordinates) {
        listing.geometry = {
          type: 'Point',
          coordinates: coordinates
        };
      }
    }
    
    // If a new image was uploaded, update the image
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // Save all changes
    await listing.save();
   
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Error updating listing");
    res.redirect(`/listings/${id}/edit`);
  }
}

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}