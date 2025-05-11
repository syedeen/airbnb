if(process.env.NODE_ENV != "PRODUCTION"){
    require('dotenv').config()
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); 
const app = express();
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Joi = require('joi');
const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const wrapAsync=require("./utils/wrapAsync.js"); 
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./model/user.js");
const passport = require("passport");
const localstrategy=require("passport-local");
const MongoStore = require('connect-mongo');

app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const dburl = process.env.ATLASDB_PASS;

const store = MongoStore.create({ mongoUrl: dburl 
    ,crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})


store.on("error" , (err)=>{
      console.log("error in mongo session store" , err);
})

const sessionOptions = {
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized: true,
        cookie:{
            expires:Date.now()*7*24*60*1000,
            maxAge:7*24*60*1000,
            httpOnly: true
        }
}






main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

async function main() {
    await mongoose.connect(dburl);
}




// app.get("/la", async (req, res) => {
//     try {
//         const data = new Listing({
//             title: "Cozy Beachfront Cottage",
//             description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//             price: 1500,
//             location: "Malibu",
//             country: "United States",
//         });
        
//         await data.save();
//         res.send("Listing created successfully!");
//     } catch (err) {
//         console.error("Error saving listing:", err);
//         res.status(500).send("Error creating listing: " + err.message);
//     }
// });

   


app.use(flash());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error"); 
    res.locals.currUser=req.user; 
    next();
});





app.use("/listings", listingsRouter);   
app.use("/listings/:id/reviews", reviewsRouter);   
app.use("/", userRouter);   

 
 
 
// app.get("/",(req,res)=>{
//     res.render("listings/root.ejs");
//  })
 


 






// * error 


app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})




// error middleware

app.use((err,req,res,next)=>{
    let{status=500,message}=err;
    res.status(status).render("listings/error.ejs" , {err}) ;
})



const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Server running on port 8000");
});

