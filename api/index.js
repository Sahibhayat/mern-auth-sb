import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();


mongoose.connect(process.env.MONGDB_URI)
.then(() => {
    console.log('Connected to mongoDB')
})
.catch((err) => {
    console.log(err)
})

const app = express();


app.listen(3000, () => {
    console.log("Server is running on port no! 3000 ")
})

