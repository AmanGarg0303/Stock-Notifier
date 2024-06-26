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
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";

const SetPasswordModal = ({
  userEmail,
  openSetPasswordModal,
  setOpenSetPasswordModal,
}) => {
  const theme = useMantineTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const showUserPassword = (e) => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    if (password === confirmPass) {
      try {
        const res = await newRequest.post("/auth/setPassword", {
          email: userEmail,
          password,
        });
        dispatch(loginSuccess(res.data));
        navigate("/");
        // console.log(res.data);
      } catch (error) {
        console.log(error);
        toast(error?.response?.data?.message);
        dispatch(loginFailure());
      }
    } else {
      // console.log("Passoword doesn't matched!");
      toast("Password doesn't matched!");
    }
  };

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
      opened={openSetPasswordModal}
      onClose={() => setOpenSetPasswordModal(false)}
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
          onClick={() => setOpenSetPasswordModal(false)}
        >
          <HighlightOffIcon className=" text-3xl text-red-500" />
        </div>

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
                  value={userEmail}
                  defaultValue={userEmail}
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="password"
                className="text-[color:var(--text-black)]"
              >
                Password
              </label>

              <div className="flex items-center gap-3 border rounded-md px-2">
                <LockOutlinedIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  autoComplete="off"
                  placeholder="your password"
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

            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="confirmPass"
                className="text-[color:var(--text-black)]"
              >
                Confirm Password
              </label>

              <div className="flex items-center gap-3 border rounded-md px-2">
                <EnhancedEncryptionOutlinedIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPass"
                  required
                  autoComplete="off"
                  placeholder="confirm password"
                  className="w-full px-2 py-1 outline-none"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
                {showPassword ? (
                  <VisibilityIcon onClick={showUserPassword} />
                ) : (
                  <VisibilityOffIcon onClick={showUserPassword} />
                )}
              </div>
            </div>

            <button className="border border-black rounded-md py-1 text-lg font-medium">
              Save Password
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SetPasswordModal;
