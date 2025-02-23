import { Appointment } from "../Models/Appointment.model.js";

export const bookAppointment = async (req, res) => {
  try {
    const {
      name,
      mobileno,
      dob,
      gender,
      address,
      services,
      appointmentDate,
      appointmentTime,
      reason,
      paymentMethod,
      fees,
      paymentDetails,
      patientId,
      useremail
    } = req.body;
    
    if (!name || !services || !appointmentDate || !appointmentTime || !fees) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    // Genrate Queue No : 
    const currentDate = new Date(appointmentDate);
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    
    const queueNo = (await Appointment.countDocuments({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      appointmentTime,
    })) + 1; 
    
    
    
    const pendingAppointments = await Appointment.countDocuments({
      AppointmentStatus: "Pending",
      appointmentDate: {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lt: new Date(appointmentDate).setHours(23, 59, 59, 999),
      },
      appointmentTime: appointmentTime,
    });

    console.log("Queue No:", queueNo);
    console.log("Pending Appointments:", pendingAppointments);
    
    
    
    // Token Generation
    const tokenPrefix = ["A", "B", "C", "D", "E", "F", "G"]; 
    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00"];
    
    const timeIndex = timeSlots.indexOf(appointmentTime);
    const token =
      timeIndex !== -1
        ? `${tokenPrefix[timeIndex]}-${queueNo}`
        : `X-${queueNo}`; // If time slot not found, assign X
    
    //Patient ID Genrate 
        
    const dateObj = new Date(appointmentDate);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
    const patientID = `${token}-${formattedDate}-${queueNo}`;
    

    const response = await Appointment.create({
      ...req.body,
      Token : token,
      patientID: patientID, 
      AppointmentStatus: "Pending",
      queueno : queueNo,
      pendingAppointments : pendingAppointments,
    });
    

    res
      .status(201)
      .json({
        success: true,
        message: "Appointment booked successfully",
        data: response,
      });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fetch Appointments   

    export const fetchAppointments = async (req, res) => {
        try {
        const { useremail } = req.query;

        if (!useremail) {
            return res.status(400).json({ success: false, message: "User email is required" });
        }

        console.log("User Email:", useremail);

        const appointmentLists = await Appointment.find({ useremail });

        console.log("Appointments Found:", appointmentLists);

        if (!appointmentLists || appointmentLists.length === 0) {
            return res.status(404).json({ success: false, message: "No appointments found" });
        }

        return res.status(200).json({ success: true, appointmentLists });

        } catch (err) {
        console.error("Error fetching appointments:", err);
        return res.status(500).json({ success: false, message: "Error fetching appointments" });
        }
    };

    // Cancel Appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { patientID } = req.params;

    if (!patientID) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(patientID);

    if (!deletedAppointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error cancelling appointment" });
  }
};

  
