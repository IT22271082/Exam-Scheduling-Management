import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Student from "./Componenets/Student";
import StudentCreate from "./Componenets/StudentCreate"; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/student" element={<Student/>}/>
                <Route path="/create" element={<StudentCreate />} />
                
            </Routes>
        </Router>
    );
}

export default App;
