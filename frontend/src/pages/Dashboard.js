import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [totalLecturers, setTotalLecturers] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalResources, setTotalResources] = useState(0);
    const [totalExams, setTotalExams] = useState(0);

    const fetchLecturers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/lecturers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTotalLecturers(response.data.length);
        } catch (error) {
            console.error("Failed to fetch lecturers:", error);
        }
    };

    const fetchDashboardData = () => {
        fetchLecturers();
        setTotalStudents(256);
        setTotalResources(48);
        setTotalExams(12);
    };

    useEffect(() => {
        fetchDashboardData();
        document.title = "Admin Dashboard";
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <div className="d-flex h-100">
            {/* Sidebar */}
            <div className={`d-flex flex-column flex-shrink-0 p-3 text-white bg-dark ${isSidebarOpen ? "w-280px" : "w-80px"}`} style={{ minHeight: "100vh", transition: "width 0.3s ease" }}>
                <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className={`fs-4 ${!isSidebarOpen && "d-none"}`}>Admin Panel</span>
                    {!isSidebarOpen && <span className="fs-4">AP</span>}
                </div>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mb-1">
                        <Link to="/dashboard" className="nav-link active text-white d-flex align-items-center">
                            <i className="bi bi-speedometer2 me-2"></i>
                            {isSidebarOpen && <span>Dashboard</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/lecture-management" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-person-workspace me-2"></i>
                            {isSidebarOpen && <span>Lecturer Management</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/home" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-building me-2"></i>
                            {isSidebarOpen && <span>Resource Management</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/student" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-mortarboard me-2"></i>
                            {isSidebarOpen && <span>Student Management</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/exam-schedule" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-calendar-check me-2"></i>
                            {isSidebarOpen && <span>Exam Scheduling</span>}
                        </Link>
                    </li>
                    <li className="nav-item mt-3">
                        <button 
                            onClick={handleLogout} 
                            className="nav-link text-white d-flex align-items-center border-0 bg-transparent w-100"
                        >
                            <i className="bi bi-box-arrow-right me-2 text-danger"></i>
                            {isSidebarOpen && <span>Logout</span>}
                        </button>
                    </li>
                </ul>
                <hr />
                <button
                    className="btn btn-outline-secondary mt-2 d-flex align-items-center justify-content-center"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <i className={`bi ${isSidebarOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
                </button>
            </div>

            {/* Main Content (rest of your existing dashboard content remains the same) */}
            {/* ... */}
        </div>
    );
}

export default Dashboard;