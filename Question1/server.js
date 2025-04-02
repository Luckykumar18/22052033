import express from "express";
const app=express();
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import cookieParser from "cookie-parser";

// Connect to MongoDB
connectDB();

// Middleware

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/posts",postRoutes);


app.listen(3000,()=>{
    console.log("Your server is running")
})