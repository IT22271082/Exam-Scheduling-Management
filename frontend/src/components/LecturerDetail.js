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

  // Function to generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Define badge color based on lecturer type
  const getBadgeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'full-time': return 'bg-success';
      case 'part-time': return 'bg-warning text-dark';
      case 'visiting': return 'bg-info text-dark';
      case 'emeritus': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <div>{error}</div>
      </div>
    </div>
  );
  
  if (!lecturer) return (
    <div className="container mt-5">
      <div className="alert alert-warning d-flex align-items-center" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-question-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
        </svg>
        <div>Lecturer not found</div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4 mb-5">
  

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center p-4">
              {/* Avatar with initials using only Bootstrap */}
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                <span className="text-white fs-2 fw-medium">{getInitials(lecturer.name)}</span>
              </div>
              
              <h3 className="card-title mb-1">{lecturer.name}</h3>
              <p className="text-muted mb-2">{lecturer.qualification}</p>
              <span className={`badge ${getBadgeColor(lecturer.type)} mb-3`}>{lecturer.type}</span>
              
              <div className="d-grid gap-2 mt-4">
                <Link to={`/lecturers/${id}/edit`} className="btn btn-outline-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square me-2" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                  </svg>
                  Edit Lecturer
                </Link>
                <Link to="/lecture-management" className="btn btn-outline-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                  </svg>
                  Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0">Lecturer Information</h4>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="mb-4">
                    <h6 className="text-uppercase text-muted small mb-2">Department</h6>
                    <p className="mb-0 fs-5">{lecturer.department}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <h6 className="text-uppercase text-muted small mb-2">Lecturer ID</h6>
                    <p className="mb-0 fs-5">{lecturer.lecturer_id}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <h6 className="text-uppercase text-muted small mb-2">Email Address</h6>
                    <p className="mb-0">
                      <a href={`mailto:${lecturer.email}`} className="text-decoration-none">
                        {lecturer.email}
                      </a>
                    </p>
                  </div>
                </div>
                {lecturer.phone && (
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h6 className="text-uppercase text-muted small mb-2">Phone Number</h6>
                      <p className="mb-0">
                        <a href={`tel:${lecturer.phone}`} className="text-decoration-none">
                          {lecturer.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {lecturer.bio && (
                <div className="mt-2 pt-4 border-top">
                  <h6 className="text-uppercase text-muted small mb-3">Biography</h6>
                  <p className="mb-0">{lecturer.bio}</p>
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