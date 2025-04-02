import mongoose from "mongoose";
import { Schema } from "mongoose";

const postSchema = new Schema(
  {
    content: String,
    likes: Number,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
