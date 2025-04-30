import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiMenu, FiBook, FiHome, FiUsers, FiCalendar, 
  FiSettings, FiPieChart, FiLogOut, FiChevronLeft, FiChevronRight 
} from "react-icons/fi";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("");
  const [isHovering, setIsHovering] = useState(false);

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          width: isSidebarOpen ? "250px" : "70px",
          transition: "all 0.3s ease",
          padding: "1rem 0.5rem",
          position: "relative"
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem" }}>
          {isSidebarOpen ? <h3>EduAdmin</h3> : <FiMenu size={24} />}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ background: "none", border: "none", color: "white" }}
          >
            {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>
        <ul style={{ listStyle: "none", padding: "1rem 0" }}>
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => setActiveItem(item.path)}
              style={{
                padding: "10px 1rem",
                marginBottom: "8px",
                backgroundColor: activeItem === item.path ? "#fff" : "transparent",
                color: activeItem === item.path ? "#764ba2" : "white",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
            >
              <span style={{ marginRight: isSidebarOpen || isHovering ? "10px" : "0" }}>
                {item.icon}
              </span>
              {(isSidebarOpen || isHovering) && <Link to={item.path} style={{ color: "inherit", textDecoration: "none" }}>{item.name}</Link>}
            </li>
          ))}
        </ul>
        <div style={{ position: "absolute", bottom: "20px", width: "100%", padding: "0 1rem" }}>
          <button style={{ width: "100%", backgroundColor: "white", color: "#764ba2", padding: "10px", border: "none", borderRadius: "6px" }}>
            <FiLogOut style={{ marginRight: "8px" }} />
            {(isSidebarOpen || isHovering) && "Logout"}
          </button>
        </div>
      </div>
      <div style={{ flexGrow: 1, background: "#f4f4f4" }}>
        {/* Main content area (currently empty) */}
      </div>
    </div>
  );
}

export default Dashboard;
