import React, { useState, useEffect } from "react";
import { MdDownload, MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [writingComment, setWritingComment] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const handleButton = () => {
    if (writingComment && comment === "") {
      setWritingComment(false);
    } else if (!writingComment) {
      setWritingComment(true);
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails;
          setComment("");
          setAddingComment(false);
          setWritingComment(false);
        });
    }
  };

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);

          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading image..." />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        {/* Image */}
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt="user-post"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>

        {/* Image details */}
        <div className="w-full p-5 flex-1 xl:min-w-[620px]">
          <div className="flex items-center justify-between">
            {/* Download image */}
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                className="bg-cyan-100 opacity-75 w-9 h-9 rounded-full flex items-center justify-center text-xl hover:opacity-100 hover:shadow-md"
                title="Download image"
              >
                <MdDownload />
              </a>
            </div>

            {/* Destination */}
            <a
              href={pinDetail.destination}
              target="_blank"
              rel="noreferrer"
              className="bg-cyan-100 opacity-75 p-2 rounded-full text-base hover:opacity-100 hover:shadow-md"
            >
              {pinDetail.destination}
            </a>
          </div>

          {/* About image */}
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>

          {/* Posted by */}
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <p>Posted by</p>
            <img
              src={pinDetail.postedBy?.image}
              alt="user-profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>

          {/* Comment section */}
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-[370px] overflow-y-auto">
            {pinDetail?.comments?.map((comment, index) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={index}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Write a comment */}
          <div className="flex flex-wrap mt-6 gap-3 items-start justify-center">
            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
              <img
                src={pinDetail.postedBy?.image}
                alt="user-profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </Link>
            <textarea
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 resize-none h-20"
              placeholder="Write your comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onFocus={handleButton}
              onBlur={handleButton}
            />
            {writingComment && (
              <button
                type="button"
                className="bg-cyan-300 opacity-75 rounded-full px-6 py-2 font-semibold text-base outline-none hover hover:opacity-100"
                onClick={addComment}
              >
                {addingComment ? "Leaving comment..." : "Comment"}
              </button>
            )}
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <div className="mt-4">
          <Spinner message="Loading more images..." />
        </div>
      )}
    </>
  );
};

export default PinDetail;
