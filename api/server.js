import express from "express";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import mongoose from "mongoose";
import RazorPay from "razorpay";

const app = express();
dotenv.config();

export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// scraping price
/////////////////////////////////////////////////////////////////////////////////////////
let stockName = "ZOMATO";
let url = `https://www.nseindia.com/get-quotes/equity?symbol=${stockName}`;

async function scrapStockPrice() {
  const browser = await puppeteer.launch({ headless: "new", devtools: true });
  // const browser = await puppeteer.launch({ headless: "new", devtools: true,ignoreDefaultArgs: ['--disable-extensions']});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.evaluate(() => document.querySelector("#quoteLtp").innerText);

  var x = await page.$eval("#quoteLtp", (e) => e.innerText);
  console.log("x: ", x);

  // const f = await page.$("[id='quoteLtp']");
  // //obtain text
  // const mytext = await (await f.getProperty("textContent")).jsonValue();
  // console.log("Text is: " + mytext);

  // // stock price
  // const [el] = await page.$x(
  //   "/html/body/div[10]/div/div/section/div/div/div/div[1]/div/div[2]/div/section/div/div/div/aside[1]/div[1]/span[1]"
  // );
  // const text = await el.getProperty("textContent");
  // const stPrice = await text.jsonValue();
  // console.log(stPrice + ` is the price of ${stockName}.`);

  // var productText = await page.waitForSelector("#quoteLtp");
  // var productPrice = await page.evaluate(
  //   (product) => product.textContent,
  //   productText
  // );
  // console.log(productText + ` is the product text of ${stockName}.`);
  // console.log(productPrice + ` is the product price of ${stockName}.`);

  browser.close();
}

//////////////////////////////////////////////////////////////////////////////////////////

// cron.schedule("*/5 * * * *", async () => {
//   console.log("Cron is working");
//   scrapStockPrice();
// });

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);

// error middleware
app.use(errorHandler);

async function scrapeChannel(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url);

  //   stock name
  const [el] = await page.$x(
    '//*[@id="root"]/div[2]/div[2]/div/div/div[1]/div/div/table/tbody/tr[1]/td[1]/a'
  );
  const text = await el.getProperty("textContent");
  const stName = await text.jsonValue();

  // market price
  const [el2] = await page.$x(
    '//*[@id="root"]/div[2]/div[2]/div/div/div[1]/div/div/table/tbody/tr[1]/td[3]/text()'
  );
  const priceSrc = await el2.getProperty("textContent");
  const priceVal = await priceSrc.jsonValue();

  // 52 week low value
  const [el3] = await page.$x(
    '//*[@id="root"]/div[2]/div[2]/div/div/div[1]/div/div/table/tbody/tr[1]/td[4]'
  );
  const lowSrc = await el3.getProperty("textContent");
  const lowVal = await lowSrc.jsonValue();

  // 52 week high value
  const [el4] = await page.$x(
    '//*[@id="root"]/div[2]/div[2]/div/div/div[1]/div/div/table/tbody/tr[1]/td[5]'
  );
  const highSrc = await el4.getProperty("textContent");
  const highVal = await highSrc.jsonValue();

  //stock percentage down by value
  const [el5] = await page.$x(
    '//*[@id="root"]/div[2]/div[2]/div/div/div[1]/div/div/table/tbody/tr[1]/td[3]/div'
  );
  const downBy = await el5.getProperty("textContent");
  const downVal = await downBy.jsonValue();

  let downValMod = downVal.replace(/\(.*?\)/gm, "");
  downValMod = downValMod.replace(/\+/g, "");
  downValMod = downValMod.replace(/\-/g, "");

  let priceValMod = priceVal.replace(/\₹/g, "");
  let pTemp = (downValMod / priceValMod) * 100;
  let percentage = parseFloat(pTemp).toFixed(2);

  if (percentage * 100 < 1000) {
  }

  console.log(percentage);

  var stockApi = {
    stockName: stName,
    currentPrice: priceVal,
    lowPrice: lowVal,
    highPrice: highVal,
    downBy: downVal,
  };

  //   console.log(stockApi);
  browser.close();
}

// scrapeChannel("https://groww.in/markets/top-losers?index=GIDXNIFTY100");

// connect to mongo
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
