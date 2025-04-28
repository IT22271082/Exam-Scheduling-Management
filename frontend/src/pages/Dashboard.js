import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FiMenu, FiBook, FiHome, FiUsers, FiCalendar, 
  FiSettings, FiPieChart, FiLogOut, FiChevronLeft, FiChevronRight 
} from "react-icons/fi";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.transition = 'all 0.3s ease';
    }
  }, []);

  const menuItems = [
    { path: "/", name: "Dashboard", icon: <FiHome /> },
    { path: "/lecture-management", name: "Lecturer Management", icon: <FiUsers /> },
    { path: "/resource-management", name: "Resource Management", icon: <FiBook /> },
    { path: "/student", name: "Student Management", icon: <FiUsers /> },
    { path: "/exam-scheduling", name: "Exam Scheduling", icon: <FiCalendar /> },
    { path: "/analytics", name: "Analytics", icon: <FiPieChart /> },
    { path: "/settings", name: "Settings", icon: <FiSettings /> }
  ];

  return (
    <div className="dashboard-container" style={{ 
      minHeight: '100vh', 
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="d-flex">
        {/* Sidebar */}
        <div 
          className={`sidebar bg-gradient-primary text-white ${isSidebarOpen ? "w-250px" : "w-70px"} position-relative`}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="p-3 d-flex align-items-center justify-content-between">
            {isSidebarOpen ? (
              <h3 className="text-center mb-0" style={{ fontWeight: '600', letterSpacing: '1px' }}>
                EduAdmin
              </h3>
            ) : (
              <div className="text-center w-100">
                <FiMenu size={24} />
              </div>
            )}
            
            <button 
              className="btn btn-link text-white p-0"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ minWidth: '30px' }}
            >
              {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
          </div>
          
          <ul className="nav flex-column mt-4 px-2">
            {menuItems.map((item) => (
              <li 
                key={item.path} 
                className={`nav-item mb-2 rounded ${activeItem === item.path ? 'bg-white text-primary' : ''}`}
                onClick={() => setActiveItem(item.path)}
              >
                <Link 
                  to={item.path} 
                  className={`nav-link d-flex align-items-center ${activeItem === item.path ? 'text-primary' : 'text-white'}`}
                  style={{ padding: '12px 15px' }}
                >
                  <span className="mr-3" style={{ minWidth: '24px' }}>{item.icon}</span>
                  {(isSidebarOpen || isHovering) && item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div 
            className="position-absolute bottom-0 w-100 p-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <button className="btn btn-light w-100 d-flex align-items-center justify-content-center">
              <FiLogOut className="mr-2" />
              {(isSidebarOpen || isHovering) && "Logout"}
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0" style={{ color: '#2c3e50', fontWeight: '600' }}>
              Welcome back, Admin!
            </h2>
            <div className="d-flex align-items-center">
              <div className="mr-3 text-right">
                <h6 className="mb-0" style={{ color: '#7f8c8d' }}>Admin User</h6>
                <small className="text-muted">Super Admin</small>
              </div>
              <div 
                className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px', color: 'white' }}
              >
                AU
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #3498db' }}>
                <div className="card-body">
                  <h6 className="text-uppercase text-muted">Lecturers</h6>
                  <h2 className="mb-0">42</h2>
                  <small className="text-success">+5% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #2ecc71' }}>
                <div className="card-body">
                  <h6 className="text-uppercase text-muted">Students</h6>
                  <h2 className="mb-0">1,254</h2>
                  <small className="text-success">+12% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #e74c3c' }}>
                <div className="card-body">
                  <h6 className="text-uppercase text-muted">Resources</h6>
                  <h2 className="mb-0">78</h2>
                  <small className="text-danger">-3% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #f39c12' }}>
                <div className="card-body">
                  <h6 className="text-uppercase text-muted">Exams</h6>
                  <h2 className="mb-0">15</h2>
                  <small className="text-success">+2 this week</small>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="d-flex mb-3">
                <div className="mr-3">
                  <div className="bg-primary rounded-circle p-2 text-white">
                    <FiUsers />
                  </div>
                </div>
                <div>
                  <h6 className="mb-0">New lecturer added</h6>
                  <small className="text-muted">Dr. Smith joined the faculty</small>
                </div>
                <div className="ml-auto text-right">
                  <small>2 hours ago</small>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="mr-3">
                  <div className="bg-success rounded-circle p-2 text-white">
                    <FiCalendar />
                  </div>
                </div>
                <div>
                  <h6 className="mb-0">Exam scheduled</h6>
                  <small className="text-muted">Final exams for CS101</small>
                </div>
                <div className="ml-auto text-right">
                  <small>1 day ago</small>
                </div>
              </div>
              <div className="d-flex">
                <div className="mr-3">
                  <div className="bg-warning rounded-circle p-2 text-white">
                    <FiBook />
                  </div>
                </div>
                <div>
                  <h6 className="mb-0">Resource updated</h6>
                  <small className="text-muted">Lecture notes for Math202</small>
                </div>
                <div className="ml-auto text-right">
                  <small>3 days ago</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-8 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Quick Actions</h5>
                  <button className="btn btn-sm btn-outline-primary">View All</button>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-4 mb-3">
                      <button className="btn btn-light rounded-circle p-3 mb-2">
                        <FiUsers size={24} />
                      </button>
                      <small>Add Lecturer</small>
                    </div>
                    <div className="col-4 mb-3">
                      <button className="btn btn-light rounded-circle p-3 mb-2">
                        <FiBook size={24} />
                      </button>
                      <small>Upload Resource</small>
                    </div>
                    <div className="col-4 mb-3">
                      <button className="btn btn-light rounded-circle p-3 mb-2">
                        <FiCalendar size={24} />
                      </button>
                      <small>Schedule Exam</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Upcoming Events</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6 className="mb-0">Faculty Meeting</h6>
                    <small className="text-muted">Tomorrow, 10:00 AM</small>
                  </div>
                  <div className="mb-3">
                    <h6 className="mb-0">Midterm Exams</h6>
                    <small className="text-muted">Next Monday</small>
                  </div>
                  <div>
                    <h6 className="mb-0">Semester Review</h6>
                    <small className="text-muted">June 15, 2023</small>
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