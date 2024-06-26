import { Link } from "react-router-dom";

const PaymentFail = () => {
  return (
    <div>
      <div className="flex flex-col gap-5 justify-center items-center h-[40vh]">
        <h4 className="text-2xl font-semibold">Payment Failed</h4>

        <Link to="/dashboard">
          <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFail;
