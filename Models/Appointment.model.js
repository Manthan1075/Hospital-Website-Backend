import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobileno: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    services: [
        {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: String, required: true }
        }
    ],    
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: false
    },
    fees: {
        type: Number,
        required: true
    },
    paymentDetails: {
        type: Object,
        default: { FeesPaid: false }
    },
    paymentMethod: {
        type: String,
        required: false
    },
    patientID: {
        type: String,
        required: false
    },
    useremail: {
        type: String,
        required: true,
    },
    queueno : {
        type: Number,
        required: false
    },
    Token : {
        type: String,
        required: false
    },
    AppointmentStatus : {
        type: String,
        default: "Pending",
        required: false
    },
    pendingAppointments : {
        type : Number,
        required : false
    }
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);