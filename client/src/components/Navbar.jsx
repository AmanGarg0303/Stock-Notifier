import React, { useEffect, useState } from "react";
import WidgetsIcon from "@mui/icons-material/Widgets";
import LoginModal from "./LoginModal";
import { useSelector, useDispatch } from "react-redux";
import newRequest from "../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { currentUser } = useSelector((user) => user.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleLogout = async () => {
    await newRequest.get("/auth/logout");
    toast("Successfully logged out.");
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <nav className="hidden md:inline-block bg-[color:var(--light-blue)] px-28 lg:px-32 w-full">
        <div className="flex justify-between items-center py-5">
          <div>
            <Link to={"/"} className="flex items-center gap-2">
              <img src={Logo} alt="" className="w-14 h-14 rounded-2xl" />
              <h1 className="text-xl font-medium lg:text-2xl lg:font-semibold">
                Stock Notifier
              </h1>
            </Link>
          </div>

          <div>
            <ul className="flex gap-10 lg:gap-20 font-medium text-lg">
              {/* <Link to={"/"}>
                <li className="cursor-pointer">Home</li>
              </Link> */}
              <Link to="/about">
                <li className="cursor-pointer">About</li>
              </Link>

              {!currentUser ? (
                <li
                  className="cursor-pointer"
                  onClick={() => setOpenLoginModal(true)}
                >
                  Signup
                </li>
              ) : (
                <>
                  <Link to={"/dashboard"}>
                    <li className="cursor-pointer font-semibold text-[color:var(--text-black)]">
                      {currentUser?.email} (
                      {currentUser?.isVerified ? "Verified" : "Not Verified"})
                    </li>
                  </Link>
                  <li
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </>
              )}
            </ul>
            <LoginModal
              openLoginModal={openLoginModal}
              setOpenLoginModal={setOpenLoginModal}
            />
          </div>
        </div>
      </nav>

      <nav className="md:hidden bg-[color:var(--light-blue)] px-10 sm:px-14 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium">Stock Notifier</h1>
          </div>

          <WidgetsIcon fontSize="large" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
