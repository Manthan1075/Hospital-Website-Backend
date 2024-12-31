import mongoose from "mongoose"


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("DB Connected");
    } catch (error) {
        console.log("Error To Connect",error);
    }
}

export default connectDB