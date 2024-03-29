import React, { useState, useRef, useEffect } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { Sidebar, UserProfile } from "../components";
import Pins from "./Pins";
import { client } from "../client";
import logo from "../assets/kumo-light-transparent.png";
import { userQuery } from "../utils/data";
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out overflow-hidden">
      {/* Wide screen sidebar */}
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>

      {/* Narrow screen sidebar */}
      <div className="md:hidden flex flex-row">
        {/* Narrow screen header */}
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-xl">
          <HiMenuAlt1
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />

          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>

          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-20 rounded-full" />
          </Link>
        </div>

        {/* narrow screen sidebar */}
        {toggleSidebar && (
          <div className="fixed w-3/5 bg-white h-screen shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      {/* content */}
      <div className="pb-2 flex-1 h-screen overflow-y-auto" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          {/* Pass user into pins if it exists */}
          <Route path="/*" element={<Pins user={user && user} />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default Home;
