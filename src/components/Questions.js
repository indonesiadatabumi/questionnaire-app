import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./style/Questions.css"; // Assuming you have a separate CSS file for styling

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("text");
    const [options, setOptions] = useState([]);
    const questionnaireId = useParams().questionnaireId;

    const fetchQuestions = async () => {
        const token = localStorage.getItem("token");
        const { data } = await API.get(`/questions/${questionnaireId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(data);
    };

    const addQuestion = async () => {
        const token = localStorage.getItem("token");
        const payload = {
            questionnaire_id: parseInt(questionnaireId),
            question_text: questionText,
            question_type: questionType,
            options: questionType === "multiple_choice" ? options : [],
        };

        // Ensure at least one correct answer for multiple-choice questions
        if (questionType === "multiple_choice") {
            const hasCorrectAnswer = options.some((option) => option.is_correct);
            if (!hasCorrectAnswer) {
                alert("You must select at least one correct answer.");
                return;
            }
        }

        await API.post("/questions", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchQuestions();
    };

    const deleteQuestion = async (questionId) => {
        const token = localStorage.getItem("token");
        await API.delete(`/questions/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchQuestions();
    };

    // Handle adding options with the correct answer flag
    const handleAddOption = () => {
        setOptions([...options, { text: "", is_correct: false }]);
    };

    // Handle updating an option's text or correct flag
    const handleOptionChange = (index, key, value) => {
        const updatedOptions = options.map((option, i) =>
            i === index ? { ...option, [key]: value } : option
        );
        setOptions(updatedOptions);
    };

    useEffect(() => {
        fetchQuestions();
    }, [questionnaireId]);

    return (
        <div className="questions-container">
            <h1 className="page-title">Questions for Questionnaire {questionnaireId}</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addQuestion();
                }}
                className="question-form"
            >
                <input
                    type="text"
                    placeholder="Enter question text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                    className="input-field"
                />
                <select
                    value={questionType}
                    onChange={(e) => {
                        setQuestionType(e.target.value);
                        setOptions([]); // Reset options when switching question types
                    }}
                    className="select-field"
                >
                    <option value="text">Text</option>
                    <option value="multiple_choice">Multiple Choice</option>
                </select>

                {questionType === "multiple_choice" && (
                    <div className="options-container">
                        <h3>Options</h3>
                        {options.map((option, index) => (
                            <div key={index} className="option-input">
                                <input
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={(e) =>
                                        handleOptionChange(index, "text", e.target.value)
                                    }
                                    required
                                    className="input-field"
                                />
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={option.is_correct}
                                        onChange={(e) =>
                                            handleOptionChange(index, "is_correct", e.target.checked)
                                        }
                                    />
                                    Correct Answer
                                </label>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddOption} className="add-option-btn">
                            Add Option
                        </button>
                    </div>
                )}
                <button type="submit" className="submit-btn">
                    Add Question
                </button>
            </form>

            <div className="questions-list">
                {questions.map((q) => (
                    <div key={q.question_id} className="question-card">
                        <p>{q.question_text}</p>
                        <p><strong>Type:</strong> {q.question_type}</p>
                        {q.options && (
                            <div className="options-list">
                                {q.options.map((opt, i) => (
                                    <div key={i} className="option">
                                        {opt.option_text}{" "}
                                        {opt.is_correct && <span className="correct-badge">(Correct)</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => deleteQuestion(q.question_id)}
                            className="delete-btn"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Questions;
