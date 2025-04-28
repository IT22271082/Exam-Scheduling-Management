import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExamSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = () => {
    axios
      .get("http://localhost:8000/api/exam-schedules")
      .then((response) => setSchedules(response.data))
      .catch((error) => console.log(error));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const response = await axios.delete(`http://localhost:8000/api/exam-schedules/${id}`);
  
      if (response.status === 200 || response.status === 204) {
        alert("✅ Deleted successfully!");
        setSchedules((prevSchedules) => prevSchedules.filter(schedule => schedule.id !== id));
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error deleting:", error.response ? error.response.data : error.message);
      alert("❌ Deletion failed. Check console for details.");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("📄 Exam Schedule Report", 14, 10);

    autoTable(doc, { 
      head: [["Module Code", "Date", "Start Time", "End Time", "Location"]],
      body: schedules.map(schedule => [
        schedule.module_code,
        schedule.exam_date,
        schedule.start_time,
        schedule.end_time,
        schedule.location,
      ]),
      startY: 20,
    });

    doc.save("Exam_Schedule_Report.pdf");
  };

  return (
    <div className="container mt-4 p-4 rounded" style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <h2 className="text-center text-primary">📅 Exam Schedule</h2>

      {/* Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={() => navigate("/add-exam-schedule")}>
          ➕ Add Exam Schedule
        </button>
        <button className="btn btn-success" onClick={generateReport}>
          📄 Generate Report
        </button>
      </div>

      {/* Exam Schedule Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Module Code</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.module_code}</td>
                  <td>{schedule.exam_date}</td>
                  <td>{schedule.start_time}</td>
                  <td>{schedule.end_time}</td>
                  <td>{schedule.location}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/edit-exam-schedule/${schedule.id}`)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(schedule.id)}>🗑 Delete</button> 
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No exam schedules available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamSchedule;
