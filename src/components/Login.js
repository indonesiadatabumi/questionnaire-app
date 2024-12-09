import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import "./style/Login.css"; // Your custom styles

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

      // toast.success("Login successful!", { position: "top-center", autoClose: 2000 });
      // toast("Login Success", {
      //   type: 'success'
      // });
      if (data.role === "admin") navigate("/dashboard");
      else navigate("/dashboard");
    } catch (error) {
      // toast("Login Failed", {
      //   type: 'warning'
      // });
      // toast.error("Login failed. Please check your credentials.", { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue</p>
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
