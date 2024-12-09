import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./style/Layout.css"; // Custom styles

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
            <header className="navbar">
                <h1 className="navbar-brand">Dashboard</h1>
                <nav className="navbar-menu">
                    {options.map((option, index) => (
                        <Link key={index} to={option.path} className="navbar-link">
                            {option.label}
                        </Link>
                    ))}
                </nav>
            </header>

            {/* Render specific page content */}
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;