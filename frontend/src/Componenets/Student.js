import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import jsPDF from 'jspdf'; // Import jsPDF

const Student = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    id: '',
    studentname: '',
    department: '',
  });

  const navigate = useNavigate(); // Initialize navigate function

  // Fetch students from the API when the component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch students from the backend
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

  // Function to handle student deletion
  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/students/${id}`, {
      method: 'DELETE',
    });
    fetchStudents();
  };

  // Function to handle update form visibility and setting the selected student
  const handleUpdateForm = (student) => {
    setSelectedStudent(student);
    setShowUpdateForm(true);
  };

  // Function to handle the update form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const updatedStudent = {
      studentname: selectedStudent.studentname,
      department: selectedStudent.department,
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

  // Filter students based on the search query (by name)
  const filteredStudents = students.filter(
    (student) => student.studentname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to generate and download the PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Student List Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Total Students: ${filteredStudents.length}`, 20, 30);

    doc.text('Student List:', 20, 40);
    filteredStudents.forEach((student, index) => {
      doc.text(`${index + 1}. ${student.studentname} - ${student.department}`, 20, 50 + index * 10);
    });

    doc.save('student_report.pdf');
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '20px auto',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: '"Arial", sans-serif',
      position: 'relative',
    },
    heading: {
      fontSize: '1.8rem',
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center',
    },
    searchForm: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'center',
    },
    input: {
      padding: '10px',
      fontSize: '1rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
      marginRight: '10px',
    },
    button: {
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#28a745',
      color: 'white',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
    },
    tableRow: {
      borderBottom: '1px solid #eee',
      transition: 'background-color 0.3s ease',
    },
    tableRowHover: {
      backgroundColor: '#f9f9f9',
    },
    tableCell: {
      padding: '12px',
      color: '#333',
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
    },
    deleteButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      backgroundColor: '#e74c3c',
      color: 'white',
      cursor: 'pointer',
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: showUpdateForm ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
    },
    form: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '400px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    formInput: {
      marginBottom: '15px',
      padding: '10px',
      width: '100%',
      borderRadius: '6px',
      border: '1px solid #ccc',
    },
    formButton: {
      padding: '10px 20px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      width: '100%',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Student Page</h1>

      <form style={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Search</button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Department</th>
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
                <td style={styles.actionsCell}>
                  <button
                    onClick={() => handleUpdateForm(student)}
                    style={styles.updateButton}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={styles.tableCell}>No students found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={styles.addButtonContainer}>
        {/* Modify the Add button to navigate to the Create page */}
        <button
          onClick={() => navigate('/create')}
          style={styles.button}
        >
          Add Student
        </button>
      </div>

      <div style={styles.addButtonContainer}>
        {/* Generate Report Button */}
        <button
          onClick={generatePDFReport}
          style={styles.button}
        >
          Download Report (PDF)
        </button>
      </div>

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
            />
            <input
              type="text"
              name="department"
              value={selectedStudent.department}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, department: e.target.value })}
              placeholder="Department"
              style={styles.formInput}
            />
            <button type="submit" style={styles.formButton}>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Student;
