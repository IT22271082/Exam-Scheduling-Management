import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React from "react";
import ExamSchedule from "./components/ExamSchedule";
import AddExamSchedule from "./components/AddExamSchedule";
import EditExamSchedule from "./components/EditExamSchedule"; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/exam-schedule" element={<ExamSchedule />} />
                <Route path="/add-exam-schedule" element={<AddExamSchedule />} />
                <Route path="/edit-exam-schedule/:id" element={<EditExamSchedule />} />
                
            </Routes>
        </Router>
    );
}

export default App;
