import dotenv from "dotenv";
import express from "express";
import connectDB from "./Database/ConnectDb.js";
import userRoute from "./Routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import sendOtp from "./sendOtp.js";
import { jwtMiddleware } from "./utils/Tokens.js";
import appointmentRouter from "./Routes/Appointment.route.js";

dotenv.config();    
7
if (!process.env.SECRET_KEY_JWT) {
    console.error('SECRET_KEY_JWT is not defined in environment variables');
    process.exit(1);
}

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5147"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));


app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', userRoute);
app.use('/api/v2/appointment',appointmentRouter);

app.use('/api/v1/user/profile', jwtMiddleware, (req, res) => {
    res.status(200).json({ message: 'Profile route accessed successfully!' });
});


app.post("/sendotp", sendOtp); 

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });

});

app.listen(port, () => {
    console.log('Server running on port:', port);
});

