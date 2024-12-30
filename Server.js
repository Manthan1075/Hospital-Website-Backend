import dotenv from "dotenv"
import express from "express"
import connectDB from "./Database/ConnectDb.js";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

connectDB();

app.listen(port,()=>{
    console.log('PORT',port);
})