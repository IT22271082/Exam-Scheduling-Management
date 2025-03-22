import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StudentCreate = () => {
  const [student, setStudent] = useState({
    studentname: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);  // Reset error before submitting

    try {
      const response = await fetch('http://127.0.0.1:8000/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        alert('Student added successfully!');
        setStudent({ studentname: '', department: '' }); // Clear form
      } else {
        throw new Error('Failed to add student');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the student list page
  const handleWatchList = () => {
    navigate('/student');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Student</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="studentname"
          value={student.studentname}
          onChange={handleChange}
          placeholder="Student Name"
          style={styles.input}
        />
        <input
          type="text"
          name="department"
          value={student.department}
          onChange={handleChange}
          placeholder="Department"
          style={styles.input}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>

      {/* Watch Student List Button */}
      <button
        onClick={handleWatchList}
        style={styles.watchButton}
      >
        Watch Student List
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#f4f7fa',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Arial", sans-serif',
  },
  heading: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '15px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  watchButton: {
    padding: '12px 20px',
    backgroundColor: '#1abc9c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 8px rgba(26, 188, 156, 0.3)',
  },
  watchButtonHover: {
    backgroundColor: '#16a085',
    transform: 'scale(1.05)',
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
    cursor: 'not-allowed',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
};

export default StudentCreate;
