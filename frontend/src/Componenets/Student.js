import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FaEdit, FaTrash, FaPlus, FaDownload, FaSearch } from 'react-icons/fa';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    id: '',
    studentname: '',
    department: '',
    email: '',
    phone: '',
    intake_year: '',
    status: 'active'
  });

  const navigate = useNavigate();

  const validDepartments = [
    'Computer Science',
    'Network Engineering',
    'Software Engineering',
    'Cyber Security',
    'Interactive Media',
    'Data Science',
    'Information Technology'
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
    { value: 'suspended', label: 'Suspended' }
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/students');
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/students/${id}`, {
      method: 'DELETE',
    });
    fetchStudents();
  };

  const handleUpdateForm = (student) => {
    setSelectedStudent(student);
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const updatedStudent = {
      studentname: selectedStudent.studentname,
      department: selectedStudent.department,
      email: selectedStudent.email,
      phone: selectedStudent.phone,
      intake_year: selectedStudent.intake_year,
      status: selectedStudent.status
    };

    await fetch(`http://127.0.0.1:8000/api/students/${selectedStudent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStudent),
    });

    setShowUpdateForm(false);
    fetchStudents();
  };

  const filteredStudents = students.filter((student) => {
    const matchesName = student.studentname.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = searchYear === '' || student.intake_year.toString() === searchYear;
    const matchesDepartment = searchDepartment === '' || student.department === searchDepartment;
    const matchesEmail = searchEmail === '' || student.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchesPhone = searchPhone === '' || student.phone.includes(searchPhone);
    const matchesStatus = searchStatus === '' || student.status === searchStatus;
    
    return matchesName && matchesYear && matchesDepartment && matchesEmail && matchesPhone && matchesStatus;
  });

  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Student List Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Total Students: ${filteredStudents.length}`, 20, 30);
    
    if (searchQuery || searchYear || searchDepartment || searchEmail || searchPhone || searchStatus) {
      doc.text('Search Criteria:', 20, 40);
      let yPos = 50;
      if (searchQuery) doc.text(`Name: ${searchQuery}`, 20, yPos);
      if (searchYear) doc.text(`Year: ${searchYear}`, 20, searchQuery ? yPos + 10 : yPos);
      if (searchDepartment) doc.text(`Department: ${searchDepartment}`, 20, (searchQuery || searchYear) ? yPos + 20 : yPos);
      if (searchEmail) doc.text(`Email: ${searchEmail}`, 20, (searchQuery || searchYear || searchDepartment) ? yPos + 30 : yPos);
      if (searchPhone) doc.text(`Phone: ${searchPhone}`, 20, (searchQuery || searchYear || searchDepartment || searchEmail) ? yPos + 40 : yPos);
      if (searchStatus) doc.text(`Status: ${searchStatus}`, 20, (searchQuery || searchYear || searchDepartment || searchEmail || searchPhone) ? yPos + 50 : yPos);
      yPos += 60;
    }

    doc.text('Student List:', 20, searchQuery || searchYear || searchDepartment || searchEmail || searchPhone || searchStatus ? 110 : 50);
    
    filteredStudents.forEach((student, index) => {
      doc.text(
        `${index + 1}. ${student.studentname} - ${student.department} - ${student.email} - ${student.phone} - ${student.intake_year} - ${student.status || 'active'}`,
        20,
        (searchQuery || searchYear || searchDepartment || searchEmail || searchPhone || searchStatus ? 120 : 60) + index * 10
      );
    });

    doc.save('student_report.pdf');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSearchYear('');
    setSearchDepartment('');
    setSearchEmail('');
    setSearchPhone('');
    setSearchStatus('');
  };

  // Updated styles to accommodate additional filters
  const styles = {
    outerContainer: {
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '20px 0',
    },
    container: {
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '30px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      fontFamily: '"Poppins", sans-serif',
      position: 'relative',
    },
    heading: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: '600',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    searchForm: {
      marginBottom: '30px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    input: {
      padding: '12px',
      fontSize: '1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      width: '180px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    select: {
      padding: '12px',
      fontSize: '1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      width: '200px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#3498db',
      color: 'white',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    resetButton: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#95a5a6',
      color: 'white',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    buttonHover: {
      backgroundColor: '#2980b9',
    },
    resetButtonHover: {
      backgroundColor: '#7f8c8d',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '16px',
      textAlign: 'left',
      fontWeight: '600',
    },
    tableRow: {
      borderBottom: '1px solid #eee',
      transition: 'background-color 0.3s ease',
    },
    tableRowHover: {
      backgroundColor: 'rgba(241, 241, 241, 0.9)',
    },
    tableCell: {
      padding: '16px',
      color: '#333',
    },
    statusActive: {
      color: '#2ecc71',
      fontWeight: 'bold',
    },
    statusInactive: {
      color: '#e74c3c',
      fontWeight: 'bold',
    },
    statusGraduated: {
      color: '#9b59b6',
      fontWeight: 'bold',
    },
    statusSuspended: {
      color: '#f39c12',
      fontWeight: 'bold',
    },
    actionsCell: {
      display: 'flex',
      gap: '10px',
    },
    updateButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      backgroundColor: '#3498db',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'background-color 0.3s ease',
    },
    deleteButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      backgroundColor: '#e74c3c',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'background-color 0.3s ease',
    },
    addButtonContainer: {
      textAlign: 'center',
      marginTop: '20px',
    },
    formContainer: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: showUpdateForm ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    form: {
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      width: '400px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    },
    formInput: {
      marginBottom: '20px',
      padding: '12px',
      width: '100%',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    formButton: {
      padding: '12px 24px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      width: '100%',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    studentCount: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '1.2rem',
      color: '#555',
      fontWeight: '500',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '10px',
      borderRadius: '8px',
    },
    searchSection: {
      backgroundColor: 'rgba(248, 249, 250, 0.9)',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    searchTitle: {
      textAlign: 'center',
      marginBottom: '15px',
      color: '#2c3e50',
      fontWeight: '500',
    },
    filterRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'inactive': return styles.statusInactive;
      case 'graduated': return styles.statusGraduated;
      case 'suspended': return styles.statusSuspended;
      default: return {};
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Student Management System</h1>

        <div style={styles.searchSection}>
          <h3 style={styles.searchTitle}>Search Students</h3>
          <div style={styles.filterRow}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name"
              style={styles.input}
            />
            
            <input
              type="number"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              placeholder="Search by Year"
              style={styles.input}
              min="1900"
              max={new Date().getFullYear()}
            />
            
            <select
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
              style={styles.select}
            >
              <option value="">All Departments</option>
              {validDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.filterRow}>
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by Email"
              style={styles.input}
            />
            
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Search by Phone"
              style={styles.input}
            />
            
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              style={styles.select}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={resetFilters}
              style={styles.resetButton}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.resetButtonHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#95a5a6'}
            >
              <FaSearch /> Reset Filters
            </button>
          </div>
        </div>

        <div style={styles.studentCount}>
          Total Students: {filteredStudents.length}
          {(searchQuery || searchYear || searchDepartment || searchEmail || searchPhone || searchStatus) && (
            <span> (Filtered from {students.length})</span>
          )}
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Department</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Phone</th>
              <th style={styles.tableHeader}>Intake Year</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  style={styles.tableRow}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={styles.tableCell}>{student.studentname}</td>
                  <td style={styles.tableCell}>{student.department}</td>
                  <td style={styles.tableCell}>{student.email}</td>
                  <td style={styles.tableCell}>{student.phone}</td>
                  <td style={styles.tableCell}>{student.intake_year}</td>
                  <td style={{...styles.tableCell, ...getStatusStyle(student.status)}}>
                    {student.status || 'active'}
                  </td>
                  <td style={styles.actionsCell}>
                    <button
                      onClick={() => handleUpdateForm(student)}
                      style={styles.updateButton}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      style={styles.deleteButton}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ ...styles.tableCell, textAlign: 'center' }}>
                  No students found {searchQuery || searchYear || searchDepartment || searchEmail || searchPhone || searchStatus ? 'matching your search criteria' : ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={styles.addButtonContainer}>
          <button
            onClick={() => navigate('/create')}
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            <FaPlus /> Add Student
          </button>
        </div>

        <div style={styles.addButtonContainer}>
          <button
            onClick={generatePDFReport}
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            <FaDownload /> Download Report (PDF)
          </button>
        </div>
        <>
      <button 
        style={{ ...styles.button, marginTop: '10px', backgroundColor: '#e67e22' }} 
        onClick={() => navigate('/adminmed')}
      >
        <FaSearch /> Absent Students
      </button>
    </>

        <div style={styles.formContainer}>
          <div style={styles.form}>
            <h2>Update Student</h2>
            <form onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                name="studentname"
                value={selectedStudent.studentname}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, studentname: e.target.value })}
                placeholder="Name"
                style={styles.formInput}
                required
              />
              <select
                name="department"
                value={selectedStudent.department}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, department: e.target.value })}
                style={styles.formInput}
                required
              >
                <option value="">Select Department</option>
                {validDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="email"
                name="email"
                value={selectedStudent.email}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                placeholder="Email"
                style={styles.formInput}
                required
              />
              <input
                type="text"
                name="phone"
                value={selectedStudent.phone}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
                placeholder="Phone"
                style={styles.formInput}
                required
              />
              <input
                type="number"
                name="intake_year"
                value={selectedStudent.intake_year}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, intake_year: e.target.value })}
                placeholder="Intake Year"
                style={styles.formInput}
                min="1900"
                max={new Date().getFullYear()}
                required
              />
              <select
                name="status"
                value={selectedStudent.status || 'active'}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, status: e.target.value })}
                style={styles.formInput}
              >
                {statusOptions.filter(opt => opt.value !== '').map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                type="submit"
                style={styles.formButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;