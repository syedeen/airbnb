   const express = require("express");
   const router = express.Router();
   const wrapAsync=require("../utils/wrapAsync.js"); 
   const passport = require("passport");
   const { saveRedirectUrl } = require("../middleware.js");
   const {userController} = require("../controller/user.js");
   
   router.route("/signup")
   .get( userController.renderSignUpForm)
   .post(wrapAsync(userController.SignUp));
      
   router.route("/login")
   .get(userController.renderLoginForm)
   .post(saveRedirectUrl  , passport.authenticate("local" , {failureRedirect:"/login" , failureFlash:true })   ,userController.login)
       
     
    
   router.get("/logout" , userController.logout);
      
   module.exports=router;

   