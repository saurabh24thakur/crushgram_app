import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        
    },
    profession:{
        type:String,
        
    },
    follower:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"User"

        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            
        }
    ],
    savedPost:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            
        }
    ],
    vibez:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Vibez",
            
        }

    ],
    story:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Story",
        
    },
    resetOtp:{
        type:String
    },
    otpExpires:{
        type:Date
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    bio:{
        type:String
    },
    gender:{
        type:String,
        enum:["Male","Female"]
    }

    

},{timestamps:true})




const User=mongoose.model("User",userSchema)

export default User;