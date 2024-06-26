import User from "../models/user.js";
// import { instance } from "../server.js";
import crypto from "crypto";
import Payment from "../models/payment.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";

export const buySubscription = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { planId } = req.body;
  if (!planId) {
    res.status(400);
    throw new Error("Plan id not found!");
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  const subscription = await instance.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    // customer_id: user?._id,
    total_count: 12,
  });

  // console.log("Subscription: ", subscription);

  user.subscription.id = subscription.id;

  user.subscription.status = subscription.status;

  await user.save();

  res.status(201).json({
    success: true,
    subscriptionId: subscription.id,
  });
});

export const paymentVerification = asyncHandler(async (req, res) => {
  const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } =
    req.body;

  // console.log("SubId:", razorpay_subscription_id);
  // console.log("Payme:", razorpay_payment_id);
  // console.log("Signa:", razorpay_signature);

  const user = await User.findById(req.user._id);

  const subscription_id = user.subscription.id;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
    .digest("hex");

  const isAuthentic = generated_signature === razorpay_signature;

  if (!isAuthentic)
    return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

  await Payment.create({
    razorpay_signature,
    razorpay_payment_id,
    razorpay_subscription_id,
  });

  user.subscription.status = "active";

  await user.save();

  res.redirect(
    `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
  );
});

export const getRazorPayKey = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_API_KEY,
  });
});

// fetch a plan by using subscription id
export const fetchSubscription = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  try {
    const sub = await instance.subscriptions.fetch(user?.subscription?.id);

    const planId = sub?.plan_id;

    const plan = await instance.plans.fetch(planId);

    res.status(200).json({ sub, plan });
  } catch (error) {
    res.status(400);
    throw new Error("Subscription not found.");
  }
});

// cancel a plan
export const cancelSubscription = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  const subscriptionId = user.subscription.id;
  // let refund = false;

  const options = { cancel_at_cycle_end: 1 };

  console.log("hello");

  // await instance.subscriptions.cancel(subscriptionId);
  const can = await instance.subscriptions.cancel(subscriptionId, options);
  console.log("Can: ", can);

  user.subscription.id = undefined;
  user.subscription.status = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Subscription cancelled, Your subscription will end soon.",
    can,
  });
});
