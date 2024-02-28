import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage = "https://source.unsplash.com/1600x900/?japan,nature";

const activeBtnStyles =
  "bg-cyan-200 font-bold p-2 rounded-full w-20 outline-none shadow-md";
const notActiveBtnStyles =
  "bg-primary font-bold p-2 rounded-full w-20 outline-none shadow-md";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [createdPins, setCreatedPins] = useState(null);
  const [savedPins, setSavedPins] = useState(null);
  const [activeBtn, setActiveBtn] = useState("Created");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (activeBtn === "Created" && !createdPins) {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setCreatedPins(data);
      });
    } else if (activeBtn === "Saved" && !savedPins) {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setSavedPins(data);
      });
    }
  }, [activeBtn, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              alt="background"
              className="w-full h-[370px] 2xl:h-[510px] shadow-lg object-cover"
            />
            <img
              src={user.image}
              alt="user-pic"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>

            {/* Logout button */}
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <button
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                  onClick={() => {
                    googleLogout();
                    logout();
                  }}
                >
                  <div className="flex flex-row gap-2 px-2">
                    <AiOutlineLogout fontSize={21} />
                    Logout
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Category buttons */}
          <div className="flex flex-row gap-2 justify-center text-center mb-7">
            <button
              type="button"
              onClick={() => setActiveBtn("Created")}
              className={`${
                activeBtn === "Created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={() => setActiveBtn("Saved")}
              className={`${
                activeBtn === "Saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          {/* Show created or saved images based on button selected */}
          {createdPins?.length && activeBtn === "Created" ? (
            <div className="px-2">
              <MasonryLayout pins={createdPins} />
            </div>
          ) : savedPins?.length && activeBtn === "Saved" ? (
            <div className="px-2">
              <MasonryLayout pins={savedPins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">No images found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
