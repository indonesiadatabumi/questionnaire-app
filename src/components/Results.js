import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./style/Results.css"; // Assuming you have a separate CSS file for styling

const Results = () => {
    const [mbtiResults, setMbtiResults] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [search, setSearch] = useState("");
    const [questionnaireResults, setQuestionnaireResults] = useState([]);
    const [role, setRole] = useState(""); // Assume role is fetched from user context or localStorage.

    // Fetch MBTI results
    const fetchMbtiResults = async (role, token, page = 1, limit = 10, search = "") => {
        const endpoint = role === "admin" ? "/mbti/admin-results" : "/mbti/member-result";
        const params = role === "admin" ? { page, limit, search } : {};
        const { data } = await API.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        if (role === "admin") {
            setMbtiResults(data.data);
            setPagination({ page: data.pagination.page, limit: data.pagination.limit, total: data.pagination.total });
        } else {
            setMbtiResults([data]);
        }
    };

    // Fetch Questionnaire results (only for admin)
    const fetchQuestionnaireResults = async (role, token) => {
        if (role === "admin") {
            const endpoint = "/dss/results";
            const { data } = await API.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setQuestionnaireResults(data);
        }
    };

    // Fetch both results
    const fetchResults = async () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        setRole(role);

        try {
            await Promise.all([fetchQuestionnaireResults(role, token), fetchMbtiResults(role, token, pagination.page, pagination.limit, search)]);
        } catch (error) {
            console.error("Error fetching results:", error);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [pagination.page, pagination.limit, search]);

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="results-container">
            <h1 className="results-title">{role === "admin" ? "All User Results" : "Your Results"}</h1>

            {/* Search Input (Above Results) */}
            {role === "admin" && (
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by username or type"
                        value={search}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
            )}

            {/* Main container for results */}
            <div className="results-main">
                {/* Display MBTI Results */}
                <section className="results-section">
                    <h2 className="section-title">MBTI Results</h2>

                    <div className="results-list">
                        {mbtiResults.length > 0 ? (
                            <div className="card-container">
                                {mbtiResults.map((res, idx) => (
                                    <div key={idx} className="result-card">
                                        {role === "admin" && <strong>Username: </strong>} {res.username} <br />
                                        <strong>Type: </strong> {res.type_name} <br />
                                        <strong>Description: </strong> {res.description}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No MBTI results available.</p>
                        )}
                    </div>

                    {/* Admin pagination */}
                    {role === "admin" && pagination.total > pagination.limit && (
                        <div className="pagination-controls">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="pagination-btn"
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === Math.ceil(pagination.total / pagination.limit)}
                                className="pagination-btn"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>

                {/* Admin: Display Questionnaire Results */}
                {role === "admin" && (
                    <section className="results-section">
                        <h2 className="section-title">Questionnaire Results</h2>

                        <div className="results-list">
                            {questionnaireResults.length > 0 ? (
                                <div className="card-container">
                                    {questionnaireResults.map((res, idx) => (
                                        <div key={idx} className="result-card">
                                            <strong>Questionnaire ID: </strong> {res.questionnaire_id} <br />
                                            <strong>Analyzed At: </strong> {new Date(res.analyzed_at).toLocaleString()} <br />
                                            <strong>Analysis Results:</strong>
                                            <ul>
                                                {res.analysis_results.map((result, resultIdx) => (
                                                    <li key={resultIdx} className="analysis-result">
                                                        {result.option_text}: {result.count}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No questionnaire results available.</p>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Results;
