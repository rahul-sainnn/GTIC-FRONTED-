import React, { useState } from "react";
import "./Login.css";
import logo from "/logo.png";
import axios from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

const LOGIN_URL = "/auth/login";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const from = location.state?.from?.pathname || '/speakers';

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const handleSubmit = async (e) => {
    // console.log("hi");
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log('hey');
      const accessToken = response?.data?.token;
      localStorage.setItem("token", accessToken);
      setUser("");
      setPwd("");
      // navigate(from, { replace: true });
      navigate("/speakers");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login">
      <img src={logo} alt="" />
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="login-form">
            <input
              type="text"
              placeholder="Enter Username"
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              className="login-input"
              required
            />
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPwd(e.target.value)}
              className="login-input"
              value={pwd}
              required
            />
          </div>
          <div className="login-button">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
