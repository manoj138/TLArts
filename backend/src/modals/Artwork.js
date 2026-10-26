const  mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true
        },
        slug:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        category:{
            type:String,
            required:true,
        },
        medium:{
            type:String,
            required:true,
        },
        dimensions:{
            type:String,
        },
        year:{
            type:Number,
    
        },
        description:{
            type:String,
        },
        imageUrl:{
            type:String,
            required:true,
        },
        instagramPostUrl:{
            type:String,
        },
        isFeatured:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("ArtWork", artworkSchema); 