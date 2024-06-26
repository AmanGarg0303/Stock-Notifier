import React from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

const Banner = () => {
  return (
    // <div className="bg-gradient-to-b from-[var(--light-blue)] to-blue-500 w-full px-10 md:px-28 lg:px-32 py-4 lg:h-[120px]">
    <div className="bg-gradient-to-b from-[var(--light-blue)] from-1% via-blue-200 via-50% to-blue-300 to-100% w-full px-10 md:px-28 lg:px-32 py-4 lg:h-[100px]">
      <div className="flex justify-between items-center h-full">
        <div>
          <h4 className="text-lg lg:text-2xl font-medium">
            Trusted by Million users!
          </h4>
        </div>

        <div>
          <ThumbUpOffAltIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
