import mongoose from "mongoose";


const conversationSchema=mongoose.Schema({
    paticipants:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        index: true
    },
    messages:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        }
    ]
},{timestamps:true})

const Conversation=mongoose.model("Conversation",conversationSchema);



export default Conversation;