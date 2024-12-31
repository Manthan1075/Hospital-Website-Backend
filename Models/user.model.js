import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        uniqe: true
    },
    mobileNo : {
        type : Number,
        required : true,
        uniqe: true   
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    }

},{timestamps : true})

export const user = mongoose.model('User', userSchema)
