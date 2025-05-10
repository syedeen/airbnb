
const Listing = require("./model/listings.js");
const Review = require("./model/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLoggedin=("/login",(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
});



module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    
    }
    next();
}

  
module.exports.isOwned = async(req,res,next)=>{
        let {id}=req.params;
         let newlisting=req.body.listing;
         const listing = await Listing.findById(id);
          if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error","you dont have access to this account"); 
            return  res.redirect(`/listings/${id}`); 
          }
          next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
       
     let {id,reviewId}=req.params;
            let review = await Review.findById(reviewId);
            if(!review.author._id.equals(res.locals.currUser._id)){
                req.flash("error","you dont have access to this account"); 
                return  res.redirect(`/listings/${id}`); 
            }
      next();
}


// validatelisting

module.exports.schemavalidate = ((req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
})

// validateReview

module.exports.validatereview = ((req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
})




