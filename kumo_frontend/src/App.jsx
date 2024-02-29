import "./App.css";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./container/Home";
import Login from "./components/Login";
import { fetchUser } from "./utils/fetchUser";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = fetchUser();
    if(!user) {
      navigate('/login');
    }
  }, []);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
