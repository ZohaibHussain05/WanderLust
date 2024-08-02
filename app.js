const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

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

// Index Route
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new" , (req , res) => {
    res.render("listings/new.ejs")
});

// Show Route
app.get("/listings/:id" , async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Create Route
app.post("/listings", async(req,res) => {
    // let {title, discription, image, countary ,location } = req.body;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
});

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

app.listen(8080 , () => {
    console.log("server is listening to port 8080");
});