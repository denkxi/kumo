import React from "react";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import doge from "../assets/doge_samurai.mp4";
import logo from "../assets/kumo-transparent.png";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    const profile = jwtDecode(response.credential);

    localStorage.setItem("user", JSON.stringify(profile));

    const { name, picture, sub } = profile;

    const user = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };

    client.createIfNotExists(user).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={doge}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center inset-0 bg-blackOverlay">
          <div className="p-5"></div>
          <img src={logo} alt="logo" className="w-[130px]" />

          <div className="mt-6">
            <div className="bg-white p-5 rounded-full outline-none blur-white">
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
                theme="filled_black"
                text="continue_with"
                shape="circle"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
