import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                   <Link to="/student" className="nav-link text-white">
                      👨‍🎓 Student Management
                        </Link>
                      </li>
                               <li className="nav-item mb-2">
                            <Link to="/exam-scheduling" className="nav-link text-white">
                             📅 Exam Scheduling Management
                          </Link>
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
