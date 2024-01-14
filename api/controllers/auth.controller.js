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
      // return res.status(401).json({ message: "Wrong credentials" });
      return next(errorHandler(401, "wrong credentials"))
    }

    const createdUser = await User.findById(validUser._id).select(
      "-password"
    )

    const token = jwt.sign({ id: validUser._id }, process.env.JST_SECRET)
    const expiryDate = new Date(Date.now() + 3600000);
    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200).json(createdUser)

  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id },
        process.env.JST_SECRET);
      const createdUser = await User.findById(user._id).select(
        "-password"
      )
      const expiryDate = new Date(Date.now() + 3600000);
      res.cookie('access_token', token, {
        httpOnly: true,
        expires: expiryDate
      }).status(200)
        .json(createdUser)
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() + 
          Match.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id },process.env.JST_SECRET);
      const createdUser = await User.findById(user._id).select(
        "-password"
      )
      const expiryDate = new Date(Date.now() + 3600000);

      res.cookie('access_token', token, {
        httpOnly: true,
        expires: expiryDate
      }).status(200)
      .json(createdUser)
    }
  } catch (error) {
    next(error)
  }
}

