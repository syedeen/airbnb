const Review = require("../model/review.js");
const Listing = require("../model/listings.js");


module.exports.reviewController = {
       NewReview:async(req,res)=>{

        let listing =  await Listing.findById(req.params.id);
        let newreview = new Review(req.body.review);
        newreview.author=req.user._id;
        listing.reviews.push(newreview);
        await newreview.save();
        await listing.save();
        req.flash("success","review added"); 
       res.redirect(`/listings/${listing._id}`)
    },


     deleteReview:async(req,res)=>{
                
            let {id , reviewId}=req.params;
            await Review.findByIdAndDelete(reviewId);
            await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
            req.flash("success","review deleted"); 
            res.redirect(`/listings/${id}`);
     
        }

}