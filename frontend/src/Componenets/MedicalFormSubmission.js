// resources/js/components/MedicalFormSubmission.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

// Reusable Alert Message component
const MessageAlert = ({ message }) => {
    if (!message.text) return null;

    const alertClasses = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    };

    return (
        <div
            className={`border px-4 py-3 rounded relative mb-4 shadow-md ${
                alertClasses[message.type] || 'bg-blue-100 border-blue-400 text-blue-700'
            }`}
            role="alert"
        >
            <span className="block sm:inline font-medium">{message.text}</span>
        </div>
    );
};

const MedicalFormSubmission = ({ studentId }) => {
    const [formData, setFormData] = useState({
        exam_name: '',
        exam_date: '',
        medical_reason: '',
        medical_document: null,
    });
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState({ submissions: false, form: false });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (studentId) fetchSubmissions();
        else {
            setMessage({ text: 'Student ID is missing. Please login again.', type: 'error' });
        }
    }, [studentId]);

    const fetchSubmissions = async () => {
        setIsLoading(prev => ({ ...prev, submissions: true }));
        setMessage({ text: '', type: '' });
        try {
            const { data } = await axios.get(`/students/${studentId}/medical-forms`);
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setMessage({ text: 'Failed to load submissions. Please try again later.', type: 'error' });
        } finally {
            setIsLoading(prev => ({ ...prev, submissions: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, medical_document: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(prev => ({ ...prev, form: true }));
        setMessage({ text: '', type: '' });

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });
        data.append('student_id', studentId);

        try {
            await axios.post('/medical-forms', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage({ text: 'Form submitted successfully!', type: 'success' });
            setFormData({ exam_name: '', exam_date: '', medical_reason: '', medical_document: null });
            await fetchSubmissions();
        } catch (error) {
            console.error('Submission error:', error);
            let errorMessage = 'Error submitting form. Please try again.';
            if (error.response?.status === 422) errorMessage = 'Validation error. Please check your inputs.';
            if (error.response?.status === 413) errorMessage = 'File size too large. Max 2MB allowed.';
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsLoading(prev => ({ ...prev, form: false }));
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Medical Absentee Form</h2>

            <MessageAlert message={message} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Exam Name</label>
                        <input
                            type="text"
                            name="exam_name"
                            value={formData.exam_name}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                            disabled={isLoading.form}
                            placeholder="Enter exam name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Exam Date</label>
                        <input
                            type="date"
                            name="exam_date"
                            value={formData.exam_date}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                            disabled={isLoading.form}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Medical Reason</label>
                        <textarea
                            name="medical_reason"
                            value={formData.medical_reason}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            rows="4"
                            required
                            disabled={isLoading.form}
                            placeholder="Describe your medical reason"
                        ></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Medical Document (PDF/JPG/PNG)</label>
                        <input
                            type="file"
                            name="medical_document"
                            onChange={handleFileChange}
                            className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            disabled={isLoading.form}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading.form}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:bg-blue-300"
                >
                    {isLoading.form ? (
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z" />
                            </svg>
                            <span>Submitting...</span>
                        </div>
                    ) : 'Submit Form'}
                </button>
            </form>

            {/* Submissions Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Previous Submissions</h3>

                {isLoading.submissions ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
                    </div>
                ) : submissions.length === 0 ? (
                    <p className="text-gray-500 text-center">No submissions found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-6 border-b text-left text-gray-600 font-bold">Exam Name</th>
                                    <th className="py-3 px-6 border-b text-left text-gray-600 font-bold">Exam Date</th>
                                    <th className="py-3 px-6 border-b text-left text-gray-600 font-bold">Submission Date</th>
                                    <th className="py-3 px-6 border-b text-left text-gray-600 font-bold">Status</th>
                                    <th className="py-3 px-6 border-b text-left text-gray-600 font-bold">Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-6 border-b">{submission.exam_name}</td>
                                        <td className="py-3 px-6 border-b">{submission.exam_date}</td>
                                        <td className="py-3 px-6 border-b">
                                            {submission.submission_date ? new Date(submission.submission_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className={`py-3 px-6 border-b font-semibold ${
                                            submission.status === 'approved' ? 'text-green-600' :
                                            submission.status === 'rejected' ? 'text-red-600' :
                                            'text-yellow-600'
                                        }`}>
                                            {submission.status?.charAt(0).toUpperCase() + submission.status?.slice(1)}
                                        </td>
                                        <td className="py-3 px-6 border-b">
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
