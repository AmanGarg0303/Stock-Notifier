import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateSuccess } from "../redux/userSlice";
import newRequest from "../utils/newRequest";

const PaymentSuccess = () => {
  const { currentUser } = useSelector((user) => user?.user);

  const searchQuery = useSearchParams()[0];
  const refNum = searchQuery.get("reference");
  const dispatch = useDispatch();

  const [subData, setSubData] = useState();

  useEffect(() => {
    const fetchSubId = async () => {
      const res = await newRequest.get(`/users/getSubId/${refNum}`);
      // console.log(res.data);
      setSubData(res.data);
    };
    fetchSubId();
  }, [refNum]);

  useEffect(() => {
    // const updateDate = async () => {
    dispatch(
      updateSuccess({
        ...currentUser,
        subscription: { id: subData?.subId, status: "active" },
      })
    );
    // };
    // updateDate();
    // console.log("Update success");
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-5 justify-center items-center h-[40vh]">
        <h4 className="text-2xl font-semibold">Subscription successfull</h4>
        <p>
          Reference No. - <span className="font-medium">{refNum}</span>
        </p>

        <Link to="/dashboard">
          <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
