import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : false,
        minlength: 6,
    },
    mobileno : {
        type : String,
        required : false,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    city : {
        type : String,
        required : false,
        default: ""
    },
    dob : {
        type : String,
        required : false,
        default: ""
    },
    gender : {
        type : String,
        enum : ["Male", "Female", "Other",""],
        required : false,
        default : ""
    }
}, {timestamps : true})

export const User = mongoose.model('User', userSchema)
