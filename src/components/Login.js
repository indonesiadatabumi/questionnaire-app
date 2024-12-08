import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./style/Login.css"; // Assuming you have a separate CSS file for styling

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.roleName);

      if (data.role === "admin") navigate("/dashboard");
      else navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Login failed!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">Login</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
