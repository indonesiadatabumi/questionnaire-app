import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./style/MBTITest.css"; // Assuming you have a separate CSS file for styling

const MBTITest = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0); // To track the current question index

    const fetchQuestions = async () => {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/mbti/questions", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(data);
    };

    const handleAnswer = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const submitAnswers = async () => {
        const token = localStorage.getItem("token");
        const payload = {
            answers: Object.entries(answers).map(([questionId, response]) => ({
                question_id: parseInt(questionId),
                response,
            })),
        };
        await API.post("/mbti/submit", payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert("Your MBTI test has been submitted!");
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1); // Go to the next question
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1); // Go to the previous question
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="mbti-test-container">
            <h1 className="mbti-test-title">Take the MBTI Test</h1>

            {/* Only render the current question */}
            {questions.length > 0 && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitAnswers();
                    }}
                    className="mbti-test-form"
                >
                    <div className="mbti-question-container">
                        <div className="card mbti-question-card">
                            <p className="card-text">{questions[currentIndex].question_text}</p>
                            <select
                                className="answer-select"
                                onChange={(e) =>
                                    handleAnswer(questions[currentIndex].question_id, parseInt(e.target.value))
                                }
                            >
                                <option value="1">Strongly Disagree</option>
                                <option value="2">Disagree</option>
                                <option value="3">Neutral</option>
                                <option value="4">Agree</option>
                                <option value="5">Strongly Agree</option>
                            </select>
                        </div>
                    </div>

                    <div className="navigation-buttons">
                        <button
                            type="button"
                            className="prev-btn"
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            className="next-btn"
                            onClick={handleNext}
                            disabled={currentIndex === questions.length - 1}
                        >
                            Next
                        </button>
                    </div>

                    {currentIndex === questions.length - 1 && (
                        <button type="submit" className="submit-btn">
                            Submit
                        </button>
                    )}
                </form>
            )}
        </div>
    );
};

export default MBTITest;
