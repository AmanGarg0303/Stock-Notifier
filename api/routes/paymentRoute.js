import express from "express";
import { protect } from "../middlewares/jwt.js";
import {
  buySubscription,
  cancelSubscription,
  fetchSubscription,
  getRazorPayKey,
  paymentVerification,
} from "../controllers/paymentController.js";

const router = express.Router();

// Buy Subscription
// router.route("/subscribe").get(isAuthenticated, buySubscription);
router.post("/subscribe", protect, buySubscription);

// Verify Payment and save reference in database
// router.route("/paymentverification").post(isAuthenticated, paymentVerification);
router.post("/paymentverification", protect, paymentVerification);

//fetch subscription
router.get("/fetchSub", protect, fetchSubscription);

// Get Razorpay key
// router.route("/razorpaykey").get(getRazorPayKey);
router.get("/razorpaykey", protect, getRazorPayKey);

// Cancel Subscription
// router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);
router.post("/subscribe/cancel", protect, cancelSubscription);

export default router;
