import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./style/MBTIManage.css"; // Assuming you have a CSS file for styling

const MbtiManage = () => {
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [dimension, setDimension] = useState("");
    const [direction, setDirection] = useState("positive");
    const [questionIdToUpdate, setQuestionIdToUpdate] = useState(null);

    // Fetch all MBTI questions
    const fetchQuestions = async () => {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/mbti/questions", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(data);
    };

    // Add a new MBTI question
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const payload = { question_text: questionText, dimension, direction };

        try {
            await API.post("/mbti/questions", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Question added successfully");
            fetchQuestions(); // Re-fetch the questions
            setQuestionText("");
            setDimension("");
            setDirection("positive");
        } catch (error) {
            console.error("Error adding question:", error);
            alert("Failed to add question");
        }
    };

    // Edit an existing MBTI question
    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        if (!questionIdToUpdate) return;

        const token = localStorage.getItem("token");
        const payload = { question_text: questionText, dimension, direction };

        try {
            await API.put(`/mbti/questions/${questionIdToUpdate}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Question updated successfully");
            fetchQuestions(); // Re-fetch the questions
            setQuestionText("");
            setDimension("");
            setDirection("positive");
            setQuestionIdToUpdate(null); // Reset the state after update
        } catch (error) {
            console.error("Error updating question:", error);
            alert("Failed to update question");
        }
    };

    // Delete an MBTI question
    const handleDeleteQuestion = async (questionId) => {
        const token = localStorage.getItem("token");

        try {
            await API.delete(`/mbti/questions/${questionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Question deleted successfully");
            fetchQuestions(); // Re-fetch the questions
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Failed to delete question");
        }
    };

    // Set the form for updating a question
    const handleEditQuestion = (question) => {
        setQuestionText(question.question_text);
        setDimension(question.dimension);
        setDirection(question.direction);
        setQuestionIdToUpdate(question.question_id);
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="mbti-manage-container">
            <h1 className="manage-title">Manage MBTI Questions</h1>

            {/* Add or Update Question Form */}
            <form onSubmit={questionIdToUpdate ? handleUpdateQuestion : handleAddQuestion} className="question-form">
                <input
                    type="text"
                    placeholder="Question Text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                    className="input-field"
                />
                <select
                    value={dimension}
                    onChange={(e) => setDimension(e.target.value)}
                    className="select-field"
                    required
                >
                    <option value="">Select Dimension</option>
                    <option value="EI">EI</option>
                    <option value="SN">SN</option>
                    <option value="TF">TF</option>
                    <option value="JP">JP</option>
                </select>
                <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    className="select-field"
                    required
                >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                </select>

                <button type="submit" className="submit-btn">
                    {questionIdToUpdate ? "Update Question" : "Add Question"}
                </button>
            </form>

            {/* List of MBTI Questions */}
            <div className="question-list">
                <h2>Existing Questions</h2>
                {questions.length > 0 ? (
                    <div className="card-container">
                        {questions.map((q) => (
                            <div key={q.question_id} className="card question-card">
                                <p><strong>Question:</strong> {q.question_text}</p>
                                <p><strong>Dimension:</strong> {q.dimension}</p>
                                <p><strong>Direction:</strong> {q.direction}</p>
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEditQuestion(q)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteQuestion(q.question_id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No questions available</p>
                )}
            </div>
        </div>
    );
};

export default MbtiManage;
