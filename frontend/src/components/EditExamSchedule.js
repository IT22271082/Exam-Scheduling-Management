import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditExamSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    module_code: "",
    exam_date: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/exam-schedules/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/api/exam-schedules/${id}`, formData)
      .then(() => {
        alert("✅ Exam schedule updated successfully!");
        navigate("/exam-schedule");
      })
      .catch((error) => {
        console.error("Error updating schedule:", error);
        alert("❌ Update failed.");
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ width: "40rem", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
        <h2 className="text-center text-warning mb-4">✏️ Edit Exam Schedule</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">📘 Module Code</label>
            <input type="text" className="form-control" name="module_code" value={formData.module_code} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">📅 Exam Date</label>
            <input type="date" className="form-control" name="exam_date" value={formData.exam_date} onChange={handleChange} required />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">⏰ Start Time</label>
              <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">⏳ End Time</label>
              <input type="time" className="form-control" name="end_time" value={formData.end_time} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">📍 Location</label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button type="submit" className="btn btn-warning w-50 me-2 shadow-sm">✅ Update</button>
            <button type="button" className="btn btn-secondary w-50 shadow-sm" onClick={() => navigate("/exam-schedule")}>🔙 Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExamSchedule;