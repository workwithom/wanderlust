const mongoose = require("mongoose");
const sampleListings = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); 

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const main = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    
    await Listing.deleteMany({}); // Clear existing listings
    
    // Get a sample owner user
    const sampleUser = await User.findOne();
    if (!sampleUser) {
      console.log("No users found in the database. Please create a user first.");
      return;
    }

    // Process the sample listings to add the owner
    const listingsToInsert = sampleListings.data.map((listing) => ({
      ...listing,
      owner: sampleUser._id
    }));
  
    // Insert the listings
    await Listing.insertMany(listingsToInsert);
    console.log("Sample listings initialized successfully!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
};

main();