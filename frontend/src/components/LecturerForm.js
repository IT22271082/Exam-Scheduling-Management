import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLecturer, createLecturer, updateLecturer } from '../services/api';

const LecturerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    bio: '',
    profile_photo: null
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
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
        phone: lecturer.phone || '',
        department: lecturer.department,
        qualification: lecturer.qualification,
        bio: lecturer.bio || '',
      });

      if (lecturer.profile_photo) {
        setPhotoPreview(`http://localhost:8000/storage/${lecturer.profile_photo}`);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load lecturer data');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      if (isEditMode) {
        await updateLecturer(id, formData);
      } else {
        await createLecturer(formData);
      }
      navigate('/lecture-management');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError('Failed to save lecturer');
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? 'Edit Lecturer' : 'Add New Lecturer'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Personal Details Card */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <strong>Personal Details</strong>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
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
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
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
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            {/* Profile Photo Section */}
            <div className="mb-3">
              <label htmlFor="profile_photo" className="form-label">Profile Photo</label>
              <input
                type="file"
                className={`form-control ${errors.profile_photo ? 'is-invalid' : ''}`}
                id="profile_photo"
                name="profile_photo"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {errors.profile_photo && <div className="invalid-feedback">{errors.profile_photo}</div>}
              
              {photoPreview && (
                <div className="mt-2">
                  <img 
                    src={photoPreview} 
                    alt="Profile Preview" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '200px' }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Academic Details Card */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <strong>Academic Details</strong>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="department" className="form-label">Department</label>
              <select
                className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
              {errors.department && <div className="invalid-feedback">{errors.department}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="qualification" className="form-label">Qualification</label>
              <input
                type="text"
                className={`form-control ${errors.qualification ? 'is-invalid' : ''}`}
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              />
              {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
              ></textarea>
              {errors.bio && <div className="invalid-feedback">{errors.bio}</div>}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">Save</button>
          <button 
            type="button" 
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/lecture-management')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LecturerForm;