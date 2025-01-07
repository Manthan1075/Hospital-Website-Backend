import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    age :{
        type : Number,
        required : true,
    },
});