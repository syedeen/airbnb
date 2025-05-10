 
const Listing = require("../model/listings.js");
                                                             
 module.exports.listingController={
     

    //  index controller  
    index : async (req,res)=>{
    const allListings = await Listing.find({});  
    res.render("listings/index.ejs",{allListings})
    },
    

    // new route 
    renderNewForm:(req,res)=>{
        res.render("listings/new.ejs");

    },
    
    

    //   show controller 
    showListing:async(req,res)=>{
       
        let {id}=req.params;
    
        const data = await Listing.findById(id)
        .populate({
            path:"reviews",populate:{
         path:"author",
        },
    }).populate("owner");
        if(!data){
            req.flash("error","listing does not exist! ");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs",{data});

    },

     
       
        // post controller 
        postListing:async(req,res)=>{
            let newlisting= req.body.listing;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${newlisting.location},${newlisting.country}&format=json`, {
                headers: {
                  'User-Agent': 'airbnb (syedmoinudeen65@email.com)'
                }
              });
            
              const data = await response.json();
              const geoPoint = {
                type: 'Point',
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
              };
        let url= req.file.path;
        let filename = req.file.filename;
        const allListings = await new Listing(newlisting)
        allListings.owner=req.user._id;
        allListings.image={url,filename};
        allListings.geometry=geoPoint;
        await allListings.save();
        req.flash("success","new listing created successfully");
        res.redirect("/listings");
     },
       
         
        // edit controller  

        editListing:async (req,res)=>{
            let {id}=req.params;
            const data = await Listing.findById(id);
            if(!data){
                req.flash("error","listing does not exist! ");
                return res.redirect("/listings");
            }
            
            let originalImage =  data.image.url;
            originalImage=originalImage.replace("/upload","/upload/h_150,w_250")
            res.render("listings/edit.ejs",{data , originalImage});
        },

       
        // update controller 

        updateListing:async(req,res)=>{
                      let {id}=req.params;
                 const country= req.body.listing.country;
                 const location= req.body.listing.location;
                  
               const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${location},${country}&format=json`, {
                headers: {
                  'User-Agent': 'airbnb (syedmoinudeen65@email.com)'
                }
              });
            
              const data = await response.json();
              const geoPoint = {
                type: 'Point',
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
              };
              

             await  Listing.findByIdAndUpdate(id,{ $set: {
                              geometry: geoPoint
                                                }})
            const allListings = await  Listing.findByIdAndUpdate(id,{ ...req.body.listing });

    
            if( req.file) {
                let url= req.file.path;
                let filename = req.file.filename; 
                allListings.image = {url,filename}; 
                await allListings.save();
            }
            req.flash("success","listing updated"); 
            res.redirect(`/listings/${id}`);
        } ,

          
         // delete controller 

        deleteListing:async(req,res)=>{
            let {id} = req.params;
            await Listing.findByIdAndDelete(id);
            req.flash("success","listing deleted");  
            res.redirect("/listings");
        }


}