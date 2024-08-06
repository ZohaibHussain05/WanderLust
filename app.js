const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Index Route
app.get("/listings", wrapAsync(async(req,res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", {allListings});
}));

//New Route
app.get("/listings/new" , (req , res) => {
    res.render("listings/new.ejs")
});

// Show Route
app.get("/listings/:id" , wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Create Route
app.post("/listings", wrapAsync( async(req,res , next) => {
    if(!req.body.listing)
        throw new ExpressError(400 , "Send valid listing data");
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// Update Route
app.put("/listings/:id", wrapAsync(async(req, res) => {
    if(!req.body.listing)
        throw new ExpressError(400 , "Send valid listing data");
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testlistening", async(req,res) => {
//     let sampleListing = new Listing({
//         title: "My new House",
//         description: "Beautiful house between the town",
//         price: 120000,
//         location: "Kotla Arab Ali Khan",
//         country: "Pakistan",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfuly saved");
// });

app.get("/", (req , res) => {
    res.send("Roat is working");
});

app.all("*", (req , res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let{status = 500 , message = "something went wrong"}= err;
    res.status(status).send(message);
})

app.listen(8080 , () => {
    console.log("server is listening to port 8080");
});