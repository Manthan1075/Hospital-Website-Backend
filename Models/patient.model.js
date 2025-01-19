import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    dob : {

    },
    age :{
        type : Number,

    },
    mobileno : {
        
    },
    address : {

    },
    doctor : {

    },
    department : {

    },
    patientId : {
        type : String,
        required : false
    },
    date : {

    },
    time : {

    },
    reasonOfAppointment : {
        type : String,
        required : false
    },
    fees : {

    },
    feesPaid : {
        type : Boolean,
        required : false
    }


    

});