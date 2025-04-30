// resources/js/components/MedicalFormSubmission.js

import axios from 'axios';
import React, { useState } from 'react';

const MedicalFormSubmission = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    icCopy: null,
    reason: '',
  });
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'icCopy') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.icCopy || !formData.reason) {
      setError('All fields are required');
      setMessage('');
      return;
    }
    const newSubmission = { ...formData, status: 'pending' };
    setSubmissions([...submissions, newSubmission]);
    setFormData({
      name: '',
      date: '',
      icCopy: null,
      reason: '',
    });
    setMessage('Submission successful');
    setError('');
  };

  return (
    <div className="container">
      {/* Embedded CSS */}
      <style>{`
        .container {
          max-width: 1200px;
          margin: auto;
          padding: 40px;
          font-family: 'Poppins', sans-serif;
          background: url('https://example.com/your-educational-image.jpg') no-repeat center center/cover;
          border-radius: 15px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        form {
          background: rgba(255, 255, 255, 0.8);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        input[type="text"],
        input[type="date"],
        input[type="file"],
        textarea {
          background: #f9f9f9;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
          width: 100%;
          font-size: 16px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        input:focus,
        textarea:focus {
          border-color: #4d91d4;
          box-shadow: 0 0 0 4px rgba(77, 145, 212, 0.2);
        }
        button[type="submit"] {
          background: linear-gradient(to right, #0073e6, #004bb5);
          color: white;
          font-weight: bold;
          border: none;
          padding: 14px 0;
          width: 100%;
          border-radius: 50px;
          transition: 0.4s;
          font-size: 18px;
          cursor: pointer;
        }
        button[type="submit"]:hover {
          background: linear-gradient(to right, #004bb5, #0073e6);
          box-shadow: 0px 8px 20px rgba(0, 115, 230, 0.4);
        }
        .success {
          background: #d1fae5;
          color: #047857;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: bold;
          text-align: center;
        }
        .error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: bold;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        thead {
          background: linear-gradient(to right, #2196f3, #1976d2);
          color: #ffffff;
        }
        th, td {
          padding: 14px 18px;
          border-bottom: 1px solid #e5e7eb;
          text-align: center;
          font-size: 16px;
        }
        tbody tr:hover {
          background-color: #f1f5f9;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: bold;
          color: #fff;
        }
        .status-approved {
          background-color: #34d399;
        }
        .status-rejected {
          background-color: #f87171;
        }
        .status-pending {
          background-color: #fbbf24;
        }
      `}</style>

      {/* Success or Error Message */}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <input
          type="file"
          name="icCopy"
          onChange={handleChange}
        />
        <textarea
          name="reason"
          placeholder="Reason for absence"
          value={formData.reason}
          onChange={handleChange}
          rows="4"
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      {/* Submissions Table */}
      {submissions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, index) => (
              <tr key={index}>
                <td>{sub.name}</td>
                <td>{sub.date}</td>
                <td>{sub.reason}</td>
                <td>
                  <span className={`status-badge ${
                    sub.status === 'approved' ? 'status-approved' :
                    sub.status === 'rejected' ? 'status-rejected' :
                    'status-pending'
                  }`}>
                    {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MedicalFormSubmission;
