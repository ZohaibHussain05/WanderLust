const mongoose = require("mongoose");
const Review = require("./review");
const Schemma = mongoose.Schema;

const listingSchema = new Schemma({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D",
        set:(v) => v=== "" ? "https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D":v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {  
            type: Schemma.Types.ObjectId,
            ref: "Review",
        },
    ]
});

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing)
        await Review.deleteMany({ _id: {$in: listing.reviews}});
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;