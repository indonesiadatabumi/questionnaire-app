import React from "react";
import { Outlet, Link } from "react-router-dom"; // Use Outlet for nested routes
import "./style/Layout.css"; // Assuming you have a separate CSS file for layout styling

const Layout = () => {
    const role = localStorage.getItem("role");

    const adminOptions = [
        { label: "Manage MBTI Questions", path: "/mbti-manage" },
        { label: "Manage Questionnaires", path: "/questionnaires" },
        { label: "View Reports", path: "/results" },
    ];

    const memberOptions = [
        { label: "Take MBTI Test", path: "/mbti" },
        { label: "Take Questionnaire", path: "/questionnairesScreen" },
        { label: "View Your Results", path: "/results" },
    ];

    const options = role === "admin" ? adminOptions : memberOptions;

    return (
        <div className="layout-container">
            <header className="header">
                <h1>Dashboard</h1>
            </header>

            {/* Dashboard menu */}
            <div className="menu-container">
                <div className="card-grid">
                    {options.map((option, index) => (
                        <div key={index} className="card">
                            <Link to={option.path} className="card-link">
                                <h2 className="card-title">{option.label}</h2>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Render specific page content */}
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;