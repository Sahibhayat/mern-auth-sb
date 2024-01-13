import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

dotenv.config();


mongoose.connect(process.env.MONGDB_URI)
.then(() => {
    console.log('Connected to mongoDB')
})
.catch((err) => {
    console.log(err)
})

const app = express();

app.use(express.json());
app.use(cors({origin: "*", credentials: true}));


app.listen(3000, () => {
    console.log("Server is running on port no! 3000 ")
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.message || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
})

