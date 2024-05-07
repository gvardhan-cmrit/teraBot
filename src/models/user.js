import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)

const userSchema = mongoose.Schema({
    tgId : {
        type: String,
        required : true,
        unique: true 
    },
    userName : {
        type: String,
        required : true,
        unique: true 
    },
    firstName : String,
    lastName: String,

}, {timestamps : true});


export default mongoose.model("user", userSchema)