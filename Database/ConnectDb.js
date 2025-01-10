import mongoose from "mongoose"


async function connectDB() {
    // const localDbUrl = "mongodb://localhost:27017/Wellcare"
    const mongoDbUrl = process.env.MONGO_DB_URL;
    try {
        await mongoose.connect(mongoDbUrl)
        console.log("DB Connected");
    } catch (error) {
        console.log("Error To Connect",error);
    }
}

export default connectDB