import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import HeroImg from "../assets/heroImg.png";
import LoginModal from "./LoginModal";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const { currentUser } = useSelector((user) => user.user);

  return (
    <div className="bg-[color:var(--light-blue)] px-10 md:px-28 lg:px-32 h-fit md:h-[74vh]">
      {/* <div className="grid place-items-center md:flex md:justify-around h-full py-10"> */}
      <div className="flex flex-col items-center md:flex-row md:justify-around h-full py-10">
        <div className="flex flex-col gap-5 lg:gap-8">
          <div className="text-[color:var(--text-black)]">
            <h1 className="text-4xl lg:text-6xl font-bold">
              Collecting profit
            </h1>
            <h2 className="text-4xl lg:text-6xl font-bold">in easy way.</h2>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 lg:text-lg">
              <DoneIcon />
              <p>Easy and simple to use for beginners.</p>
            </div>
            <div className="flex items-center gap-2 lg:text-lg">
              <DoneIcon />
              <p>Stock emails that makes you champ.</p>
            </div>
            <div className="flex items-center gap-2 lg:text-lg">
              <DoneIcon />
              <p>Everything works for you.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="space-x-3">
              {!currentUser ? (
                <button
                  onClick={() => setOpenLoginModal(true)}
                  className="px-4 py-2 bg-[color:var(--text-black)] hover:scale-105 transition-all duration-200 rounded-lg text-[color:var(--light-blue)] font-medium"
                >
                  Try for free
                </button>
              ) : (
                <Link to="/dashboard">
                  <button className="px-4 py-2 bg-[color:var(--text-black)] hover:scale-105 transition-all duration-200 rounded-lg text-[color:var(--light-blue)] font-medium">
                    Dashboard
                  </button>
                </Link>
              )}
              <LoginModal
                openLoginModal={openLoginModal}
                setOpenLoginModal={setOpenLoginModal}
              />
              <Link to="/about">
                <button className="px-4 py-2 border border-[color:var(--text-black)] hover:scale-105 transition-all duration-200 rounded-lg font-medium">
                  How it works
                </button>
              </Link>
            </div>

            <div>
              <p className="text-[color:var(--text-black)]">
                *Free 30 days trial. No obligations.
              </p>
            </div>
          </div>
        </div>

        <div>
          <img
            src={HeroImg}
            className="object-cover w-72 h-72 lg:w-auto lg:h-auto"
            alt="trading img"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
