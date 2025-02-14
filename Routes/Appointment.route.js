import express from 'express';
import { bookAppointment, fetchAppointments } from '../Controller/Appointment.controller.js';

const appointmentRouter = express.Router();

appointmentRouter.route('/bookappointment').post(bookAppointment);
appointmentRouter.route('/getappointments').get(fetchAppointments);



export default appointmentRouter;
