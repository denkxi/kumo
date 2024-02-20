import React from "react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";

import logo from "../assets/kumo-logo.png";

const Sidebar = ({ user, closeToggle }) => {
  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-[210px] hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-[190px] items-center"
          onClick={handleClose}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
