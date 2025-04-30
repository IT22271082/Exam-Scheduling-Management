import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaDownload, FaPlus, FaEye, FaTimes } from 'react-icons/fa';
import jsPDF from 'jspdf';

const MedicalFormsAdmin = () => {
  const styles = {
    wrapper: {
      padding: '30px',
      background: 'linear-gradient(to right, #74ebd5, #acb6e5)',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif",
    },
    header: {
      textAlign: 'center',
      color: '#fff',
      marginBottom: '30px',
    },
    controls: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      flex: 1,
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#3498db',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'all 0.3s ease',
    },
    table: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    th: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '15px',
      textAlign: 'left',
    },
    td: {
      padding: '15px',
      textAlign: 'left',
    },
    actionBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      marginRight: '10px',
    },
    badge: {
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      color: 'white',
    },
    badgePending: {
      backgroundColor: '#f39c12',
    },
    badgeApproved: {
      backgroundColor: '#2ecc71',
    },
    badgeRejected: {
      backgroundColor: '#e74c3c',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '500px',
      position: 'relative',
    },
    modalClose: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const departments = [
    'Computer Science', 'Network Engineering', 'Software Engineering',
    'Cyber Security', 'Interactive Media', 'Data Science', 'Information Technology'
  ];

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

  const generateDummyData = () => [
    { id: 1, exam_name: "Midterm Examinations", exam_date: "2025-04-15", medical_reason: "Severe migraine", medical_document: "report1.pdf", submission_date: "2025-04-14", status: "pending", student: { studentname: "Jane Doe", department: "Software Engineering", student_id: "SE2023001" } },
    { id: 2, exam_name: "Database Systems Final", exam_date: "2025-05-20", medical_reason: "Fractured arm", medical_document: "report2.pdf", submission_date: "2025-05-19", status: "approved", student: { studentname: "John Smith", department: "Computer Science", student_id: "CS2023002" } },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setForms(generateDummyData());
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.student.studentname.toLowerCase().includes(searchTerm.toLowerCase()) || form.exam_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Medical Absentee Forms Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Forms: ${filteredForms.length}`, 20, 30);
    filteredForms.forEach((form, index) => {
      const yPos = 40 + index * 10;
      doc.text(`${index + 1}. ${form.student.studentname} - ${form.exam_name} - ${form.status}`, 20, yPos);
    });
    doc.save('medical_forms_report.pdf');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('student.')) {
      const studentField = name.split('.')[1];
      setCurrentForm(prev => ({
        ...prev,
        student: { ...prev.student, [studentField]: value }
      }));
    } else {
      setCurrentForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentForm.id) {
      setForms(forms.map(form => form.id === currentForm.id ? currentForm : form));
    } else {
      const newId = forms.length > 0 ? Math.max(...forms.map(f => f.id)) + 1 : 1;
      const newForm = { ...currentForm, id: newId, submission_date: new Date().toISOString().split('T')[0], medical_document: `report_${newId}.pdf` };
      setForms([...forms, newForm]);
    }
    setShowFormModal(false);
  };

  const openEditForm = (form) => {
    setCurrentForm(form);
    setShowFormModal(true);
  };

  const openDetailForm = (form) => {
    setCurrentForm(form);
    setShowDetailModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setForms(forms.filter(form => form.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span style={{ ...styles.badge, ...styles.badgeApproved }}>Approved</span>;
    if (status === 'rejected') return <span style={{ ...styles.badge, ...styles.badgeRejected }}>Rejected</span>;
    return <span style={{ ...styles.badge, ...styles.badgePending }}>Pending</span>;
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1>Medical Absentee Forms</h1>
      </header>

      <div style={styles.controls}>
        <input style={styles.input} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by student or exam..." />
        <select style={styles.input} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          {statusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button style={styles.button} onClick={resetFilters}><FaSearch /> Reset</button>
        <button style={styles.button} onClick={() => setShowFormModal(true)}><FaPlus /> Add Form</button>
        <button style={styles.button} onClick={generatePDFReport}><FaDownload /> Download</button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Exam</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredForms.map(form => (
              <tr key={form.id}>
                <td style={styles.td}>{form.student.studentname}</td>
                <td style={styles.td}>{form.exam_name}</td>
                <td style={styles.td}>{form.exam_date}</td>
                <td style={styles.td}>{form.medical_reason}</td>
                <td style={styles.td}>{getStatusBadge(form.status)}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => openDetailForm(form)}><FaEye /></button>
                  <button style={styles.actionBtn} onClick={() => openEditForm(form)}><FaEdit /></button>
                  <button style={styles.actionBtn} onClick={() => handleDelete(form.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.modalClose} onClick={() => setShowFormModal(false)}><FaTimes /></button>
            <h2>{currentForm.id ? 'Edit Form' : 'Add New Form'}</h2>
            <form onSubmit={handleFormSubmit}>
              <input style={styles.input} name="student.studentname" value={currentForm.student.studentname} onChange={handleInputChange} placeholder="Student Name" required />
              <input style={styles.input} name="student.student_id" value={currentForm.student.student_id} onChange={handleInputChange} placeholder="Student ID" required />
              <select style={styles.input} name="student.department" value={currentForm.student.department} onChange={handleInputChange} required>
                <option value="">Select Department</option>
                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
              <input style={styles.input} name="exam_name" value={currentForm.exam_name} onChange={handleInputChange} placeholder="Exam Name" required />
              <input style={styles.input} type="date" name="exam_date" value={currentForm.exam_date} onChange={handleInputChange} required />
              <textarea style={{ ...styles.input, minHeight: '100px' }} name="medical_reason" value={currentForm.medical_reason} onChange={handleInputChange} placeholder="Medical Reason" required></textarea>
              <button type="submit" style={{ ...styles.button, backgroundColor: '#2ecc71', marginTop: '10px' }}>{currentForm.id ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.modalClose} onClick={() => setShowDetailModal(false)}><FaTimes /></button>
            <h2>Form Details</h2>
            <p><strong>Student:</strong> {currentForm.student.studentname}</p>
            <p><strong>ID:</strong> {currentForm.student.student_id}</p>
            <p><strong>Department:</strong> {currentForm.student.department}</p>
            <p><strong>Exam:</strong> {currentForm.exam_name}</p>
            <p><strong>Date:</strong> {currentForm.exam_date}</p>
            <p><strong>Reason:</strong> {currentForm.medical_reason}</p>
            <p><strong>Status:</strong> {currentForm.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalFormsAdmin;
