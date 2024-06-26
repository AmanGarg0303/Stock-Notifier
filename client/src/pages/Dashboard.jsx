import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Switch } from "@material-tailwind/react";
import { useSelector, useDispatch } from "react-redux";
import newRequest from "../utils/newRequest";
import { updateStart, updateSuccess, updateFailure } from "../redux/userSlice";
import { toast } from "react-toastify";
import { stockData } from "../data/StockData";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Select from "react-select";
import LogoImg from "../assets/logo.png";
import moment from "moment";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useSelector((user) => user.user);
  const dispatch = useDispatch();

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    dispatch(updateStart());

    try {
      const res = await newRequest.put("/users/updateUser", {
        emailAlerts: !currentUser?.emailAlerts,
      });
      dispatch(updateSuccess(res.data));
      toast.success("Data updated.");
      // console.log(res.data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
      dispatch(updateFailure());
    }
  };

  const [highPrice, setHighPrice] = useState(currentUser?.highPrice);
  const [stockVals, setStockVals] = useState({
    label: currentUser?.stockVals?.label,
    value: currentUser?.stockVals?.value,
  });

  const handleUpdateStockData = async (e) => {
    e.preventDefault();
    dispatch(updateStart());

    if (stockVals === null) {
      toast.error("Stock Name can't be empty");
    } else if (highPrice === null) {
      toast.error("High Price can't be empty");
    } else {
      try {
        const res = await newRequest.put("/users/updateStockData", {
          stockVals,
          highPrice,
        });
        dispatch(updateSuccess(res.data));
        toast.success("Stock data updated.");
        // console.log(res.data);
      } catch (error) {
        console.log(error);
        dispatch(updateFailure());
      }
    }
  };

  const handleChange = (selectedOption) => {
    setStockVals(selectedOption);
  };

  const handleChangePlan = async (planId) => {
    try {
      const result = await newRequest.post(`/payment/subscribe`, { planId });
      // console.log("result: ", result);
      const subId = result?.data?.subscriptionId;

      var options = {
        key: "rzp_test_JYCjc5onY1biWm",
        subscription_id: subId,
        name: "Stock Notifier",
        description: "Live Transaction",
        image: { LogoImg },
        callback_url: "http://localhost:5000/api/payment/paymentverification",
        prefill: {
          name: currentUser?.email?.split("@")[0],
          email: currentUser?.email,
          contact: "9599733651",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },

        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  const [cancelling, setCancelling] = useState("Click Here");
  const cancelSub = async () => {
    setCancelling("Cancelling");
    try {
      const res = await newRequest.post("/payment/subscribe/cancel");
      // console.log(res.data);
      dispatch(
        updateSuccess({
          ...currentUser,
          subscription: { id: undefined, status: undefined },
          plan: undefined,
          subStatus: undefined,
        })
      );
      toast.success(res?.data?.message);
      setCancelling("Cancelled");
    } catch (error) {
      setCancelling("Click Here");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserSub = async () => {
      try {
        if (currentUser?.subscription?.id) {
          const res = await newRequest.get("/payment/fetchSub");
          await dispatch(
            updateSuccess({
              ...currentUser,
              plan: res?.data?.plan?.item?.name,
              subStatus: res?.data?.sub,
            })
          );
          // console.log(res.data);
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserSub();
  }, []);

  return (
    <>
      <Navbar />

      <div className="px-10 md:px-28 lg:px-32 bg-[color:var(--light-blue)] py-2">
        <div className="flex text-lg font-semibold">
          <Link to="/">Home</Link>&nbsp; / Dashboard
        </div>
        <div className="h-screen lg:h-[81vh] grid place-items-center">
          <div className="bg-white border rounded-md px-3 py-5 w-full md:w-96 mx-auto">
            <div className="flex flex-col gap-5">
              <h4 className="text-center font-semibold text-xl">Status</h4>

              <div className="flex gap-2 justify-between">
                <p>Current Price Plan</p>
                <p>{currentUser?.plan || "Free"}</p>
              </div>

              {!currentUser?.subscription?.id ? (
                <>
                  <div className="flex items-center gap-2 justify-between">
                    <p>Upgrade Plan</p>
                    <button
                      onClick={() => handleChangePlan("plan_LxOW9le784sr65")}
                      className="border border-gray-500 px-2 py-1 rounded-md hover:bg-black hover:text-white"
                    >
                      Basic Plan
                    </button>
                  </div>
                  {/* <div className="flex items-center gap-2 justify-between">
                    <p>Upgrade Plan</p>
                    <button
                      onClick={() => handleChangePlan("plan_LxoYyxeiYR39Uq")}
                      className="border border-gray-500 px-2 py-1 rounded-md hover:bg-black hover:text-white"
                    >
                      Week Plan
                    </button>
                  </div> */}
                </>
              ) : (
                <>
                  <div className="flex gap-2 justify-between">
                    <p>Plan Status</p>
                    <p className="text-green-800 capitalize">
                      {currentUser?.subStatus?.status}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <p>Start at (First Payment)</p>
                      {moment(currentUser?.subStatus?.start_at * 1000).format(
                        "lll"
                      )}
                    </div>
                    <div className="flex justify-between">
                      <p>Next due (payment) on</p>
                      {moment(
                        currentUser?.subStatus?.current_end * 1000
                      ).format("lll")}
                    </div>

                    <div className="flex justify-between">
                      <p>End at (Last Payment)</p>
                      {moment(currentUser?.subStatus?.end_at * 1000).format(
                        "lll"
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <p>Cancel Plan</p>
                    <button
                      onClick={cancelSub}
                      className="border border-gray-500 px-2 py-1 rounded-md hover:bg-black hover:text-white"
                    >
                      {/* Click here */}
                      {cancelling}
                    </button>
                  </div>
                </>
              )}
              {/* <div className="flex items-center gap-2 justify-between">
                <p>Upgrade Plan</p>
                <button
                  onClick={() => handleChangePlan("plan_LxOYRLsUPZLaqO")}
                  className="border border-gray-500 px-2 py-1 rounded-md hover:bg-black hover:text-white"
                >
                  Advanced Plan
                </button>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <p>Upgrade Plan</p>
                <button
                  onClick={() => handleChangePlan("plan_LxOab0gsjZ0bUO")}
                  className="border border-gray-500 px-2 py-1 rounded-md hover:bg-black hover:text-white"
                >
                  Premium Plan
                </button>
              </div> */}

              <div className="flex gap-2 justify-between">
                <p>Email Alerts</p>
                <div>
                  <Switch
                    value={"Emails"}
                    checked={currentUser?.emailAlerts}
                    onChange={handleUpdateUser}
                    id="1"
                    color="green"
                  />
                </div>
              </div>

              {/* //////////////////////////////////////// */}

              <form
                className="flex flex-col gap-2 mt-2"
                onSubmit={handleUpdateStockData}
              >
                <div>
                  <h2>Stock Name</h2>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    // defaultValue={currentUser?.stockVals}
                    isClearable={true}
                    isSearchable={true}
                    name="stockName"
                    value={stockVals}
                    options={stockData}
                    onChange={handleChange}
                  />
                </div>

                <div className="group">
                  <h2>High price that you want to be notified</h2>
                  <div className="border-2 border-gray-300 flex flex-row justify-center items-center px-2 rounded w-full group-focus-within:border-blue-500">
                    <CurrencyRupeeIcon className="text-gray-400 text-xl" />
                    <input
                      className="py-1.5 px-3 w-full outline-none text-black group-focus-within:border-inherit"
                      type="number"
                      placeholder="Price High Val"
                      value={highPrice}
                      required
                      onChange={(e) => setHighPrice(e.target.value)}
                    />
                  </div>
                </div>

                <button className="px-4 py-2 bg-[#0d2a46] hover:bg-[color:var(--text-black)] rounded-lg text-[color:var(--light-blue)] font-semibold">
                  Apply Changes
                </button>
              </form>

              {/* ////////////////////////////////////////// */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
