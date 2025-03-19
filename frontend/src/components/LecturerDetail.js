import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLecturer } from '../services/api';

const LecturerDetail = () => {
  const { id } = useParams();
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLecturer();
  }, [id]);

  const fetchLecturer = async () => {
    try {
      const response = await getLecturer(id);
      setLecturer(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load lecturer data');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!lecturer) return <div className="alert alert-warning">Lecturer not found</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2>Lecturer Details</h2>
          <div>
          <Link to="/lecture-management" className="btn btn-secondary me-2">
              Back to List
            </Link>
            <Link to={`/lecturers/${id}/edit`} className="btn btn-warning">
              Edit
            </Link>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              {lecturer.profile_photo ? (
                <img 
                  src={`http://localhost:8000/storage/${lecturer.profile_photo}`}
                  alt={lecturer.name}
                  className="img-fluid rounded-circle"
                  style={{ maxHeight: '250px' }}
                />
              ) : (
                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '200px', height: '200px', margin: '0 auto' }}>
                  <span className="display-4">{lecturer.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="col-md-8">
              <h3>{lecturer.name}</h3>
              <p className="text-muted">{lecturer.qualification}</p>
              
              <div className="mb-3">
                <strong>Department:</strong> {lecturer.department}
              </div>
              
              <div className="mb-3">
                <strong>Email:</strong> {lecturer.email}
              </div>
              
              {lecturer.phone && (
                <div className="mb-3">
                  <strong>Phone:</strong> {lecturer.phone}
                </div>
              )}
              
              {lecturer.bio && (
                <div className="mb-3">
                  <strong>Bio:</strong>
                  <p className="mt-2">{lecturer.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetail;