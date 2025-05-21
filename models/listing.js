const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required :true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price:Number,
    location:String,
    country:String,
    maxGuests: {
        type: Number,
        required: true,
        default: 1
    },
    bookings: [{
        startDate: Date,
        endDate: Date,
        guest: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    category: {
        type: String,
        enum: [
            'rooms', 'beach', 'mountain', 'village', 'city', 'camping', 
            'arctic', 'desert', 'countryside', 'lakefront', 'amazing-pools',
            'camper-vans', 'castles', 'containers', 'design', 'earth-homes',
            'farms', 'national-parks', 'vineyards', 'omg', 'tiny-homes',
            'towers', 'windmills', 'luxe'
        ],
        required: true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})
 listingSchema.post("findOneAndDelete", async function (listing) {     if (listing.reviews.length) {
         await Review.deleteMany({ _id: { $in: listing.reviews } });
     }
 });
const Listing = mongoose.model("listing",listingSchema);
module.exports = Listing;