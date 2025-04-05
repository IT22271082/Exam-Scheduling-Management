import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLecturer, createLecturer, updateLecturer } from "../services/api";

const LecturerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    qualification: "",
    bio: "",
    type: "",
  });

  const [lecturerID, setLecturerID] = useState(""); // For display in edit mode
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchLecturer();
    }
  }, [id]);

  const fetchLecturer = async () => {
    try {
      const response = await getLecturer(id);
      const lecturer = response.data;

      setFormData({
        name: lecturer.name,
        email: lecturer.email,
        phone: lecturer.phone || "",
        department: lecturer.department,
        qualification: lecturer.qualification,
        bio: lecturer.bio || "",
        type: lecturer.type || "",
      });

      setLecturerID(lecturer.lecturer_id);
      setLoading(false);
    } catch (err) {
      setError("Failed to load lecturer data");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && value && !/^\d{0,10}$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    // Exclude lecturer_id from form data before submitting
  const dataToSubmit = { ...formData };
  delete dataToSubmit.lecturer_id;  // Exclude lecturer_id from submission

  try {
    if (isEditMode) {
      await updateLecturer(id, dataToSubmit); // Send the updated data (without lecturer_id)
    } else {
      await createLecturer(dataToSubmit); // Send the new lecturer data
    }
    navigate("/lecture-management");
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      setErrors(err.response.data.errors);
    } else {
      setError("Failed to save lecturer");
    }
  }
};

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? "Edit Lecturer" : "Add New Lecturer"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <strong>Personal Details</strong>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <strong>Academic Details</strong>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="department" className="form-label">Department</label>
              <select
                className={`form-select ${errors.department ? "is-invalid" : ""}`}
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science (CS)">Computer Science (CS)</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="Artificial Intelligence (AI)">Artificial Intelligence (AI)</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Science">Data Science</option>
              </select>
              {errors.department && <div className="invalid-feedback">{errors.department}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="qualification" className="form-label">Qualification</label>
              <input
                type="text"
                className={`form-control ${errors.qualification ? "is-invalid" : ""}`}
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              />
              {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="type" className="form-label">Lecturer Type</label>
              <select
                className={`form-select ${errors.type ? "is-invalid" : ""}`}
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Senior">Senior</option>
                <option value="Junior">Junior</option>
              </select>
              {errors.type && <div className="invalid-feedback">{errors.type}</div>}
            </div>

            {isEditMode && (
  <div className="mb-3">
    <label htmlFor="lecturer_id" className="form-label">Lecturer ID</label>
    <input
      type="text"
      className="form-control"
      id="lecturer_id"
      name="lecturer_id"
      value={lecturerID}
      readOnly
    />
  </div>
)}

          </div>
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/lecture-management")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LecturerForm;
