import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate(); // Add useNavigate hook

    const handleLogout = async () => {
        try {
            // Get token from local storage
            const token = localStorage.getItem("token");

            // Send logout request
            await axios.post("http://localhost:8000/api/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove token from local storage
            localStorage.removeItem("token");

            // Redirect to login page using navigate
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            // Optional: Add user-friendly error handling
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
                            👨‍🎓 Exam Schedulling
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
                <p>Manage your lectures and resources efficiently.</p>
            </div>
        </div>
    );
}

export default Dashboard;