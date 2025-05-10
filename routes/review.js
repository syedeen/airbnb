const express = require("express");
const wrapAsync=require("../utils/wrapAsync.js"); 
const router = express.Router({mergeParams:true});
const {validatereview} = require("../middleware.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedin} = require("../middleware.js");
const {isReviewAuthor} = require("../middleware.js");
const {reviewController} = require("../controller/review.js");





// add reviews 

router.post("/", isLoggedin,    validatereview ,wrapAsync(reviewController.NewReview));

// delete reviews 

router.delete("/:reviewId" , isReviewAuthor  ,isLoggedin,wrapAsync(reviewController.deleteReview))



   module.exports = router ; 