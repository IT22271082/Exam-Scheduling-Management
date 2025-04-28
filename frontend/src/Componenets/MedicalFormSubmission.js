// resources/js/components/MedicalFormSubmission.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const MedicalFormSubmission = ({ studentId }) => {
    const [formData, setFormData] = useState({
        exam_name: '',
        exam_date: '',
        medical_reason: '',
        medical_document: null,
    });
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState({
        submissions: false,
        form: false
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (studentId) {
            fetchSubmissions();
        } else {
            setMessage({
                text: 'Student ID is missing. Please login again.',
                type: 'error'
            });
        }
    }, [studentId]);

    const fetchSubmissions = async () => {
        setIsLoading(prev => ({ ...prev, submissions: true }));
        setMessage({ text: '', type: '' });
        
        try {
            const response = await axios.get(`/students/${studentId}/medical-forms`);
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setMessage({
                text: 'Failed to load submissions. Please try again later.',
                type: 'error'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, submissions: false }));
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            medical_document: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(prev => ({ ...prev, form: true }));
        setMessage({ text: '', type: '' });

        const data = new FormData();
        data.append('student_id', studentId);
        data.append('exam_name', formData.exam_name);
        data.append('exam_date', formData.exam_date);
        data.append('medical_reason', formData.medical_reason);
        if (formData.medical_document) {
            data.append('medical_document', formData.medical_document);
        }

        try {
            await axios.post('/medical-forms', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setMessage({
                text: 'Form submitted successfully!',
                type: 'success'
            });
            
            setFormData({
                exam_name: '',
                exam_date: '',
                medical_reason: '',
                medical_document: null,
            });
            
            // Refresh submissions after successful submission
            await fetchSubmissions();
        } catch (error) {
            console.error('Submission error:', error);
            
            let errorMessage = 'Error submitting form. Please try again.';
            if (error.response) {
                if (error.response.status === 422) {
                    errorMessage = 'Validation error: Please check your form inputs.';
                } else if (error.response.status === 413) {
                    errorMessage = 'File size too large. Maximum 2MB allowed.';
                }
            }
            
            setMessage({
                text: errorMessage,
                type: 'error'
            });
        } finally {
            setIsLoading(prev => ({ ...prev, form: false }));
        }
    };

    const MessageAlert = ({ message }) => {
        if (!message.text) return null;
        
        const alertClasses = {
            success: 'bg-green-100 border-green-400 text-green-700',
            error: 'bg-red-100 border-red-400 text-red-700',
            warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        };
        
        return (
            <div className={`${alertClasses[message.type] || 'bg-blue-100 border-blue-400 text-blue-700'} 
                border px-4 py-3 rounded relative mb-4`}
                role="alert">
                <span className="block sm:inline">{message.text}</span>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Medical Absentee Form</h2>
            
            <MessageAlert message={message} />
            
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Exam Name</label>
                        <input
                            type="text"
                            name="exam_name"
                            value={formData.exam_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading.form}
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-2">Exam Date</label>
                        <input
                            type="date"
                            name="exam_date"
                            value={formData.exam_date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading.form}
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block mb-2">Medical Reason</label>
                        <textarea
                            name="medical_reason"
                            value={formData.medical_reason}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="4"
                            required
                            disabled={isLoading.form}
                        ></textarea>
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block mb-2">Medical Document (PDF/JPG/PNG, max 2MB)</label>
                        <input
                            type="file"
                            name="medical_document"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            accept=".pdf,.jpg,.png"
                            required
                            disabled={isLoading.form}
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading.form}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isLoading.form ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : 'Submit Form'}
                </button>
            </form>
            
            <div>
                <h3 className="text-xl font-semibold mb-4">Your Previous Submissions</h3>
                {isLoading.submissions ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : submissions.length === 0 ? (
                    <p className="text-gray-500">No submissions found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Exam Name</th>
                                    <th className="py-2 px-4 border">Exam Date</th>
                                    <th className="py-2 px-4 border">Submission Date</th>
                                    <th className="py-2 px-4 border">Status</th>
                                    <th className="py-2 px-4 border">Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr key={submission.id}>
                                        <td className="py-2 px-4 border">{submission.exam_name}</td>
                                        <td className="py-2 px-4 border">{submission.exam_date}</td>
                                        <td className="py-2 px-4 border">
                                            {new Date(submission.submission_date).toLocaleDateString()}
                                        </td>
                                        <td className={`py-2 px-4 border ${
                                            submission.status === 'approved' ? 'text-green-600 font-semibold' :
                                            submission.status === 'rejected' ? 'text-red-600 font-semibold' : 
                                            'text-yellow-600 font-semibold'
                                        }`}>
                                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {submission.medical_document ? (
                                                <a 
                                                    href={`http://127.0.0.1:8000/storage/${submission.medical_document}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Document
                                                </a>
                                            ) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalFormSubmission;