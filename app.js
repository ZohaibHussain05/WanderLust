const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.get("/testlistening", async(req,res) => {
    let sampleListing = new Listing({
        title: "My new House",
        description: "Beautiful house between the town",
        price: 120000,
        location: "Kotla Arab Ali Khan",
        country: "Pakistan",
    });

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successfuly saved");
})

app.get("/", (req , res) => {
    res.send("Roat is working");
});

app.listen(8080 , () => {
    console.log("server is listening to port 8080");
});