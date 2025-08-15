import mongoose from "mongoose";


const messsageSchema= mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }, 
    message:{
        type:String,
        
    },
    image:{
        type:String,
    }
},{timestamps:true})

const Message=mongoose.model("Message",messsageSchema);

export default Message;