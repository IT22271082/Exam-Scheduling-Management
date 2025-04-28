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
    const [isLoading, setIsLoading] = useState({ submissions: false, form: false });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (studentId) {
            fetchSubmissions();
        } else {
            setMessage({ text: 'Student ID is missing.', type: 'error' });
        }
    }, [studentId]);

    const fetchSubmissions = async () => {
        setIsLoading(prev => ({ ...prev, submissions: true }));
        try {
            const { data } = await axios.get(`/students/${studentId}/medical-forms`);
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setMessage({ text: 'Failed to load submissions.', type: 'error' });
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
            let errorMessage = 'Error submitting form.';
            if (error.response?.status === 422) errorMessage = 'Validation error.';
            if (error.response?.status === 413) errorMessage = 'File too large. Max 2MB.';
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsLoading(prev => ({ ...prev, form: false }));
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8">Submit Medical Absentee Form</h2>

            {/* Message Alert */}
            {message.text && (
                <div
                    className={`mb-6 text-center py-3 px-6 rounded-lg ${
                        message.type === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-3xl shadow-lg mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Exam Name</label>
                        <input
                            type="text"
                            name="exam_name"
                            value={formData.exam_name}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Enter exam name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Exam Date</label>
                        <input
                            type="date"
                            name="exam_date"
                            value={formData.exam_date}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Medical Reason</label>
                        <textarea
                            name="medical_reason"
                            value={formData.medical_reason}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                            rows="4"
                            placeholder="Describe the medical reason"
                            required
                        ></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Upload Medical Document</label>
                        <input
                            type="file"
                            name="medical_document"
                            onChange={handleFileChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading.form}
                    className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    {isLoading.form ? 'Submitting...' : 'Submit Form'}
                </button>
            </form>

            {/* Submissions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">Your Submissions</h3>

                {isLoading.submissions ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : submissions.length === 0 ? (
                    <p className="text-center text-gray-500">No submissions found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead className="bg-blue-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Exam Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Exam Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Submitted</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{sub.exam_name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{sub.exam_date}</td>
                                        <td className="border border-gray-300 px-4 py-2">{sub.submission_date ? new Date(sub.submission_date).toLocaleDateString() : '-'}</td>
                                        <td className="border border-gray-300 px-4 py-2 font-semibold">
                                            <span className={`px-3 py-1 rounded-full text-white ${
                                                sub.status === 'approved' ? 'bg-green-500' :
                                                sub.status === 'rejected' ? 'bg-red-500' :
                                                'bg-yellow-400'
                                            }`}>
                                                {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {sub.medical_document ? (
                                                <a
                                                    href={`http://127.0.0.1:8000/storage/${sub.medical_document}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View
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
