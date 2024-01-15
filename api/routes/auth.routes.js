import { Router } from "express";
import { google, signin, signout, signup } from "../controllers/auth.controller.js";

const authRouter = Router();   

authRouter.post("/signup", signup)
authRouter.post("/signin", signin)
authRouter.post("/google", google)
authRouter.get("/signout", signout);

export default authRouter;