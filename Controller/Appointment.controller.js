import { Appointment } from "../Models/Appointment.model.js";

export const bookAppointment = async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { name, mobileno, dob, gender, address, services, appointmentDate, appointmentTime, reason, paymentMethod, fees } = req.body;

        // const paymentDetails = req.body.paymentDetails || { FeesPaid: false };

        if (!name || !services || !appointmentDate || !appointmentTime || !fees) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        const response = await Appointment.create({
            ...req.body,
        });

        res.status(201).json({ success: true, message: "Appointment booked successfully", data: response });

    } catch (err) {
        console.error("Error booking appointment:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

