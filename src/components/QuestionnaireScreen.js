import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./style/QuestionnaireScreen.css"; // Assuming you have a separate CSS file for styling

const QuestionnaireScreen = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [currentQuestionnaire, setCurrentQuestionnaire] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Page state
    const questionsPerPage = 1; // Questions per page
    const [isQuestionnaireSelected, setIsQuestionnaireSelected] = useState(false); // State to check if questionnaire is selected
    const navigate = useNavigate();

    const fetchQuestions = async (questionnaireId) => {
        const token = localStorage.getItem("token");
        const { data } = await API.get(`/questions/${questionnaireId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentQuestionnaire(data);
        setIsQuestionnaireSelected(true); // Set the state to show the question form
    };

    // Fetch all available questionnaires for members
    const fetchQuestionnaires = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const { data } = await API.get("/questionnaire", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuestionnaires(data);
        } catch (error) {
            console.error("Failed to fetch questionnaires:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle answer selection for a questionnaire
    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    // Submit answers for a questionnaire
    const handleSubmit = async () => {
        if (!currentQuestionnaire) return;

        const token = localStorage.getItem("token");

        try {
            await Object.entries(answers).map(
                async ([questionId, answer]) => {
                    const dataInsert = {
                        "questionnaire_id": currentQuestionnaire[0].questionnaire_id,
                        "question_id": parseInt(questionId),
                        "answer_option": answer
                    }
                    await API.post(
                        "/submitAnswer",
                        dataInsert,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                }
            )
            alert("Your answers have been submitted!");
            setIsQuestionnaireSelected(false); // Reset the state to show the questionnaire list
        } catch (error) {
            console.error("Failed to submit answers:", error);
            alert("There was an error submitting your answers.");
        }
    };

    // Paginate questions: display only a subset based on the current page
    const paginateQuestions = (questions) => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        return questions.slice(startIndex, endIndex);
    };

    // Handle page navigation
    const handleNextPage = () => {
        if (currentPage < Math.ceil(currentQuestionnaire.length / questionsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Fetch questionnaires on component mount
    useEffect(() => {
        fetchQuestionnaires();
    }, []);

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="questionnaire-screen-container">
            <h1 className="questionnaire-title">Available Questionnaires</h1>

            {/* Show questionnaire list if not viewing a question form */}
            {!isQuestionnaireSelected && (
                <div className="questionnaire-list">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        questionnaires.map((q) => (
                            <div key={q.questionnaire_id} className="card questionnaire-card">
                                <h2 className="card-title">{q.title}</h2>
                                <p>{q.description}</p>
                                <button
                                    className="start-btn"
                                    onClick={() => fetchQuestions(q.questionnaire_id)}
                                >
                                    Start Questionnaire
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Show questionnaire detail and questions once a questionnaire is selected */}
            {isQuestionnaireSelected && currentQuestionnaire && (
                <div className="questionnaire-detail">
                    <h2 className="questionnaire-detail-title">{currentQuestionnaire.title}</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {paginateQuestions(currentQuestionnaire).map((question) => (
                            <div key={question.question_id} className="question-card">
                                <p className="question-text">{question.question_text}</p>
                                <div className="options-container">
                                    {question.question_type === "multiple_choice" ? (
                                        question.options.map((option) => (
                                            <label key={option.option_text} className="option-label">
                                                <input
                                                    type="radio"
                                                    name={`question_${question.question_id}`}
                                                    value={option.option_text}
                                                    onChange={() =>
                                                        handleAnswerChange(question.question_id, option.option_id)
                                                    }
                                                    className="option-input"
                                                />
                                                {option.option_text}
                                            </label>
                                        ))
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder="Your answer"
                                            onChange={(e) =>
                                                handleAnswerChange(question.question_id, e.target.value)
                                            }
                                            className="text-input"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="pagination-controls">
                            <button
                                type="button"
                                onClick={handlePrevPage}
                                className="pagination-btn"
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {currentPage}
                            </span>
                            <button
                                type="button"
                                onClick={handleNextPage}
                                className="pagination-btn"
                                disabled={currentPage === Math.ceil(currentQuestionnaire.length / questionsPerPage)}
                            >
                                Next
                            </button>
                        </div>
                        <button type="submit" className="submit-btn">
                            Submit Answers
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default QuestionnaireScreen;
