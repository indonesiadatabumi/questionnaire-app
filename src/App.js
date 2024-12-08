import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Questionnaire from "./components/Questionnaires";
import QuestionnaireScreen from "./components/QuestionnaireScreen";
import Questions from "./components/Questions";
import MBTI from "./components/MBTITest";
import MbtiManage from "./components/MBTIManage";
import Results from "./components/Results";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />


        <Route path="/" element={<Layout />}>
          {/* Private Routes */}
          <Route
            path="dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />

          {/* The route for taking the manage questionnaire */}
          <Route
            path="questionnaires"
            element={<PrivateRoute component={Questionnaire} />}
          />

          {/* The route for taking the questionnaire */}
          <Route
            path="questionnairesScreen"
            element={<PrivateRoute component={QuestionnaireScreen} />}
          />

          {/* The route for taking the questionnaire */}
          <Route
            path="questions/:questionnaireId"
            element={<PrivateRoute component={Questions} />}
          />

          {/* The route for taking the questionnaire */}
          <Route
            path="mbti"
            element={<PrivateRoute component={MBTI} />}
          />

          {/* The route for manage the questionnaire */}
          <Route
            path="mbti-manage"
            element={<PrivateRoute component={MbtiManage} />}
          />

          {/* The route for viewing the results */}
          <Route
            path="results"
            element={<PrivateRoute component={Results} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
