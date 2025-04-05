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

  const [lecturerID, setLecturerID] = useState("");
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";

    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        errorMsg = "Phone number must contain only digits";
      } else if (value.length > 10) {
        errorMsg = "Phone number can't be longer than 10 digits";
      } else if (value.length > 0 && value.length < 10) {
        errorMsg = "Phone number must be 10 digits";
      }
    } else {
      if (!value.trim()) {
        errorMsg = "This field is required";
      } else if (name === "email" && !validateEmail(value)) {
        errorMsg = "Invalid email format";
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    ["name", "email", "department", "qualification", "type", "phone"].forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = { ...formData };
    delete dataToSubmit.lecturer_id;

    try {
      if (isEditMode) {
        await updateLecturer(id, dataToSubmit);
      } else {
        await createLecturer(dataToSubmit);
      }
      navigate("/lecture-management");
    } catch (err) {
      if (err.response?.data?.errors) {
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
