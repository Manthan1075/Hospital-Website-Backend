import dotenv from "dotenv";
import express from "express";
import connectDB from "./Database/ConnectDb.js";
import userRoute from "./Routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import sendOtp from "./sendOtp.js";
import { authMiddleware } from "./Middleware/auth.js";

dotenv.config();

if (!process.env.SECRET_KEY_JWT) {
    console.error('SECRET_KEY_JWT is not defined in environment variables');
    process.exit(1);
}

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user/profile', authMiddleware);
app.use('/api/v1/user', userRoute);

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
    console.log('SECRET_KEY_JWT is configured:', !!process.env.SECRET_KEY_JWT);
});
