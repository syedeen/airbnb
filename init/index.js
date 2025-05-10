const mongoose = require("mongoose");
const Listing = require("../model/listings.js");
const data = require("./data.js");


main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}


async function initDB(){
    await Listing.deleteMany({});
    data.data=data.data.map((obj)=>({...obj  , owner:"6806f89e7e242115d9af492e"}))
    await Listing.insertMany(data.data);
}



initDB();



