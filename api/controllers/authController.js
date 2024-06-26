import bcrypt from "bcrypt";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Token from "../models/token.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

//Generate a jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//
// set a new password and create new user
export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    res.status(400);
    throw new Error("Please fill all the fields!");
  }

  if (password.length < 5) {
    res.status(400);
    throw new Error("Password must be atleast 5 characters long.");
  }

  const userEmail = await User.findOne({ email });
  if (userEmail) {
    res.status(400);
    throw new Error("This email already exists.");
  }

  const user = await User.create({
    email,
    password,
  });

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP - only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { password, ...info } = user._doc;
    res.status(201).json(info);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user api
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);

  if (isPasswordCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      secure: true,
      sameSite: "none",
    });
  }

  if (user && isPasswordCorrect) {
    const { password, ...info } = user._doc;

    res.status(200).json(info);
  } else {
    res.status(500);
    throw new Error("Invalid credentials!");
  }
});

//
// check user login status
export const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  } else {
    return false;
  }
});

//
// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Successfully logged out." });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// register a new user and sending him email for verifying
export const registerUserWithEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user has filled all the things
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields.");
  }

  //checking the password length
  if (password.length < 5) {
    res.status(400);
    throw new Error("Password should be atleast 5 characters.");
  }

  // check if email already exists
  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    res.status(400);
    throw new Error("Email already exists.");
  }

  // creating a user
  const user = await User.create({
    email,
    password,
  });

  // Generating a token
  const token = generateToken(user._id);

  // sending cookie also
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "none",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    secure: false,
  });

  //sending an email to verify user
  // /////////////////////////////////////////////////////////////////////////////////////////
  let verifyToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(verifyToken);

  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  await Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 1 day
  }).save();

  const verifyUrl = `${process.env.FRONTEND_URL}/verifyuser/${verifyToken}`;

  const message = `
  <h2>Hello user</h2>
  <p>Please verify your email, so that you could access our website fully</p>
  <p>The link below is valid for only next 1 day.</p>

  <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
  `;

  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const subject = "Verifying your account on Stock Notifier";

  // /////////////////////////////////////////////////////////////////////////////////////////
  if (user) {
    try {
      await sendEmail(subject, message, send_to, sent_from);
    } catch (error) {
      res.status(500);
      throw new Error("Email not sent, please try again.");
    }

    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
      success: true,
      message: "Verify user email sent.",
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password.");
  }
});

// verifying the user
export const userVerification = asyncHandler(async (req, res) => {
  const { verifyToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  // find token in db
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Token is invalid or expired.");
  }

  const user = await User.findOne({ _id: userToken.userId });

  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: "User verified successfully." });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const takeUserEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // check if user has filled all the things
  if (!email) {
    res.status(400);
    throw new Error("Please fill the email.");
  }

  // check if email already exists
  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    res.status(400);
    throw new Error("Email already exists.");
  }

  // creating a user
  const user = await User.create({
    email,
  });

  //sending an email to verify user
  // /////////////////////////////////////////////////////////////////////////////////////////
  let verifyToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(verifyToken);

  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  await Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 1 day
  }).save();

  const verifyUrl = `${process.env.FRONTEND_URL}/verifyuser/${verifyToken}`;

  const message = `
  <h2>Hello ${user?.email || "user"}</h2>
  <p>Please verify your email, so that you could access our website fully</p>
  <p>The link below is valid for only next 1 day.</p>

  <a href=${verifyUrl} clicktracking=off>
  <button>Click here</button>
  </a>
  `;

  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const subject = "Verify your account on Stock Notifier";

  // /////////////////////////////////////////////////////////////////////////////////////////
  if (user) {
    try {
      await sendEmail(subject, message, send_to, sent_from);
    } catch (error) {
      res.status(500);
      throw new Error("Email not sent, please try again.");
    }

    const { _id, email } = user;
    res.status(201).json({
      _id,
      email,
      success: true,
      message: `Email has been sent to ${email}, Please verify yourself.`,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password.");
  }
});

// verifying the user
export const validateEmail = asyncHandler(async (req, res) => {
  const { verifyToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  // find token in db
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Token is invalid or expired.");
  }

  const user = await User.findOne({ _id: userToken?.userId });

  user.isVerified = true;
  await user.save();

  res
    .status(200)
    .json({ email: user?.email, message: "User verified successfully." });
});

// verifying the user
export const setPasswordAfterValidation = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  } else {
    if (!user?.isVerified) {
      res.status(400);
      throw new Error("User is not verified!.");
    } else {
      user.password = req.body.password;
      user.freeTrial = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
      await user.save();

      // Generate Token
      const token = generateToken(user._id);

      // Send HTTP - only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        sameSite: "none",
        secure: true,
      });

      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    }
  }
});
