import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if any required fields are missing or empty
    if (
      !username ||
      !email ||
      !password ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Email Already Exist"));
    }
    // Check if the username is already in use
    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return next(errorHandler(400, "Username is already exist"));
    }
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Return success message
    res.json({ message: "Signup successful" });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

// sign in Page Functionality //

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid email or Password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '3650d' }
  );
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(validUser);
  } catch (error) {
    next(error);
  }
};

//Google Authentication Api //

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '3650d' }
    );
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({ success: true, user });
    } else {
      const generateRandomPassword = () =>
        "google" + Math.floor(Math.random() * 10000); // function
      const newUserName =
        name.split(" ").join("") + Math.floor(Math.random() * 10000);

      const hashedPassword = bcryptjs.hashSync(generateRandomPassword(), 10);

      const newUser = new User({
        username: newUserName,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '3650d' }
    );

      // if i send in the headers for authentication then simply send it as a token in response //

      res
        .status(200)
        .cookie("access_token", token)
        .json({ success: true, user: newUser });
    }
  } catch (error) {
    next(error);
  }
};
// Forget password rest by verification by email otp method
// export const forgetPassword=async(req,res)=>{

// }
