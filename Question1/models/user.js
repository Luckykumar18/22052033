import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema({
    username : String,
    email : String,
    posts:[
        {
            type: Schema.Types.ObjectId,
            ref:"Post"
        }
    ]
});

const User = mongoose.model("User", userSchema);

export default User;