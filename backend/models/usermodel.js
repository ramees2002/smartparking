const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({


    Name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
     password:{
        type:String,
        required:true
    },
     phone:{
        type:Number,
        required:true
    },
     vehicleNumber:{
        type:String,
        default:""
    },
     vehicleType:{
        type:String,
        enum:["car","bike","truck"],
        default:"car"
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
    

})
const User= mongoose.model("User",userSchema);
module.exports = User;