import mongoose from "mongoose";


const messsageSchema= mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index: true
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index: true
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