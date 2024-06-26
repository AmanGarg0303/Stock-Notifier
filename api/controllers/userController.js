import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import puppeteer from "puppeteer";
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";
import Payment from "../models/payment.js";

/*            TODO


-> function which will check 30 days of the user
-> after 30 days, automaticlly turns off emailAlerts and provide them offer of a paid model




-> take more than 1 stock values, 
APPROACH
-> make an array of objects and take stockName, highValue, emailTime ......then map over it.

-> send mail for every stock
-> make a payment model, free for only 30 days
-> if user changes stock price or stockName, set emailTime to currentTime
-> if the stock name and price is not selected, email alerts can't be turned on
-> customize register email and sell your stock now email
*/

//
// update email alert option
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user?.freeTrial < Date.now()) {
    res.status(400);
    throw new Error("Free trial period is over!");
  } else {
    if (user) {
      const { emailAlerts } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $set: { emailAlerts },
        },
        { new: true }
      );

      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } else {
      res.status(404);
      throw new Error("User not found!");
    }
  }
});

// update user preferred stock data
export const updateUserPreferredStockData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { stockVals, highPrice } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { stockVals, highPrice, emailTime: Date.now() },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

// users list with email alerts turned on, sending them mail
export const getUsersWithEmailALerts = asyncHandler(async (req, res) => {
  const users = await User.find({
    emailAlerts: true,
    isVerified: true,
    emailTime: { $lt: Date.now() },
  });

  console.log("Users: ", users.length);
  if (users.length === 0) {
    return;
  }

  users?.map(async (user) => {
    const x = await scrapStockPriceFromGrow(user?.stockVals?.value);

    if (x >= user?.highPrice) {
      console.log(`Price of ${user?.stockVals?.label} is ${x}`);
      console.log(`Hey, ${user?.email} you should sell your stock!`);
      console.log(" ");

      const message = `
        <h2>Hello ${user?.email}</h2>
        <p>Current price of ${user?.stockVals?.label} is ₹${x}</p>
        <p>The price has reached the desired threshold value that you mentioned.</p>
      `;

      const send_to = user?.email;
      const sent_from = process.env.EMAIL_USER;
      const subject = "Sell your STOCK now";

      try {
        await sendEmail(subject, message, send_to, sent_from);
        console.log("Email Sent.");

        await User.findByIdAndUpdate(
          user._id,
          {
            $set: { emailTime: Date.now() + 1000 * 60 * 60 * 24 },
          },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(`Price of ${user?.stockVals?.label} is ${x}`);
      console.log(`Hey, ${user?.email} you should not sell your stock!`);
      console.log(" ");
    }
  });
});

/*
//  MAIN SELECTORS LOGIC

const a = document.querySelectorAll('span.lpu38Pri.fs28:not(.hiddenTicker)[style*="visibility"]')
let results = []
for (let i = 0; i < a.length; i++) {
    // console.log(a[i].textContent)
    results.push(a[i].textContent)
}
console.log(results)
*/

async function scrapStockPriceFromGrow(stName) {
  const browser = await puppeteer.launch({ headless: "new", devtools: true });
  const page = await browser.newPage();
  const results = [];
  try {
    await page.goto(`https://groww.in/stocks/${stName}`, {
      waitUntil: "domcontentloaded",
    });

    const items = await page.$$(
      'span.lpu38Pri.fs28:not(.hiddenTicker)[style*="visibility"]'
    );

    for (let i = 0; i < items.length; i++) {
      try {
        const units = await page.evaluate(
          (el) => el.textContent,
          (
            await page.$$(
              'span.lpu38Pri.fs28:not(.hiddenTicker)[style*="visibility"]'
            )
          )[i]
        );

        // console.log("units: ", units);
        results.push(units);
      } catch (e) {
        console.error(e);
      }
    }

    // console.log(results);
    await browser.close();

    const value = results
      .map((r) => parseInt(r))
      .reduce((accumulator, currentValue) => accumulator * 10 + currentValue);

    const finalPrice = value / 100;
    console.log(finalPrice);

    return finalPrice;
  } catch (e) {
    console.log(e);
    await browser.close();
  }
}

// scrape price with input
async function scrapStockPriceFromGrowWithInput() {
  const browser = await puppeteer.launch({ headless: "new", devtools: true });
  const page = await browser.newPage();
  const results = [];
  try {
    await page.goto("https://groww.in/", {
      waitUntil: "domcontentloaded",
    });

    await page.focus("#globalSearch23");
    page.keyboard.type("Ambuja Cements Ltd.");

    const resVal = await page.waitForSelector("#globalSearch23-suggestions");
    console.log("res: ", resVal);

    const items = await page.$$(
      'span.lpu38Pri.fs28:not(.hiddenTicker)[style*="visibility"]'
    );

    for (let i = 0; i < items.length; i++) {
      try {
        const units = await page.evaluate(
          (el) => el.textContent,
          (
            await page.$$(
              'span.lpu38Pri.fs28:not(.hiddenTicker)[style*="visibility"]'
            )
          )[i]
        );

        // console.log("units: ", units);
        results.push(units);
      } catch (e) {
        console.error(e);
      }
    }

    console.log(results);
    await browser.close();
  } catch (e) {
    console.log(e);
    await browser.close();
  }
}

cron.schedule("*/2 * * * *", async () => {
  console.log("Cron is working");
  console.log(" ");
  getUsersWithEmailALerts();
  // await scrapStockPriceFromGrow();
  // await scrapStockPriceFromGrowWithInput();
});

/////////////////////////////////////////////////////////////////////////////////////////

// scraping price from NSE
async function scrapStockPrice(stName) {
  const browser = await puppeteer.launch({ headless: "new", devtools: true });
  const page = await browser.newPage();
  await page.goto(
    `https://www.nseindia.com/get-quotes/equity?symbol=${stName}`,
    { waitUntil: "domcontentloaded" }
  );
  // await page.waitForSelector("#quoteLtp");
  await page.evaluate(() => document.querySelector("#quoteLtp").innerText);
  var x = await page.$eval("#quoteLtp", (e) => e.innerText);
  browser.close();

  return x;
}
/////////////////////////////////////////////////////////////////////////////////////////

export const getSubId = asyncHandler(async (req, res) => {
  const id = req.params.paymentId;

  try {
    const paymnt = await Payment.findOne({ razorpay_payment_id: id });
    res.status(200).json({ subId: paymnt.razorpay_subscription_id });
  } catch (error) {
    res.status(400);
    throw new Error("Subscription id not found.");
  }
});

/*

chck for free trial
active ====>  free trail date + 30 days < today's date
inactive ==>  free trail date + 30 days > today's date

*/

async function disableEmailAlerts() {
  const users = await User.find({
    emailAlerts: true,
    isVerified: true,
    freeTrial: { $gt: Date.now() },
  });

  // users whose free trial is expired
  if (users.length === 0) {
    return;
  }

  users?.map(async (user) => {
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: { emailAlerts: false },
      },
      { new: true }
    );
  });
}

cron.schedule("*/30 * * * *", async () => {
  console.log("Cron is working for disabling email alerts.");
  disableEmailAlerts();
});
