const express = require("express");
const wrapAsync=require("../utils/wrapAsync.js"); 
const router = express.Router();
const {isLoggedin} = require("../middleware.js");
const {isOwned} =  require("../middleware.js");
const {schemavalidate} =require("../middleware.js");
const {listingController}=require("../controller/listing.js");
const multer  = require('multer')
const {cloudinary,storage} = require("../cloudConfig.js");
const upload = multer({ storage });    



//   index route 
// post  route 
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin ,   schemavalidate, upload.single("listing[image]") ,   wrapAsync(listingController.postListing));

    

//  new route 
router.get("/new" ,isLoggedin ,listingController.renderNewForm)
 
// show route 
// update route
// delete route 




// .put(isLoggedin , isOwned ,upload.single("image") ,  schemavalidate  , wrapAsync(listingController.updateListing))



router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin   ,upload.single("image") ,isOwned ,  schemavalidate  , wrapAsync(listingController.updateListing))
.delete(isLoggedin  ,isOwned ,   wrapAsync(listingController.deleteListing))



// edit route 

router.get("/:id/edit" , isLoggedin , wrapAsync(listingController.editListing))


module.exports = router; 


