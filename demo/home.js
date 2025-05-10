

const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");
const app = express(); 
const flash = require('connect-flash');
const path = require("path");


app.set("view engine " , "ejs ");
app.set("views" , path.join(__dirname , "views"));



// app.use(cookieParser("secretcode"));


// app.get("/getcookies", (req,res)=>{
//      res.cookie("gender", "male");
//      res.cookie("woman", "female" , {signed:true});
//      res.send('welcome to welcome')
// })


// app.get("/", (req,res)=>{
//     res.send('welcome to welcome')
// })



// app.get("/print",(req,res)=>{
//     console.dir(req.cookies);
//     console.dir(req.signedCookies);
// })


const sessionOptions = {
    secret:"nyx" ,
     resave:false , 
     saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(flash());


app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name=name;
    req.flash( "access" , "user registered successfully");
    res.redirect("/welcome");
})

app.get("/welcome",(req,res)=>{
    res.locals.msg =  req.flash("access") ;
    res.render("demo.ejs" , {name:req.session.name });
})



app.get("/key",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1; 
    }
    
    res.send(`no of requests ${req.session.count}`);
})




app.listen(5000,()=>{
    console.log("welcome to welcome")
})


