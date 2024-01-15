import express from "express"
import { Router } from "express"
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const userRouter = Router();


userRouter.get('/', test)
userRouter.post("/update/:id", verifyToken, updateUser);

export default userRouter