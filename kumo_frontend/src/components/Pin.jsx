import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownload, MdDelete } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

const saveButtonStyle =
  "bg-red-400 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none";
const deleteButtonStyle =
  "bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();

  const user = fetchUser();
  const alreadySaved =
    save?.filter((item) => item?.postedBy?._id === user?.sub)?.length === 1;

  const savePin = (id) => {
    if (!alreadySaved && user) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="rounded-lg w-full"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between mt-1 ml-1">
              <div className="flex gap-2">
                {/* Download button */}
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  title="Download"
                >
                  <MdDownload />
                </a>
              </div>
              {/* Save button */}
              {alreadySaved ? (
                <button type="button" className={saveButtonStyle}>
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  className={saveButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {/* Destination URL button */}
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? destination.slice(0, 15) + "..."
                    : destination}
                </a>
              )}
              {/* Delete button  */}
              {postedBy?._id === user?.sub && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className={deleteButtonStyle}
                  title="Delete"
                >
                  <MdDelete size={23} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          src={postedBy?.image}
          alt="user-profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
