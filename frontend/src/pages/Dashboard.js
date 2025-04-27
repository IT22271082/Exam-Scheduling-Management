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

    // Function to fetch lecturers
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

    // Placeholder for fetching other data
    const fetchDashboardData = () => {
        fetchLecturers();
        // Placeholder values for demo purposes
        setTotalStudents(256);
        setTotalResources(48);
        setTotalExams(12);
    };

    useEffect(() => {
        fetchDashboardData();
        // Set page title
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
                        <Link to="/resource-management" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-building me-2"></i>
                            {isSidebarOpen && <span>Resource Management</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/student-management" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-mortarboard me-2"></i>
                            {isSidebarOpen && <span>Student Management</span>}
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/exam-scheduling" className="nav-link text-white d-flex align-items-center">
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

            {/* Main Content */}
            <div className="flex-grow-1 bg-light">
                <div className="container-fluid p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">Dashboard Overview</h2>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary">
                                <i className="bi bi-bell"></i>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="row g-4 mb-4">
                        <div className="col-xl-3 col-sm-6">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="text-muted fw-normal">Total Lecturers</h6>
                                            <h3 className="mb-0">{totalLecturers}</h3>
                                        </div>
                                        <div className="rounded-circle p-3 bg-primary bg-opacity-10">
                                            <i className="bi bi-person-workspace text-primary fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-3 small">
                                        <span className="text-success">
                                            <i className="bi bi-arrow-up me-1"></i>8%
                                        </span>
                                        <span className="text-muted ms-2">Since last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="text-muted fw-normal">Total Students</h6>
                                            <h3 className="mb-0">{totalStudents}</h3>
                                        </div>
                                        <div className="rounded-circle p-3 bg-success bg-opacity-10">
                                            <i className="bi bi-mortarboard text-success fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-3 small">
                                        <span className="text-success">
                                            <i className="bi bi-arrow-up me-1"></i>12%
                                        </span>
                                        <span className="text-muted ms-2">Since last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="text-muted fw-normal">Resources</h6>
                                            <h3 className="mb-0">{totalResources}</h3>
                                        </div>
                                        <div className="rounded-circle p-3 bg-warning bg-opacity-10">
                                            <i className="bi bi-building text-warning fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-3 small">
                                        <span className="text-danger">
                                            <i className="bi bi-arrow-down me-1"></i>3%
                                        </span>
                                        <span className="text-muted ms-2">Since last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6 className="text-muted fw-normal">Exams Scheduled</h6>
                                            <h3 className="mb-0">{totalExams}</h3>
                                        </div>
                                        <div className="rounded-circle p-3 bg-danger bg-opacity-10">
                                            <i className="bi bi-calendar-check text-danger fs-4"></i>
                                        </div>
                                    </div>
                                    <div className="mt-3 small">
                                        <span className="text-success">
                                            <i className="bi bi-arrow-up me-1"></i>18%
                                        </span>
                                        <span className="text-muted ms-2">Since last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity & Quick Access */}
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="mb-0">Recent Activity</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">Activity</th>
                                                    <th scope="col">User</th>
                                                    <th scope="col">Time</th>
                                                    <th scope="col">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>New lecturer registered</td>
                                                    <td>Dr. Jane Smith</td>
                                                    <td>2 hours ago</td>
                                                    <td><span className="badge bg-success">Completed</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Exam schedule updated</td>
                                                    <td>Admin System</td>
                                                    <td>3 hours ago</td>
                                                    <td><span className="badge bg-success">Completed</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Resource allocation request</td>
                                                    <td>Prof. Michael Lee</td>
                                                    <td>Yesterday</td>
                                                    <td><span className="badge bg-warning">Pending</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Student enrollment</td>
                                                    <td>Registration Office</td>
                                                    <td>Yesterday</td>
                                                    <td><span className="badge bg-success">Completed</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="mb-0">Quick Access</h5>
                                </div>
                                <div className="card-body">
                                    <div className="list-group list-group-flush">
                                        <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                                            <i className="bi bi-person-plus text-primary me-3 fs-5"></i>
                                            <div>
                                                <h6 className="mb-0">Add New Lecturer</h6>
                                                <small className="text-muted">Register faculty member</small>
                                            </div>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                                            <i className="bi bi-calendar-plus text-success me-3 fs-5"></i>
                                            <div>
                                                <h6 className="mb-0">Schedule New Exam</h6>
                                                <small className="text-muted">Create exam timetable</small>
                                            </div>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                                            <i className="bi bi-building-add text-warning me-3 fs-5"></i>
                                            <div>
                                                <h6 className="mb-0">Allocate Resources</h6>
                                                <small className="text-muted">Assign rooms & equipment</small>
                                            </div>
                                        </a>
                                        <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                                            <i className="bi bi-file-earmark-text text-danger me-3 fs-5"></i>
                                            <div>
                                                <h6 className="mb-0">Generate Reports</h6>
                                                <small className="text-muted">Academic performance analysis</small>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;