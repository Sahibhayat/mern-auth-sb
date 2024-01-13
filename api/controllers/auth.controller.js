import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        } else {

            const hashedPassword =  bcryptjs.hashSync(password, 10);

            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: "User created successfully" })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}