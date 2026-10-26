const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    },
    contact:{
        type:String,
        required:true,
         trim:true,
    },
   size:{
    type:Number,
    },
    sketchType:{
        type:String,
        required:true,
    },
    message:{
        type:String,
    },
    referencePhotoUrl:{
        type:String,
    },
    status:{
        type:String,
        enum:["pending","completed","in-progress"],
        default:"pending",
    }
},
{
    timestamps:true,
});

module.exports = mongoose.model("Inquery", inquirySchema);