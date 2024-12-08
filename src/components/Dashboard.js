import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/Dashboard.css"; // Assuming you have a separate CSS file for styling

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Save role during login

  const adminOptions = [
    { label: "Manage MBTI Questions", path: "/mbti-manage" },
    { label: "Manage Questionnaires", path: "/questionnaires" },
    { label: "View Reports", path: "/results" },
  ];

  const memberOptions = [
    { label: "Take MBTI Test", path: "/mbti" },
    { label: "View Your Results", path: "/results" },
  ];

  const options = role === "admin" ? adminOptions : memberOptions;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to the Dashboard</h1>
    </div>
  );
};

export default Dashboard;
