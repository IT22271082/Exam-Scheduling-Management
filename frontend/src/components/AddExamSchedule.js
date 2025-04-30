import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AddExamSchedule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    module_code: "",
    exam_date: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!/^[A-Za-z]+\d+$/.test(formData.module_code)) {
      newErrors.module_code = "Module code must contain letters and numbers (e.g., CS101).";
    }

    if (formData.exam_date < today) {
      newErrors.exam_date = "Exam date cannot be in the past.";
    }

    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = "End time must be after start time.";
    }

    if (formData.location.trim().length < 3) {
      newErrors.location = "Location must be at least 3 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .post("http://localhost:8000/api/exam-schedules", formData)
      .then(() => {
        alert("✅ Exam schedule added successfully!");
        navigate("/exam-schedule");
      })
      .catch((error) => {
        console.error("Error adding schedule:", error);
        alert("❌ Error adding schedule.");
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ width: "40rem", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
        <h2 className="text-center text-primary mb-4">📌 Add Exam Schedule</h2>

        <form onSubmit={handleAdd}>
          <div className="mb-3">
            <label className="form-label fw-semibold">📘 Module Code</label>
            <input type="text" className="form-control" name="module_code" value={formData.module_code} onChange={handleChange} required />
            {errors.module_code && <small className="text-danger">{errors.module_code}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">📅 Exam Date</label>
            <input type="date" className="form-control" name="exam_date" value={formData.exam_date} onChange={handleChange} required />
            {errors.exam_date && <small className="text-danger">{errors.exam_date}</small>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">⏰ Start Time</label>
              <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">⏳ End Time</label>
              <input type="time" className="form-control" name="end_time" value={formData.end_time} onChange={handleChange} required />
              {errors.end_time && <small className="text-danger">{errors.end_time}</small>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">📍 Location</label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
            {errors.location && <small className="text-danger">{errors.location}</small>}
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button type="submit" className="btn btn-success w-50 me-2 shadow-sm">✅ Add Schedule</button>
            <button type="button" className="btn btn-secondary w-50 shadow-sm" onClick={() => navigate("/exam-schedule")}>❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamSchedule;
