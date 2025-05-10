const User = require("../model/user.js");
 

module.exports.userController={
    renderSignUpForm:(req,res)=>{
        res.render("users/signup.ejs")
       },
       
       
      SignUp:async(req,res,next)=>{
        try{
          let {username,password,email} = req.body;
          let newuser =  new User({
              email,
              username
          })
 
         const registeredUser= await  User.register(newuser,password);
         req.login(registeredUser , (err)=>{
            if(err){
              return next(err); 
            }
            req.flash("success","registered successfully")
            res.redirect("/listings");
         })
         
        }catch(err){
          req.flash("error" , "username already exists");
          res.redirect("/signup");
        }   
     },

     renderLoginForm:(req,res)=>{
        res.render("users/login.ejs");
       },

    login:(req,res)=>{
        req.flash("success","logged in successfully");
        let redirectUrl = res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);
       },
  


       
    logout:(req,res,next)=>{
        req.logOut((err)=>{
            if(err){
             return next(err);
            }
            req.flash("success","logged out successfully");
            res.redirect("/listings")
            
        })
      }
    


} 
