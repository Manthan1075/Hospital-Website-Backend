import express from 'express';
import { bookAppointment } from '../Controller/Appointment.controller.js';

const appointmentRouter = express.Router();

appointmentRouter.route('/').post(bookAppointment);


export default appointmentRouter;
