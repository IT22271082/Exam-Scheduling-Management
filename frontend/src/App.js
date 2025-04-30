import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import React from "react";
import ExamSchedule from "./components/ExamSchedule";
import AddExamSchedule from "./components/AddExamSchedule";
import EditExamSchedule from "./components/EditExamSchedule"; 

import ResourceAllocationForm from "./components/ResourceAllocationForm";
import ResourceAllocationList from "./components/ResourceAllocationList";
import Home from "./components/Home";
import ResourceTimetable from "./components/ResourceTimetable"; // Import the timetable component
import Student from "./Componenets/Student";
import StudentCreate from "./Componenets/StudentCreate"; 
import MedicalFormSubmission from './Componenets/MedicalFormSubmission';
import MedicalFormsAdmin from './Componenets/MedicalFormsAdmin';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/exam-schedule" element={<ExamSchedule />} />
                <Route path="/add-exam-schedule" element={<AddExamSchedule />} />
                <Route path="/edit-exam-schedule/:id" element={<EditExamSchedule />} />
                

                <Route path="/resource/form/:id?" element={<ResourceAllocationForm />} />
                <Route path="/resource/list" element={<ResourceAllocationList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/timetable" element={<ResourceTimetable />} /> {/* Add the timetable route */}
                <Route path="/student" element={<Student/>}/>
                <Route path="/create" element={<StudentCreate />} />
                <Route path="/medical-forms" element={<MedicalFormSubmission />} />
                <Route path="/adminmed" element={<MedicalFormsAdmin />} />
               

            </Routes>
        </Router>
    );
}

export default App;