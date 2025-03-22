import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLecturers, deleteLecturer } from '../services/api';

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentCounts, setDepartmentCounts] = useState({});

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await getLecturers();
      setLecturers(response.data);
      calculateDepartmentCounts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load lecturers');
      setLoading(false);
      console.error(err);
    }
  };

  const calculateDepartmentCounts = (lecturers) => {
    const counts = lecturers.reduce((acc, lecturer) => {
      acc[lecturer.department] = (acc[lecturer.department] || 0) + 1;
      return acc;
    }, {});
    setDepartmentCounts(counts);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await deleteLecturer(id);
        const updatedLecturers = lecturers.filter(lecturer => lecturer.id !== id);
        setLecturers(updatedLecturers);
        calculateDepartmentCounts(updatedLecturers);
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
      {/* Top Header Bar */}
      <div 
        className="p-3 text-white d-flex justify-content-between align-items-center"
        style={{ backgroundColor: '#003366', borderRadius: '8px' }}
      >
        <h2 className="m-0">Lecturers</h2>
        <div>
          <Link to="/lecturers/create" className="btn btn-success me-2">
            + Add New Lecturer
          </Link>
          <Link to="/lecturers/summary" className="btn btn-info">
            📊 Generate Summary Report
          </Link>
        </div>
      </div>

      {/* Total Lecturers and Department Count Cards */}
      <div className="row mt-3">
        {/* Total Lecturers Card */}
        <div className="col-md-4">
          <div 
            className="card text-center p-3 shadow-sm"
            style={{ backgroundColor: '#004080', color: 'white', borderRadius: '8px' }}
          >
            <h4>Total Lecturers</h4>
            <h2>{lecturers.length}</h2>
          </div>
        </div>

        {/* Lecturers by Department */}
        <div className="col-md-8">
          <div className="card p-3 shadow-sm" style={{ borderRadius: '8px' }}>
            <h5>Lecturers by Department</h5>
            <ul className="list-group list-group-flush">
              {Object.entries(departmentCounts).map(([department, count]) => (
                <li 
                  key={department} 
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {department} 
                  <span className="badge rounded-pill" style={{ backgroundColor: '#007BFF', color: 'white' }}>
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lecturer Table */}
      {lecturers.length === 0 ? (
        <div className="alert alert-info text-center mt-3">No lecturers found</div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead style={{ backgroundColor: '#003366', color: 'white' }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Qualification</th>
                <th className="text-center">Actions</th>
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
                  <td className="text-center">
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
