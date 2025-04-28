import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaDownload, FaPlus, FaEye } from 'react-icons/fa';
import jsPDF from 'jspdf';

const MedicalFormsAdmin = () => {
  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Departments for form creation
  const departments = [
    'Computer Science',
    'Network Engineering',
    'Software Engineering',
    'Cyber Security',
    'Interactive Media',
    'Data Science',
    'Information Technology'
  ];

  // State management
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentForm, setCurrentForm] = useState({
    id: null,
    exam_name: '',
    exam_date: '',
    medical_reason: '',
    status: 'pending',
    student: {
      studentname: '',
      department: '',
      student_id: ''
    }
  });

  // Generate dummy data
  const generateDummyData = () => [
    { 
      id: 1, 
      exam_name: "Midterm Examinations", 
      exam_date: "2025-04-15", 
      medical_reason: "Severe migraine", 
      medical_document: "report1.pdf", 
      submission_date: "2025-04-14", 
      status: "pending", 
      student: { 
        studentname: "Jane Doe", 
        department: "Software Engineering", 
        student_id: "SE2023001" 
      } 
    },
    { 
      id: 2, 
      exam_name: "Database Systems Final", 
      exam_date: "2025-05-20", 
      medical_reason: "Fractured arm", 
      medical_document: "report2.pdf", 
      submission_date: "2025-05-19", 
      status: "approved", 
      student: { 
        studentname: "John Smith", 
        department: "Computer Science", 
        student_id: "CS2023002" 
      } 
    },
  ];

  // Fetch data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setForms(generateDummyData());
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter forms
  const filteredForms = forms.filter(form => {
    const matchesSearch = form.student.studentname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         form.exam_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Generate PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Medical Absentee Forms Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Forms: ${filteredForms.length}`, 20, 30);
    
    filteredForms.forEach((form, index) => {
      const yPos = 40 + index * 10;
      doc.text(
        `${index + 1}. ${form.student.studentname} - ${form.exam_name} - ${form.status}`,
        20,
        yPos
      );
    });

    doc.save('medical_forms_report.pdf');
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('student.')) {
      const studentField = name.split('.')[1];
      setCurrentForm({
        ...currentForm,
        student: {
          ...currentForm.student,
          [studentField]: value
        }
      });
    } else {
      setCurrentForm({
        ...currentForm,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (currentForm.id) {
      // Update existing form
      setForms(forms.map(form => 
        form.id === currentForm.id ? currentForm : form
      ));
    } else {
      // Add new form
      const newId = forms.length > 0 ? Math.max(...forms.map(f => f.id)) + 1 : 1;
      const newForm = {
        ...currentForm,
        id: newId,
        submission_date: new Date().toISOString().split('T')[0],
        medical_document: `report_${newId}.pdf`
      };
      setForms([...forms, newForm]);
    }
    setShowFormModal(false);
  };

  // Open form for editing
  const openEditForm = (form) => {
    setCurrentForm(form);
    setShowFormModal(true);
  };

  // Open form for viewing details
  const openDetailForm = (form) => {
    setCurrentForm(form);
    setShowDetailModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setForms(forms.filter(form => form.id !== id));
    }
  };

  // Get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return { color: '#2ecc71', fontWeight: 'bold' };
      case 'rejected': return { color: '#e74c3c', fontWeight: 'bold' };
      case 'pending': return { color: '#f39c12', fontWeight: 'bold' };
      default: return {};
    }
  };

  // Styles
  const styles = {
    outerContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
    },
    heading: {
      margin: '0',
      fontSize: '24px',
    },
    controls: {
      padding: '20px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      alignItems: 'center',
    },
    searchInput: {
      flex: '1',
      minWidth: '200px',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    select: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      minWidth: '150px',
    },
    button: {
      padding: '10px 15px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#3498db',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: 'none',
      },
    },
    resetButton: {
      backgroundColor: '#95a5a6',
    },
    tableContainer: {
      overflowX: 'auto',
      padding: '0 20px 20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
    },
    tableRow: {
      borderBottom: '1px solid #eee',
      '&:hover': {
        backgroundColor: '#f8f9fa',
      },
    },
    tableCell: {
      padding: '12px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '100%',
    },
    modalCloseButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '50%',
      cursor: 'pointer',
    },
    formField: {
      marginBottom: '15px',
    },
    formLabel: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    formInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    formTextarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      height: '100px',
    },
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.heading}>Medical Absentee Forms Management</h2>
        </header>

        <div style={styles.controls}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student or exam"
            style={styles.searchInput}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            style={styles.button}
            onClick={resetFilters}
          >
            Reset Filters
          </button>
          <button
            style={styles.button}
            onClick={() => setShowFormModal(true)}
          >
            <FaPlus /> Add New Form
          </button>
          <button
            style={styles.button}
            onClick={generatePDFReport}
          >
            <FaDownload /> Download Report
          </button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableCell}>Student</th>
                  <th style={styles.tableCell}>Exam</th>
                  <th style={styles.tableCell}>Date</th>
                  <th style={styles.tableCell}>Reason</th>
                  <th style={styles.tableCell}>Status</th>
                  <th style={styles.tableCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredForms.map(form => (
                  <tr key={form.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{form.student.studentname}</td>
                    <td style={styles.tableCell}>{form.exam_name}</td>
                    <td style={styles.tableCell}>{form.exam_date}</td>
                    <td style={styles.tableCell}>{form.medical_reason}</td>
                    <td style={{ ...styles.tableCell, ...getStatusStyle(form.status) }}>
                      {form.status}
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        style={styles.button}
                        onClick={() => openDetailForm(form)}
                      >
                        <FaEye />
                      </button>
                      <button
                        style={styles.button}
                        onClick={() => openEditForm(form)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        style={styles.button}
                        onClick={() => handleDelete(form.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add or Edit Form Modal */}
      {showFormModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              style={styles.modalCloseButton}
              onClick={() => setShowFormModal(false)}
            >
              X
            </button>
            <form onSubmit={handleFormSubmit}>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Student Name</label>
                <input
                  type="text"
                  name="student.studentname"
                  value={currentForm.student.studentname}
                  onChange={handleInputChange}
                  required
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Department</label>
                <select
                  name="student.department"
                  value={currentForm.student.department}
                  onChange={handleInputChange}
                  required
                  style={styles.formInput}
                >
                  {departments.map(department => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Exam Name</label>
                <input
                  type="text"
                  name="exam_name"
                  value={currentForm.exam_name}
                  onChange={handleInputChange}
                  required
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Exam Date</label>
                <input
                  type="date"
                  name="exam_date"
                  value={currentForm.exam_date}
                  onChange={handleInputChange}
                  required
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Medical Reason</label>
                <textarea
                  name="medical_reason"
                  value={currentForm.medical_reason}
                  onChange={handleInputChange}
                  required
                  style={styles.formTextarea}
                />
              </div>
              <button type="submit" style={styles.button}>
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              style={styles.modalCloseButton}
              onClick={() => setShowDetailModal(false)}
            >
              X
            </button>
            <h3>Form Details</h3>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Student Name</label>
              <p>{currentForm.student.studentname}</p>
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Department</label>
              <p>{currentForm.student.department}</p>
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Exam Name</label>
              <p>{currentForm.exam_name}</p>
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Exam Date</label>
              <p>{currentForm.exam_date}</p>
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Medical Reason</label>
              <p>{currentForm.medical_reason}</p>
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Status</label>
              <p>{currentForm.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalFormsAdmin;
