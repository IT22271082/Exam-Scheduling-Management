import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResourceAllocationForm from "./components/ResourceAllocationForm";
import ResourceAllocationList from "./components/ResourceAllocationList";
import Home from "./components/Home";
import ResourceTimetable from "./components/ResourceTimetable"; // Import the timetable component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resource/form/:id?" element={<ResourceAllocationForm />} />
                <Route path="/resource/list" element={<ResourceAllocationList />} />
                <Route path="/home" element={<Home />} />
                <Route path="/timetable" element={<ResourceTimetable />} /> {/* Add the timetable route */}
            </Routes>
        </Router>
    );
}

export default App;