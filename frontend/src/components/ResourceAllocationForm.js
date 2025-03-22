import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResourceAllocationForm = () => {
    const { id } = useParams(); // Get the resource ID from the URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        resource_name: '',
        resource_type: '',
        exam_id: '',
        allocation_date: '',
        duration: '',
        status: 'available',
    });
    const [errors, setErrors] = useState({}); // State for validation errors
    const [error, setError] = useState(''); // State for API errors
    const [loading, setLoading] = useState(false);

    // API base URL
    const API_BASE_URL = 'http://localhost:8000/api/resource-allocations';

    // Fetch resource data for editing
    useEffect(() => {
        if (id) {
            fetchResource();
        }
    }, [id]);

    const fetchResource = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            // Format the data for the form
            const resourceData = {...response.data};
            
            // Ensure all string fields are empty strings instead of null
            resourceData.resource_name = resourceData.resource_name || '';
            resourceData.resource_type = resourceData.resource_type || '';
            resourceData.exam_id = resourceData.exam_id || '';
            resourceData.status = resourceData.status || 'available';
            
            // Handle the date field
            if (resourceData.allocation_date) {
                const date = new Date(resourceData.allocation_date);
                resourceData.allocation_date = date.toISOString().slice(0, 16);
            } else {
                resourceData.allocation_date = '';
            }
            
            // Ensure duration is a string (for the input)
            resourceData.duration = resourceData.duration ? String(resourceData.duration) : '';
            
            setFormData(resourceData);
        } catch (error) {
            console.error('Error fetching resource:', error);
            setError('Failed to fetch resource. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Validate form data
    const validateForm = () => {
        const newErrors = {};

        // Validate resource name
        if (!formData.resource_name.trim()) {
            newErrors.resource_name = 'Resource name is required.';
        } else if (formData.resource_name.trim().length < 3) {
            newErrors.resource_name = 'Resource name must be at least 3 characters.';
        }

        // Validate resource type
        if (!formData.resource_type.trim()) {
            newErrors.resource_type = 'Resource type is required.';
        } else if (formData.resource_type.trim().length < 3) {
            newErrors.resource_type = 'Resource type must be at least 3 characters.';
        }

        // Validate exam ID
        if (!formData.exam_id.trim()) {
            newErrors.exam_id = 'Exam ID is required.';
        }

        // Validate allocation date
        if (!formData.allocation_date) {
            newErrors.allocation_date = 'Allocation date is required.';
        } else if (new Date(formData.allocation_date) < new Date()) {
            newErrors.allocation_date = 'Allocation date cannot be in the past.';
        }

        // Validate duration
        if (!formData.duration) {
            newErrors.duration = 'Duration is required.';
        } else if (parseInt(formData.duration) < 1) {
            newErrors.duration = 'Duration must be at least 1 minute.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form data
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        setLoading(true);
        try {
            let response;
            // Create a copy of the form data to avoid modifying the state directly
            const formattedData = { ...formData };

            // Ensure the duration is a number when sending to API
            formattedData.duration = parseInt(formattedData.duration);

            // Only format the date if it's not already an ISO string
            if (formattedData.allocation_date && !formattedData.allocation_date.endsWith('Z')) {
                formattedData.allocation_date = new Date(formattedData.allocation_date).toISOString();
            }

            // Log the data being sent for debugging
            console.log('Sending data:', formattedData);

            if (id) {
                // Update existing resource
                response = await axios.put(`${API_BASE_URL}/${id}`, formattedData);
            } else {
                // Create new resource
                response = await axios.post(API_BASE_URL, formattedData);
            }

            console.log('Response:', response);

            if (response.status === 200 || response.status === 201) {
                navigate('/resource/list'); // Redirect to the list after saving
            } else {
                setError(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving resource:', error);
            if (error.response) {
                setError(`Failed to save resource: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                setError('No response from server. Please check your network connection.');
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Styles
    const styles = {
        container: {
            maxWidth: '500px',
            margin: '20px auto',
            padding: '30px',
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            fontFamily: '"Arial", sans-serif'
        },
        heading: {
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '20px',
            textAlign: 'center'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: '#555',
            fontWeight: '500'
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            marginBottom: '10px',
            transition: 'border-color 0.3s ease'
        },
        inputError: {
            borderColor: '#e74c3c'
        },
        errorMessage: {
            color: '#e74c3c',
            fontSize: '0.9rem',
            marginBottom: '10px'
        },
        select: {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            marginBottom: '10px',
            transition: 'border-color 0.3s ease'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            marginTop: '20px'
        },
        button: {
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.3s ease'
        },
        cancelButton: {
            backgroundColor: '#6c757d',
            color: 'white'
        },
        saveButton: {
            backgroundColor: '#28a745',
            color: 'white'
        },
        disabledButton: {
            opacity: 0.7,
            cursor: 'not-allowed'
        },
        buttonHover: {
            transform: 'translateY(-2px)'
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>{id ? 'Edit Resource' : 'Add Resource'}</h2>
            {error && <div style={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={styles.label}>Resource Name:</label>
                    <input
                        type="text"
                        name="resource_name"
                        value={formData.resource_name}
                        onChange={handleInputChange}
                        style={{ ...styles.input, ...(errors.resource_name ? styles.inputError : {}) }}
                    />
                    {errors.resource_name && <div style={styles.errorMessage}>{errors.resource_name}</div>}
                </div>
                <div>
                    <label style={styles.label}>Resource Type:</label>
                    <input
                        type="text"
                        name="resource_type"
                        value={formData.resource_type}
                        onChange={handleInputChange}
                        style={{ ...styles.input, ...(errors.resource_type ? styles.inputError : {}) }}
                    />
                    {errors.resource_type && <div style={styles.errorMessage}>{errors.resource_type}</div>}
                </div>
                <div>
                    <label style={styles.label}>Exam ID:</label>
                    <input
                        type="text"
                        name="exam_id"
                        value={formData.exam_id}
                        onChange={handleInputChange}
                        style={{ ...styles.input, ...(errors.exam_id ? styles.inputError : {}) }}
                    />
                    {errors.exam_id && <div style={styles.errorMessage}>{errors.exam_id}</div>}
                </div>
                <div>
                    <label style={styles.label}>Allocation Date:</label>
                    <input
                        type="datetime-local"
                        name="allocation_date"
                        value={formData.allocation_date}
                        onChange={handleInputChange}
                        style={{ ...styles.input, ...(errors.allocation_date ? styles.inputError : {}) }}
                    />
                    {errors.allocation_date && <div style={styles.errorMessage}>{errors.allocation_date}</div>}
                </div>
                <div>
                    <label style={styles.label}>Duration (minutes):</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        style={{ ...styles.input, ...(errors.duration ? styles.inputError : {}) }}
                    />
                    {errors.duration && <div style={styles.errorMessage}>{errors.duration}</div>}
                </div>
                <div>
                    <label style={styles.label}>Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        style={styles.select}
                    >
                        <option value="available">Available</option>
                        <option value="allocated">Allocated</option>
                    </select>
                </div>
                <div style={styles.buttonContainer}>
                    <button
                        type="button"
                        onClick={() => navigate('/resource/list')}
                        style={{ ...styles.button, ...styles.cancelButton }}
                        onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
                        onMouseOut={(e) => e.target.style.transform = 'none'}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ 
                            ...styles.button, 
                            ...styles.saveButton,
                            ...(loading ? styles.disabledButton : {})
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.transform = styles.buttonHover.transform)}
                        onMouseOut={(e) => !loading && (e.target.style.transform = 'none')}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResourceAllocationForm;