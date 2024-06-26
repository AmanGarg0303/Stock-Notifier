import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="h-[90vh] md:h-[85vh] lg:h-[87vh] bg-[color:var(--light-blue)]">
        <div className="flex px-10 sm:px-14 md:px-28 lg:px-32 py-5 text-lg font-semibold">
          <Link to="/">Home</Link>&nbsp; / About
        </div>

        <div className="px-10 md:px-28 lg:px-32 bg-[color:var(--light-blue)] pb-10">
          <div>
            <p className="font-semibold text-xl pt-5 pb-2 underline">
              Abstract
            </p>

            <p className="text-lg tracking-wider">
              The idea was to make a{" "}
              <span className="uppercase font-semibold">
                Stock price notifier
              </span>{" "}
              website which will send an email to the user whenever the stock
              price raises up than the mentioned value set by user.
            </p>

            <p className="font-semibold text-xl pt-5 pb-2 underline">
              Technologies Used
            </p>

            <p className="text-lg tracking-wider">
              ReactJS, TailwindCSS, NodeJS, Nodemailer(for emails),
              Puppeteer(for data scraping), ExpressJS, MongoDb, Razorpay(for
              payments and subscriptions)
            </p>

            <p className="font-semibold text-xl pt-5 pb-2 underline">Working</p>

            <p className="text-lg tracking-wider">
              In the{" "}
              <span className="uppercase font-semibold">Stock Notifier,</span>{" "}
              we are registering the user with their valid email id, as user has
              to verify their email id to make an account at{" "}
              <span className="uppercase font-semibold">Stock Notifier.</span>
              &nbsp;Then user will set a stock name and the high price which he
              wanted to be notified when the stock price reached that value.
            </p>

            <p className="text-lg tracking-wider">
              We are giving free trial of 30 days to the user, after that it is
              a subscription based model. A user will be charged &#x20B9;299
              rupees every month if he want stock emails.
            </p>

            <p className="font-semibold text-xl pt-5 pb-2 underline">
              Internal Working
            </p>

            <p className="text-lg tracking-wider">
              We are scraping the stock prices from the{" "}
              <span className="font-semibold">
                <a href="https://groww.in/" target="_blank" rel="noreferrer">
                  groww.in{" "}
                </a>
              </span>
              website, the scraping function will run every 10 minutes to get
              the latest stock price. If the stock price is greater than the
              value set by the user, then an email will be sent to him. When the
              30 day free trial period is over, user has to subscribe to the
              paid plan to get the stock emails, also user can cancel his
              subscription anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
