import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./style/Questionnaires.css"; // Assuming you have a separate CSS file for styling

const Questionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleDetail = (questionnaireId) => {
    navigate(`/questions/${questionnaireId}`);
  };

  const fetchQuestionnaires = async () => {
    const token = localStorage.getItem("token");
    const { data } = await API.get("/questionnaire", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuestionnaires(data);
  };

  const addQuestionnaire = async () => {
    const token = localStorage.getItem("token");
    await API.post(
      "/questionnaire",
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchQuestionnaires();
  };

  const deleteQuestionnaire = async (id) => {
    const token = localStorage.getItem("token");
    await API.delete(`/questionnaire/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchQuestionnaires();
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  return (
    <div className="questionnaires-container">
      <h1 className="page-title">Questionnaires</h1>

      {/* Main container for form and list */}
      <div className="questionnaires-main">
        
        {/* Add Questionnaire Form (Left side) */}
        <div className="form-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addQuestionnaire();
            }}
            className="add-questionnaire-form"
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="textarea-field"
            />
            <button type="submit" className="submit-btn">
              Add Questionnaire
            </button>
          </form>
        </div>

        {/* List of Questionnaires (Right side) */}
        <div className="questionnaire-list">
          {questionnaires.map((q) => (
            <div key={q.questionnaire_id} className="card questionnaire-card">
              <h3 className="card-title">{q.title}</h3>
              <p className="card-description">{q.description}</p>
              <div className="card-actions">
                <button onClick={() => handleDetail(q.questionnaire_id)} className="action-btn">
                  View Questions
                </button>
                <button
                  onClick={() => deleteQuestionnaire(q.questionnaire_id)}
                  className="action-btn delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Questionnaires;
