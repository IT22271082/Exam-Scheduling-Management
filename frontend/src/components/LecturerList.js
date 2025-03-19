import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLecturers, deleteLecturer } from '../services/api';

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await getLecturers();
      setLecturers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load lecturers');
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await deleteLecturer(id);
        setLecturers(lecturers.filter(lecturer => lecturer.id !== id));
      } catch (err) {
        setError('Failed to delete lecturer');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lecturers</h2>
        <Link to="/lecturers/create" className="btn btn-primary">
          Add New Lecturer
        </Link>
      </div>

      {lecturers.length === 0 ? (
        <div className="alert alert-info">No lecturers found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
              <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Qualification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map(lecturer => (
                <tr key={lecturer.id}>
                  <td>{lecturer.id}</td>
                  <td>{lecturer.name}</td>
                  <td>{lecturer.email}</td>
                  <td>{lecturer.department}</td>
                  <td>{lecturer.qualification}</td>
                  <td>
                    <Link to={`/lecturers/${lecturer.id}`} className="btn btn-info btn-sm me-2">
                      View
                    </Link>
                    <Link to={`/lecturers/${lecturer.id}/edit`} className="btn btn-warning btn-sm me-2">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(lecturer.id)} 
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LecturerList;