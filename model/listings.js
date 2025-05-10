const mongoose=require("mongoose");
const Review = require("./review.js");
const { string } = require("joi");
const { Schema } = mongoose;





const listingSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    }
    ,
      image:{
          filename:String,
          url:String,
      }
         
    ,
    price:{
        type:Number,
        min:0
        
    },
    location:{
        type:String
    },
    country:{
        type:String
    },

    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",


         }],
         
           owner:{
               type:Schema.Types.ObjectId,
               ref:"User",
           }
          ,  
        geometry:{
                type: {
                  type: String, 
                  enum: ['Point'], 
                  required: true
                },
                coordinates: {
                  type: [Number],
                  required: true
                }
        }
        })
        
     



 listingSchema.post("findOneAndDelete" , async(listing)=>{
        if(listing){
            await Review.deleteMany({_id:{$in:listing.reviews}});
        }
 })



const Listing = new mongoose.model("Listing",listingSchema);


module.exports=Listing;



