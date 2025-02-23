import express from 'express';
import { bookAppointment, cancelAppointment, fetchAppointments } from '../Controller/Appointment.controller.js';

const appointmentRouter = express.Router();

appointmentRouter.route('/bookappointment').post(bookAppointment);
appointmentRouter.route('/getappointments').get(fetchAppointments);
appointmentRouter.route('/cancel/:patientID').delete(cancelAppointment);





export default appointmentRouter;
