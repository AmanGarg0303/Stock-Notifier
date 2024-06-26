import express from "express";
import {
  getSubId,
  getUsersWithEmailALerts,
  updateUser,
  updateUserPreferredStockData,
} from "../controllers/userController.js";
const router = express.Router();
import { protect } from "../middlewares/jwt.js";

// update email alerts
router.put("/updateUser", protect, updateUser);

// update user preferred stock data
router.put("/updateStockData", protect, updateUserPreferredStockData);

router.get("/", getUsersWithEmailALerts);

router.get("/getSubId/:paymentId", getSubId);

export default router;
