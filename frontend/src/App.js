import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LecturerList from "./components/LecturerList";
import LecturerForm from "./components/LecturerForm";
import LecturerDetail from "./components/LecturerDetail";

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
               
            </Routes>
        </Router>
    );
}

export default App;
