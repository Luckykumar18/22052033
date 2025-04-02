import mongoose, { SchemaTypes } from "mongoose";
import {Schema} from "mongoose";
import User from "./user.js";
import Post from "./post.js"


const commentSchema = new Schema({
    content : String,
    post : {
        type:Schema.Types.ObjectId,
        ref : "Post"
    },
    user :{
        type : Schema.Types.ObjectId,
        ref :"User"
    }
});


const Comment = mongoose.model("Comment",commentSchema);

export default Comment;