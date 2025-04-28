import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaList } from 'react-icons/fa';

const StudentCreate = () => {
  const [student, setStudent] = useState({
    studentname: '',
    department: '',
    email: '',
    phone: '',
    intake_year: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState([]);
  const [existingPhones, setExistingPhones] = useState([]);

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

  // Fetch existing emails and phones when component mounts
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/students');
        if (response.ok) {
          const data = await response.json();
          setExistingEmails(data.map(student => student.email.toLowerCase()));
          setExistingPhones(data.map(student => student.phone));
        }
      } catch (error) {
        console.error("Error fetching existing student data:", error);
      }
    };
    fetchExistingData();
  }, []);

  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    // Name validation
    if (!student.studentname.trim()) {
      errors.studentname = 'Name is required';
    } else if (!/^[A-Za-z\s]{2,100}$/.test(student.studentname)) {
      errors.studentname = 'Name must be 2-100 letters and spaces only';
    }

    // Department validation
    if (!student.department.trim()) {
      errors.department = 'Department is required';
    } else if (!validDepartments.includes(student.department)) {
      errors.department = `Department must be one of: ${validDepartments.join(', ')}`;
    }

    // Email validation
    if (!student.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      errors.email = 'Invalid email format';
    } else if (existingEmails.includes(student.email.toLowerCase())) {
      errors.email = 'Email already exists';
    }

    // Phone validation
    if (!student.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^(\+\d{1,3})?\d{10}$/.test(student.phone)) {
      errors.phone = 'Phone must be 10 digits (e.g., 1234567890 or +911234567890)';
    } else if (existingPhones.includes(student.phone)) {
      errors.phone = 'Phone number already exists';
    }

    // Intake year validation
    if (!student.intake_year) {
      errors.intake_year = 'Intake year is required';
    } else if (student.intake_year < 1900 || student.intake_year > currentYear) {
      errors.intake_year = `Year must be between 1900 and ${currentYear}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          setValidationErrors(data.errors);
        } else {
          throw new Error(data.message || 'Failed to add student');
        }
      } else {
        alert('Student added successfully!');
        setStudent({
          studentname: '',
          department: '',
          email: '',
          phone: '',
          intake_year: '',
        });
        // Update existing emails and phones
        setExistingEmails(prev => [...prev, data.email.toLowerCase()]);
        setExistingPhones(prev => [...prev, data.phone]);
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Student</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <input
            type="text"
            name="studentname"
            value={student.studentname}
            onChange={handleChange}
            placeholder="Student Name"
            style={styles.input}
          />
          {validationErrors.studentname && <div style={styles.error}>{validationErrors.studentname}</div>}
        </div>

        <div>
          <select
            name="department"
            value={student.department}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Department</option>
            {validDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {validationErrors.department && <div style={styles.error}>{validationErrors.department}</div>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            placeholder="Email"
            style={styles.input}
          />
          {validationErrors.email && <div style={styles.error}>{validationErrors.email}</div>}
        </div>

        <div>
          <input
            type="text"
            name="phone"
            value={student.phone}
            onChange={handleChange}
            placeholder="Phone (10 digits)"
            style={styles.input}
          />
          {validationErrors.phone && <div style={styles.error}>{validationErrors.phone}</div>}
        </div>

        <div>
          <input
            type="number"
            name="intake_year"
            value={student.intake_year}
            onChange={handleChange}
            placeholder={`Intake Year (1900-${new Date().getFullYear()})`}
            style={styles.input}
          />
          {validationErrors.intake_year && <div style={styles.error}>{validationErrors.intake_year}</div>}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          type="submit"
          style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          disabled={loading}
          onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        >
          <FaPlus /> {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>

      <button
        onClick={() => navigate('/student')}
        style={styles.watchButton}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.watchButtonHover.backgroundColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.watchButton.backgroundColor}
      >
        <FaList /> Watch Student List
      </button>
    </div>
  );
};

// Your EXACT original styles object
const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    fontFamily: '"Poppins", sans-serif',
  },
  heading: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#3498db',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
    transform: 'scale(1.05)',
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    cursor: 'not-allowed',
  },
  watchButton: {
    padding: '12px 20px',
    backgroundColor: '#1abc9c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 8px rgba(26, 188, 156, 0.3)',
  },
  watchButtonHover: {
    backgroundColor: '#16a085',
    transform: 'scale(1.05)',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default StudentCreate;