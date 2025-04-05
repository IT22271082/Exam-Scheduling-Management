import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    // State for total lecturers count
    const [totalLecturers, setTotalLecturers] = useState(0);

    // Function to fetch lecturers
    const fetchLecturers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/lecturers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Assuming API returns an array of lecturers
            setTotalLecturers(response.data.length);
        } catch (error) {
            console.error("Failed to fetch lecturers:", error);
        }
    };

    useEffect(() => {
        fetchLecturers();
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
        <div className="d-flex">
            {/* Sidebar */}
            <div className={`bg-dark text-white vh-100 p-3 ${isSidebarOpen ? "w-25" : "w-10"}`}>
                <h3 className="text-center">Admin Panel</h3>
                <ul className="nav flex-column mt-4">
                    <li className="nav-item mb-2">
                        <Link to="/lecture-management" className="nav-link text-white">
                            📚 Lecturer Management
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/resource-management" className="nav-link text-white">
                            🏫 Resource Management
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/student-management" className="nav-link text-white">
                            👨‍🎓 Student Management
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/" className="nav-link text-white">
                            📅 Exam Scheduling
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <button 
                            onClick={handleLogout} 
                            className="nav-link text-white bg-transparent border-0 w-100 text-start"
                        >
                            ↩️ Logout
                        </button>
                    </li>
                </ul>
                <button
                    className="btn btn-outline-light mt-4 w-100"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? "Collapse" : "Expand"}
                </button>
            </div>

            {/* Main Content */}
            <div className="p-4 w-100">
                <h2>Welcome to Admin Dashboard</h2>
                <p>Manage your lectures, students, resources, and exams efficiently.</p>

                {/* Summary Section */}
                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Total Lecturers</h5>
                                <p className="card-text">{totalLecturers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-success mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Students</h5>
                                <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-warning mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Resources</h5>
                                <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-danger mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Exams Scheduled</h5>
                                <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
