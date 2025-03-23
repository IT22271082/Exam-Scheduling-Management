import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLecturers, deleteLecturer } from '../services/api';

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [showSummaryReport, setShowSummaryReport] = useState(false);
  const [qualificationStats, setQualificationStats] = useState([]);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await getLecturers();
      setLecturers(response.data);
      calculateDepartmentCounts(response.data);
      calculateQualificationStats(response.data);
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

  const calculateQualificationStats = (lecturerData) => {
    const qualCounts = lecturerData.reduce((acc, lecturer) => {
      acc[lecturer.qualification] = (acc[lecturer.qualification] || 0) + 1;
      return acc;
    }, {});
    
    const qualStats = Object.entries(qualCounts).map(([qualification, count]) => ({
      qualification,
      count,
      percentage: ((count / lecturerData.length) * 100).toFixed(1)
    }));
    
    qualStats.sort((a, b) => b.count - a.count);
    setQualificationStats(qualStats);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await deleteLecturer(id);
        const updatedLecturers = lecturers.filter(lecturer => lecturer.id !== id);
        setLecturers(updatedLecturers);
        calculateDepartmentCounts(updatedLecturers);
        calculateQualificationStats(updatedLecturers);
      } catch (err) {
        setError('Failed to delete lecturer');
        console.error(err);
      }
    }
  };

  const toggleSummaryReport = () => {
    setShowSummaryReport(!showSummaryReport);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Lecturer ID,Name,Email,Department,Qualification\n";
    
    lecturers.forEach(lecturer => {
      csvContent += `${lecturer.id},${lecturer.name},${lecturer.email},${lecturer.department},${lecturer.qualification}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lecturers_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="p-3 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#003366', borderRadius: '8px' }}>
        <h2 className="m-0">Lecturers</h2>
        <div>
          <Link to="/lecturers/create" className="btn btn-success me-2">+ Add New Lecturer</Link>
          <button onClick={toggleSummaryReport} className="btn btn-info">
            {showSummaryReport ? '📋 Return to List' : '📊 Generate Summary Report'}
          </button>
        </div>
      </div>

      {!showSummaryReport ? (
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
              {lecturers.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No lecturers found</td></tr>
              ) : (
                lecturers.map(lecturer => (
                  <tr key={lecturer.id}>
                    <td>{lecturer.id}</td>
                    <td>{lecturer.name}</td>
                    <td>{lecturer.email}</td>
                    <td>{lecturer.department}</td>
                    <td>{lecturer.qualification}</td>
                    <td className="text-center">
                      <Link to={`/lecturers/${lecturer.id}`} className="btn btn-info btn-sm me-2">View</Link>
                      <Link to={`/lecturers/${lecturer.id}/edit`} className="btn btn-warning btn-sm me-2">Edit</Link>
                      <button onClick={() => handleDelete(lecturer.id)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4">
          <h3>Lecturer Summary Report</h3>
          <p>Generated on: {new Date().toLocaleDateString()}</p>
          <button onClick={handleExportCSV} className="btn btn-success">📥 Export CSV</button>
        </div>
      )}
    </div>
  );
};

export default LecturerList;
