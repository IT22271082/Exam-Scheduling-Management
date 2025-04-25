import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResourceAllocationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        resource_name: '',
        resource_type: '',
        allocation_date: '',
        start_time: '',
        end_time: '',
        duration: 0,
        status: 'available',
        capacity: 30,
        exam_name: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});

    const API_BASE_URL = 'http://localhost:8000/api/resource-allocations';

    useEffect(() => {
        if (id) {
            fetchResource();
        } else {
            setFormData({
                resource_name: '',
                resource_type: '',
                allocation_date: '',
                start_time: '',
                end_time: '',
                duration: 0,
                status: 'available',
                capacity: 30,
                exam_name: '',
                notes: ''
            });
        }
    }, [id]);

    const fetchResource = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            const resourceData = response.data;
            
            // Format the date for the date input (YYYY-MM-DD)
            let formattedDate = '';
            if (resourceData.allocation_date) {
                const dateObj = new Date(resourceData.allocation_date);
                formattedDate = dateObj.toISOString().split('T')[0];
            }

            // Ensure time fields are properly formatted (HH:MM)
            const formatTime = (time) => {
                if (!time) return '';
                if (time.includes(':')) return time;
                // If time comes as "HHMM" format
                if (time.length === 4) {
                    return `${time.substring(0, 2)}:${time.substring(2)}`;
                }
                return time;
            };

            setFormData({
                ...resourceData,
                allocation_date: formattedDate,
                start_time: formatTime(resourceData.start_time) || '',
                end_time: formatTime(resourceData.end_time) || '',
                duration: resourceData.duration || calculateDuration(
                    formatTime(resourceData.start_time),
                    formatTime(resourceData.end_time)
                )
            });
            setError('');
        } catch (error) {
            console.error('Error fetching resource:', error);
            setError('Failed to fetch resource. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateTimeFormat = (time) => {
        if (!time) return false;
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    };

    const calculateDuration = (start, end) => {
        if (!start || !end || !validateTimeFormat(start) || !validateTimeFormat(end)) return 0;
        
        try {
            const [startHours, startMinutes] = start.split(':').map(Number);
            const [endHours, endMinutes] = end.split(':').map(Number);
            
            let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
            
            // Handle overnight durations (end time is next day)
            if (totalMinutes < 0) {
                totalMinutes += 24 * 60; // Add 24 hours
            }
            
            return totalMinutes;
        } catch (e) {
            console.error('Error calculating duration:', e);
            return 0;
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        
        if (name === 'start_time' || name === 'end_time') {
            if (value && !validateTimeFormat(value)) {
                setErrors(prev => ({ ...prev, [name]: 'Invalid time format (HH:MM)' }));
                return;
            }
            
            if (name === 'start_time' && formData.end_time) {
                const duration = calculateDuration(value, formData.end_time);
                setFormData(prev => ({ ...prev, duration }));
            } else if (name === 'end_time' && formData.start_time) {
                const duration = calculateDuration(formData.start_time, value);
                setFormData(prev => ({ ...prev, duration }));
            }
        }
        
        validateField(name, value);
    };

    const validateField = (fieldName, value) => {
        let errorMsg = '';
        
        switch (fieldName) {
            case 'resource_name':
                if (!value.trim()) errorMsg = 'Resource name is required';
                else if (value.length > 100) errorMsg = 'Name must be less than 100 characters';
                break;
            case 'resource_type':
                if (!value) errorMsg = 'Resource type is required';
                break;
            case 'exam_name':
                if (!value.trim()) errorMsg = 'Exam name is required';
                else if (value.length > 100) errorMsg = 'Exam name must be less than 100 characters';
                break;
            case 'allocation_date':
                if (!value) errorMsg = 'Date is required';
                else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) errorMsg = 'Date cannot be in the past';
                }
                break;
            case 'start_time':
                if (!value) errorMsg = 'Start time is required';
                else if (!validateTimeFormat(value)) errorMsg = 'Invalid time format (HH:MM)';
                else if (formData.end_time) {
                    const duration = calculateDuration(value, formData.end_time);
                    if (duration <= 0) errorMsg = 'End time must be after start time';
                }
                break;
            case 'end_time':
                if (!value) errorMsg = 'End time is required';
                else if (!validateTimeFormat(value)) errorMsg = 'Invalid time format (HH:MM)';
                else if (formData.start_time) {
                    const duration = calculateDuration(formData.start_time, value);
                    if (duration <= 0) errorMsg = 'End time must be after start time';
                    if (duration > 1440) errorMsg = 'Duration cannot exceed 24 hours';
                }
                break;
            case 'capacity':
                if (isNaN(value)) errorMsg = 'Capacity must be a number';
                else if (value < 1) errorMsg = 'Capacity must be at least 1';
                else if (value > 1000) errorMsg = 'Capacity cannot exceed 1000';
                break;
            case 'notes':
                if (value.length > 500) errorMsg = 'Notes cannot exceed 500 characters';
                break;
            default:
                break;
        }
        
        setErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
        return !errorMsg;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        
        if (name === 'start_time' || name === 'end_time') {
            const otherTime = name === 'start_time' ? formData.end_time : formData.start_time;
            if (value && otherTime) {
                newData.duration = calculateDuration(
                    name === 'start_time' ? value : formData.start_time,
                    name === 'end_time' ? value : formData.end_time
                );
            }
        }
        
        if (name === 'capacity') {
            newData.capacity = value === '' ? '' : Number(value);
        }
        
        setFormData(newData);
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        
        if (!formData.resource_name.trim()) {
            newErrors.resource_name = 'Resource name is required';
            isValid = false;
        }
        
        if (!formData.resource_type) {
            newErrors.resource_type = 'Resource type is required';
            isValid = false;
        }
        
        if (!formData.exam_name.trim()) {
            newErrors.exam_name = 'Exam name is required';
            isValid = false;
        }
        
        if (!formData.allocation_date) {
            newErrors.allocation_date = 'Date is required';
            isValid = false;
        }
        
        if (!formData.start_time) {
            newErrors.start_time = 'Start time is required';
            isValid = false;
        } else if (!validateTimeFormat(formData.start_time)) {
            newErrors.start_time = 'Invalid time format (HH:MM)';
            isValid = false;
        }
        
        if (!formData.end_time) {
            newErrors.end_time = 'End time is required';
            isValid = false;
        } else if (!validateTimeFormat(formData.end_time)) {
            newErrors.end_time = 'Invalid time format (HH:MM)';
            isValid = false;
        }
        
        if (formData.start_time && formData.end_time && 
            validateTimeFormat(formData.start_time) && 
            validateTimeFormat(formData.end_time)) {
            const duration = calculateDuration(formData.start_time, formData.end_time);
            if (duration <= 0) {
                newErrors.end_time = 'End time must be after start time';
                isValid = false;
            }
            if (duration > 1440) {
                newErrors.end_time = 'Duration cannot exceed 24 hours';
                isValid = false;
            }
        }
        
        if (isNaN(formData.capacity)) {
            newErrors.capacity = 'Capacity must be a number';
            isValid = false;
        } else if (formData.capacity < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
            isValid = false;
        } else if (formData.capacity > 1000) {
            newErrors.capacity = 'Capacity cannot exceed 1000';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const allFields = Object.keys(formData);
        const newTouched = {};
        allFields.forEach(field => { newTouched[field] = true; });
        setTouched(newTouched);
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            const payload = {
                resource_name: formData.resource_name,
                resource_type: formData.resource_type,
                exam_name: formData.exam_name,
                allocation_date: formData.allocation_date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                duration: calculateDuration(formData.start_time, formData.end_time),
                status: formData.status,
                capacity: Number(formData.capacity),
                notes: formData.notes || null
            };

            let response;
            if (id) {
                response = await axios.put(`${API_BASE_URL}/${id}`, payload);
                setSuccess('Resource updated successfully!');
            } else {
                response = await axios.post(API_BASE_URL, payload);
                setSuccess('Resource created successfully!');
            }
            
            setTimeout(() => navigate('/resource/list'), 1500);
        } catch (error) {
            console.error('Error:', error);
            
            let errorMessage = id ? 'Failed to update resource' : 'Failed to create resource';
            if (error.response) {
                if (error.response.status === 422) {
                    if (error.response.data.errors) {
                        const fieldErrors = {};
                        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                            fieldErrors[field] = messages[0];
                        });
                        setErrors(fieldErrors);
                        errorMessage = 'Validation errors occurred';
                    } else {
                        errorMessage = error.response.data.message || 'Validation failed';
                    }
                } else if (error.response.status === 400) {
                    errorMessage = error.response.data.message || 'Invalid time data';
                } else {
                    errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
                }
            } else if (error.request) {
                errorMessage = 'Network error - no response from server';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes) => {
        if (!minutes || isNaN(minutes)) return '0h 0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0f8ff', padding: '20px' }}>
            {/* Enhanced Navigation Bar */}
            <div style={styles.navBar}>
                <div style={styles.navLeft}>
                    <span style={styles.navTitle}>Resource Allocation System</span>
                </div>
                <div style={styles.navRight}>
                    <Link to="/home" style={styles.navLink}>
                        <span style={styles.navIcon}>🏠</span> Home
                    </Link>
                    <Link to="/resource/form" style={styles.navActiveLink}>
                        <span style={styles.navIcon}>📝</span> Form
                    </Link>
                    <Link to="/resource/list" style={styles.navLink}>
                        <span style={styles.navIcon}>📋</span> List
                    </Link>
                    <Link to="/timetable" style={styles.navLink}>
                        <span style={styles.navIcon}>📅</span> Timetable
                    </Link>
                </div>
            </div>

            <div style={{ 
                maxWidth: '800px',
                margin: '0 auto',
                padding: '30px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ fontSize: '1.8rem', color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
                    {id ? 'Edit Resource' : 'Add Resource'}
                </h2>
                
                {error && (
                    <div style={{ 
                        color: '#e74c3c',
                        padding: '10px',
                        marginBottom: '20px',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px',
                        backgroundColor: '#f8d7da'
                    }}>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div style={{ 
                        color: '#155724',
                        padding: '10px',
                        marginBottom: '20px',
                        border: '1px solid #c3e6cb',
                        borderRadius: '4px',
                        backgroundColor: '#d4edda'
                    }}>
                        {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Resource Name*</label>
                        <input
                            type="text"
                            name="resource_name"
                            value={formData.resource_name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            style={{ 
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: errors.resource_name ? '1px solid #e74c3c' : '1px solid #ddd',
                                marginBottom: '5px'
                            }}
                            maxLength={100}
                            disabled={loading}
                        />
                        {errors.resource_name && (
                            <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                {errors.resource_name}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Resource Type*</label>
                        <select
                            name="resource_type"
                            value={formData.resource_type}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            style={{ 
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: errors.resource_type ? '1px solid #e74c3c' : '1px solid #ddd',
                                marginBottom: '5px'
                            }}
                            disabled={loading}
                        >
                            <option value="" disabled>Select Resource Type</option>
                            <option value="classroom">Classroom</option>
                            <option value="lab">Lab</option>
                            <option value="auditorium">Auditorium</option>
                            <option value="conference_room">Conference Room</option>
                        </select>
                        {errors.resource_type && (
                            <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                {errors.resource_type}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Exam Name*</label>
                        <input
                            type="text"
                            name="exam_name"
                            value={formData.exam_name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            style={{ 
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: errors.exam_name ? '1px solid #e74c3c' : '1px solid #ddd',
                                marginBottom: '5px'
                            }}
                            maxLength={100}
                            disabled={loading}
                        />
                        {errors.exam_name && (
                            <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                {errors.exam_name}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Date*</label>
                            <input
                                type="date"
                                name="allocation_date"
                                value={formData.allocation_date}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                style={{ 
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: errors.allocation_date ? '1px solid #e74c3c' : '1px solid #ddd',
                                    marginBottom: '5px'
                                }}
                                disabled={loading}
                            />
                            {errors.allocation_date && (
                                <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                    {errors.allocation_date}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Start Time*</label>
                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                style={{ 
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: errors.start_time ? '1px solid #e74c3c' : '1px solid #ddd',
                                    marginBottom: '5px'
                                }}
                                disabled={loading}
                            />
                            {errors.start_time && (
                                <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                    {errors.start_time}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>End Time*</label>
                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                style={{ 
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: errors.end_time ? '1px solid #e74c3c' : '1px solid #ddd',
                                    marginBottom: '5px'
                                }}
                                disabled={loading}
                            />
                            {errors.end_time && (
                                <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                    {errors.end_time}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Duration</label>
                        <input
                            type="text"
                            value={formatDuration(formData.duration)}
                            readOnly
                            style={{ 
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f8f9fa'
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            min="1"
                            max="1000"
                            style={{ 
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: errors.capacity ? '1px solid #e74c3c' : '1px solid #ddd',
                                marginBottom: '5px'
                            }}
                            disabled={loading}
                        />
                        {errors.capacity && (
                            <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                {errors.capacity}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            style={{ 
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #ddd'
                            }}
                            disabled={loading}
                        >
                            <option value="available">Available</option>
                            <option value="allocated">Allocated</option>
                            <option value="maintenance">Under Maintenance</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            style={{ 
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: errors.notes ? '1px solid #e74c3c' : '1px solid #ddd',
                                minHeight: '80px',
                                marginBottom: '5px'
                            }}
                            maxLength={500}
                            disabled={loading}
                        />
                        {errors.notes && (
                            <div style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                {errors.notes}
                            </div>
                        )}
                        <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right' }}>
                            {formData.notes.length}/500 characters
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/resource/list')}
                            style={{ 
                                padding: '12px 24px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                cursor: 'pointer',
                                flex: 1,
                                opacity: loading ? 0.7 : 1
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ 
                                padding: '12px 24px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#28a745',
                                color: 'white',
                                cursor: 'pointer',
                                flex: 1,
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? (
                                <span>Processing...</span>
                            ) : id ? (
                                <span>Update Resource</span>
                            ) : (
                                <span>Create Resource</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    navBar: {
        background: 'linear-gradient(to right, #3498db, #2c3e50)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        marginBottom: '30px',
        borderRadius: '0 0 10px 10px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    navLeft: {
        display: 'flex',
        alignItems: 'center'
    },
    navRight: {
        display: 'flex',
        gap: '1.5rem'
    },
    navTitle: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        letterSpacing: '0.5px'
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)'
        }
    },
    navActiveLink: {
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    },
    navIcon: {
        fontSize: '1.1rem'
    }
};

export default ResourceAllocationForm;