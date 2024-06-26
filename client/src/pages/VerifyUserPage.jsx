import React from "react";
import { useLocation } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { toast } from "react-toastify";
import { useState } from "react";
import SetPasswordModal from "../components/SetPasswordModal";

const VerifyUserPage = () => {
  const path = useLocation();
  const loc = path.pathname.split("/")[2];

  const [msg, setMsg] = useState("Not Verified");
  const [userEmail, setUserEmail] = useState("");

  const [openSetPasswordModal, setOpenSetPasswordModal] = useState(false);

  const verifyYourself = async () => {
    try {
      const res = await newRequest.put(`/auth/verifyuser/${loc}`);
      setMsg(res?.data?.message);
      setUserEmail(res?.data?.email);
      // console.log(res.data);
      toast.success(res?.data?.message);

      setOpenSetPasswordModal(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center h-screen">
      <h2 className="text-3xl">Verify Yourself</h2>
      <button
        className="border p-4 rounded-md hover:bg-black hover:text-white"
        onClick={verifyYourself}
      >
        Verify Yourself
      </button>
      <SetPasswordModal
        userEmail={userEmail}
        openSetPasswordModal={openSetPasswordModal}
        setOpenSetPasswordModal={setOpenSetPasswordModal}
      />
      Verification status: {msg}
    </div>
  );
};

export default VerifyUserPage;
