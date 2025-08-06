import mongoose from "mongoose";


const vibezSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
  
    media:{
        type:String,
        required:true
    },
    caption:{
        type:String
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            
        }
    ],
    comment:[
        {
            author:{
                type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            },
            message:{
                type:String
            }
            
            
        }
    ]
},{timestamps:true})

const Vibez= mongoose.model("Vibez",vibezSchema)


export default Vibez;