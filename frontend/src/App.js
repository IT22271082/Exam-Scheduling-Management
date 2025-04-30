import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LecturerList from "./components/LecturerList";
import LecturerForm from "./components/LecturerForm";
import LecturerDetail from "./components/LecturerDetail";
import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import ExamSchedule from "./components/ExamSchedule";
import AddExamSchedule from "./components/AddExamSchedule";
import EditExamSchedule from "./components/EditExamSchedule"; 

import ResourceAllocationForm from "./components/ResourceAllocationForm";
import ResourceAllocationList from "./components/ResourceAllocationList";
import Home from "./components/Home";
import ResourceTimetable from "./components/ResourceTimetable";
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
                
                {/* Lecturer Management Routes */}
                <Route path="/lecture-management" element={<LecturerList />} /> 
                <Route path="/lecturers/create" element={<LecturerForm />} />
                <Route path="/lecturers/:id" element={<LecturerDetail />} />
                <Route path="/lecturers/:id/edit" element={<LecturerForm />} />
                
                {/* Exam Schedule Routes */}
                <Route path="/exam-schedule" element={<ExamSchedule />} />
                <Route path="/add-exam-schedule" element={<AddExamSchedule />} />
                <Route path="/edit-exam-schedule/:id" element={<EditExamSchedule />} />
                
                {/* Resource Allocation Routes */}
                <Route path="/resource/form/:id?" element={<ResourceAllocationForm />} />
                <Route path="/resource/list" element={<ResourceAllocationList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/timetable" element={<ResourceTimetable />} />
                
                {/* Student Routes */}
                <Route path="/student" element={<Student/>}/>
                <Route path="/create" element={<StudentCreate />} />
                
                {/* Medical Form Routes */}
                <Route path="/medical-forms" element={<MedicalFormSubmission />} />
                <Route path="/adminmed" element={<MedicalFormsAdmin />} />
            </Routes>
        </Router>
    );
}

export default App;