import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
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
                <Route path="/student" element={<Student/>}/>
                <Route path="/create" element={<StudentCreate />} />
                <Route path="/medical-forms" element={<MedicalFormSubmission />} />
                <Route path="/adminmed" element={<MedicalFormsAdmin />} />
               
            </Routes>
        </Router>
    );
}

export default App;
