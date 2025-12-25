import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const DBConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecom-collab");
        console.log("----DB Connected Successfully----", conn.connection.host);
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

export default DBConnect;