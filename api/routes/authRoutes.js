import express from "express";
import {
  loginStatus,
  loginUser,
  logoutUser,
  registerUser,
  registerUserWithEmail,
  setPasswordAfterValidation,
  takeUserEmail,
  userVerification,
  validateEmail,
} from "../controllers/authController.js";
const router = express.Router();

// registering a user and veryfying its email
// router.post("/registerWithEmail", registerUserWithEmail);
// router.put("/verifyuser/:verifyToken", userVerification);

router.post("/takeUserEmail", takeUserEmail);
router.put("/verifyuser/:verifyToken", validateEmail);
router.post("/setPassword", setPasswordAfterValidation);

// registering a new user
// router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/loginstatus", loginStatus);

router.get("/logout", logoutUser);

export default router;
