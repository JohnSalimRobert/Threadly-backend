import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI!)
        .then(() => {
            console.log("MongoDB Connected!");
            app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        })
        .catch(err => {
            console.error("MongoDB connection error:", err);
        })
