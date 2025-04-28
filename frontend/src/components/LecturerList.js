import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLecturers, deleteLecturer } from '../services/api';
import './LecturerList.css'; 

const LecturerList = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [showSummaryReport, setShowSummaryReport] = useState(false);
  const [qualificationStats, setQualificationStats] = useState([]);
  const [totalLecturers, setTotalLecturers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    if (lecturers.length > 0) {
      calculateDepartmentCounts();
      calculateQualificationStats();
      setTotalLecturers(lecturers.length);
    }
  }, [lecturers]);

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

  const calculateDepartmentCounts = () => {
    const counts = {};
    lecturers.forEach(lecturer => {
      if (lecturer.department) {
        counts[lecturer.department] = (counts[lecturer.department] || 0) + 1;
      }
    });
    setDepartmentCounts(counts);
  };

  const calculateQualificationStats = () => {
    const qualCounts = {};
    lecturers.forEach(lecturer => {
      if (lecturer.qualification) {
        qualCounts[lecturer.qualification] = (qualCounts[lecturer.qualification] || 0) + 1;
      }
    });
    const qualStats = Object.entries(qualCounts).map(([qualification, count]) => ({
      qualification,
      count,
      percentage: ((count / lecturers.length) * 100).toFixed(1)
    }));
    qualStats.sort((a, b) => b.count - a.count);
    setQualificationStats(qualStats);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecturer?')) {
      try {
        await deleteLecturer(id);
        setLecturers(prevLecturers => prevLecturers.filter(lecturer => lecturer.id !== id));
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
    let csvContent = "data:text/csv;charset=utf-8,Name,Email,Phone Number,Department,Qualification,Lecturer_ID\n";
    lecturers.forEach(lecturer => {
      csvContent += `${lecturer.name},${lecturer.email},${lecturer.phone || ''},${lecturer.department},${lecturer.qualification},${lecturer.lecturer_id}\n`;
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

  const filteredLecturers = lecturers.filter(lecturer =>
    lecturer.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="header-section">
        <h2 className="m-0">Lecturers</h2>
        <div>
          <Link to="/lecturers/create" className="btn btn-success me-2">+ Add New Lecturer</Link>
          <button onClick={toggleSummaryReport} className="btn btn-info">
            {showSummaryReport ? '📋 Return to List' : '📊 Generate Summary Report'}
          </button>
        </div>
      </div>

      {!showSummaryReport ? (
        <>
          <div className="mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-hover">
              <thead className="table-header">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th>Lecturer ID</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLecturers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No lecturers found for "{searchTerm}"</td></tr>
                ) : (
                  filteredLecturers.map(lecturer => (
                    <tr key={lecturer.id}>
                      <td>{lecturer.name}</td>
                      <td>{lecturer.email}</td>
                      <td>{lecturer.department}</td>
                      <td>{lecturer.qualification}</td>
                      <td>{lecturer.lecturer_id}</td>
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
        </>
      ) : (
        <div className="mt-4">
          <h3>Lecturer Summary Report</h3>
          <p>Generated on: {new Date().toLocaleDateString()}</p>

          <div className="card mb-4">
            <div className="card-header summary-card-header-primary">
              <h5 className="m-0">Total Lecturers: {totalLecturers}</h5>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header summary-card-header-info">
                  <h5 className="m-0">Department Distribution</h5>
                </div>
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(departmentCounts).map(([department, count]) => (
                        <tr key={department}>
                          <td>{department}</td>
                          <td>{count}</td>
                          <td>{((count / totalLecturers) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header summary-card-header-success">
                  <h5 className="m-0">Qualification Statistics</h5>
                </div>
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Qualification</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualificationStats.map(stat => (
                        <tr key={stat.qualification}>
                          <td>{stat.qualification}</td>
                          <td>{stat.count}</td>
                          <td>{stat.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleExportCSV} className="btn btn-success">📥 Export CSV</button>
        </div>
      )}
    </div>
  );
};

export default LecturerList;
