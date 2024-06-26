import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { loginFailure, loginSuccess, loginStart } from "../redux/userSlice";
import { toast } from "react-toastify";

const LoginModal = ({ openLoginModal, setOpenLoginModal }) => {
  const theme = useMantineTheme();
  const [active, setActive] = useState(0);

  return (
    <Modal
      overlaycolor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayopacity={0.55}
      overlayblur={3}
      overflow="inside"
      centered
      opened={openLoginModal}
      onClose={() => setOpenLoginModal(false)}
      withCloseButton={false}
      size="md"
      transition="fade"
      transitionduration={500}
      transitiontimingfunction="ease"
      padding="0"
    >
      <div className="p-8">
        <div
          className="absolute top-2 right-2 cursor-pointer flex flex-col items-center"
          onClick={() => setOpenLoginModal(false)}
        >
          <HighlightOffIcon className=" text-3xl text-red-500" />
        </div>

        <div className="flex tex-xl font-medium justify-around">
          <button
            onClick={() => setActive(0)}
            className={`border w-full rounded-l-md py-2 ${
              active === 0 && "bg-blue-300 border-2 border-black"
            } `}
          >
            Login
          </button>
          <button
            onClick={() => setActive(1)}
            className={`border w-full rounded-r-md py-2 ${
              active === 1 && "bg-blue-300 border-2 border-black"
            }`}
          >
            Signup
          </button>
        </div>

        <div className="">{active === 0 ? <Login /> : <Signup />}</div>
      </div>
    </Modal>
  );
};

export default LoginModal;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showUserPassword = (e) => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await newRequest.post("/auth/login", { email, password });
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
      // console.log(res.data);
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message);
      dispatch(loginFailure());
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 mt-5">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="email" className="text-[color:var(--text-black)]">
            Email
          </label>

          <div className="flex items-center gap-3 border rounded-md px-2">
            <EmailOutlinedIcon />
            <input
              type="email"
              id="email"
              required
              autoFocus
              placeholder="your email"
              className="w-full px-2 py-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="password" className="text-[color:var(--text-black)]">
            Password
          </label>

          <div className="flex items-center gap-3 border rounded-md px-2">
            <LockOutlinedIcon />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder="your password"
              autoComplete="off"
              className="w-full px-2 py-1 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <VisibilityIcon onClick={showUserPassword} />
            ) : (
              <VisibilityOffIcon onClick={showUserPassword} />
            )}
          </div>
        </div>

        <button className="border border-black rounded-md py-1 text-lg font-medium">
          Login
        </button>
      </div>
    </form>
  );
};

const Signup = () => {
  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await newRequest.post("/auth/takeUserEmail", {
        email,
      });
      // console.log(res.data);
      toast.success(res?.data?.message);
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 mt-5">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="email" className="text-[color:var(--text-black)]">
            Email
          </label>

          <div className="flex items-center gap-3 border rounded-md px-2">
            <EmailOutlinedIcon />
            <input
              type="email"
              id="email"
              required
              autoFocus
              placeholder="your email"
              className="w-full px-2 py-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <button className="border border-black rounded-md py-1 text-lg font-medium mt-5">
          Create Account
        </button>
      </div>
    </form>
  );
};
