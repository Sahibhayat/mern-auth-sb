import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" })

    } catch (error) {
        next(errorHandler(300, "Somthing went wrong"));
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return req.status(404).json({ message: "User not found" })
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        const createdUser = await User.findById(validUser._id).select(
            "-password"
        )
        
        const token = jwt.sign({ id: validUser._id }, process.env.JST_SECRET)
        const expiryDate = new Date(Date.now() + 3600000); 
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200).json(createdUser)

    } catch (error) {

    }
}