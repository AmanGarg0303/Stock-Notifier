import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div>
      <Navbar />

      <div className="h-[90vh] md:h-[87vh] bg-[color:var(--light-blue)]">
        <div className="h-full flex flex-col justify-center items-center gap-5">
          <img
            src="https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png"
            alt=""
            className="w-96"
          />
          <h2 className="px-10 text-lg text-center">
            Sorry the page you are looking for could not be found.
          </h2>
          <Link to="/">
            <button className="border rounded-full px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium">
              GO HOME
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page404;
