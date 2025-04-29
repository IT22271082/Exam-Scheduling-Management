import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ResourceAllocationList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        resourceType: '',
        status: '',
        dateFrom: '',
        dateTo: '',
        capacityMin: '',
        capacityMax: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:8000/api/resource-allocations';

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_BASE_URL);
            setResources(response.data.sort((a, b) => a.id - b.id));
            setError('');
        } catch (error) {
            console.error('Error fetching resources:', error);
            setError('Failed to fetch resources. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                fetchResources();
            } catch (error) {
                console.error('Error deleting resource:', error);
                setError('Failed to delete resource. Please try again.');
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            resourceType: '',
            status: '',
            dateFrom: '',
            dateTo: '',
            capacityMin: '',
            capacityMax: ''
        });
    };

    const filteredResources = resources.filter((resource) => {
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            const matchesSearch = (
                (resource.resource_name && resource.resource_name.toLowerCase().includes(query)) ||
                (resource.resource_type && resource.resource_type.toLowerCase().includes(query)) ||
                (resource.exam_name && resource.exam_name.toLowerCase().includes(query)) ||
                (resource.status && resource.status.toLowerCase().includes(query)) ||
                (resource.allocation_date && new Date(resource.allocation_date).toLocaleString().toLowerCase().includes(query))
            );
            if (!matchesSearch) return false;
        }

        if (filters.resourceType && resource.resource_type !== filters.resourceType) {
            return false;
        }

        if (filters.status && resource.status !== filters.status) {
            return false;
        }

        if (filters.dateFrom && resource.allocation_date) {
            const allocationDate = new Date(resource.allocation_date);
            const fromDate = new Date(filters.dateFrom);
            if (allocationDate < fromDate) return false;
        }

        if (filters.dateTo && resource.allocation_date) {
            const allocationDate = new Date(resource.allocation_date);
            const toDate = new Date(filters.dateTo);
            toDate.setDate(toDate.getDate() + 1);
            if (allocationDate >= toDate) return false;
        }

        if (filters.capacityMin && (resource.capacity < parseInt(filters.capacityMin))) {
            return false;
        }

        if (filters.capacityMax && (resource.capacity > parseInt(filters.capacityMax))) {
            return false;
        }

        return true;
    }).sort((a, b) => a.id - b.id);

    const resourceTypes = [...new Set(resources.map(r => r.resource_type))].filter(Boolean);
    const statuses = [...new Set(resources.map(r => r.status))].filter(Boolean);

    const generateCSVReport = () => {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        
        let reportContent = [];
        reportContent.push(['RESOURCE ALLOCATION REPORT']);
        reportContent.push([`Generated on: ${today.toLocaleDateString()}`]);
        reportContent.push(['']);
        
        const headers = [
            'ID', 'Resource Name', 'Resource Type', 'Exam Name', 
            'Allocation Date', 'Start Time', 'End Time',
            'Duration', 'Capacity', 'Status', 'Notes'
        ];
        
        reportContent.push(headers);
        
        filteredResources.forEach(resource => {
            const row = [
                resource.id,
                `"${resource.resource_name}"`,
                resource.resource_type,
                `"${resource.exam_name}"`,
                new Date(resource.allocation_date).toLocaleDateString(),
                resource.start_time,
                resource.end_time,
                `${Math.floor(resource.duration / 60)}h ${resource.duration % 60}m`,
                resource.capacity,
                resource.status,
                `"${resource.notes || ''}"`
            ];
            reportContent.push(row);
        });
        
        const csvContent = reportContent.map(row => row.join(',')).join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Resource_Report_${dateString}.csv`;
        link.click();
    };

    const formatDuration = (minutes) => {
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
                    <Link to="/resource/form" style={styles.navLink}>
                        <span style={styles.navIcon}>📝</span> Form
                    </Link>
                    <Link to="/resource/list" style={styles.navActiveLink}>
                        <span style={styles.navIcon}>📋</span> List
                    </Link>
                    <Link to="/timetable" style={styles.navLink}>
                        <span style={styles.navIcon}>📅</span> Timetable
                    </Link>
                </div>
            </div>

            <div style={{ 
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ fontSize: '1.8rem', color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
                    Resource Allocations
                </h2>
                
                {error && <div style={{ color: '#e74c3c', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ 
                            padding: '10px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            flex: '1',
                            maxWidth: '500px'
                        }}
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{ 
                            padding: '10px 15px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {showFilters && (
                    <div style={{ 
                        marginBottom: '20px',
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                    }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '10px' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Resource Type</label>
                                <select
                                    name="resourceType"
                                    value={filters.resourceType}
                                    onChange={handleFilterChange}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                                >
                                    <option value="">All Types</option>
                                    {resourceTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Status</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                                >
                                    <option value="">All Statuses</option>
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '10px' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>From Date</label>
                                <input
                                    type="date"
                                    name="dateFrom"
                                    value={filters.dateFrom}
                                    onChange={handleFilterChange}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>To Date</label>
                                <input
                                    type="date"
                                    name="dateTo"
                                    value={filters.dateTo}
                                    onChange={handleFilterChange}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Min Capacity</label>
                                <input
                                    type="number"
                                    name="capacityMin"
                                    value={filters.capacityMin}
                                    onChange={handleFilterChange}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                                    min="0"
                                />
                            </div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Max Capacity</label>
                                <input
                                    type="number"
                                    name="capacityMax"
                                    value={filters.capacityMax}
                                    onChange={handleFilterChange}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                                    min="0"
                                />
                            </div>
                        </div>
                        <button
                            onClick={resetFilters}
                            style={{ 
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                marginTop: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Loading resources...</div>
                ) : filteredResources.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        {searchQuery.trim() || Object.values(filters).some(f => f) 
                            ? 'No matching resources found' 
                            : 'No resources available'}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Resource Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Exam Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Start Time</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>End Time</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Duration</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Capacity</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResources.map((resource) => (
                                    <tr key={resource.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{resource.id}</td>
                                        <td style={{ padding: '12px' }}>{resource.resource_name}</td>
                                        <td style={{ padding: '12px' }}>{resource.resource_type}</td>
                                        <td style={{ padding: '12px' }}>{resource.exam_name}</td>
                                        <td style={{ padding: '12px' }}>
                                            {resource.allocation_date ? new Date(resource.allocation_date).toLocaleDateString() : ''}
                                        </td>
                                        <td style={{ padding: '12px' }}>{resource.start_time}</td>
                                        <td style={{ padding: '12px' }}>{resource.end_time}</td>
                                        <td style={{ padding: '12px' }}>{formatDuration(resource.duration)}</td>
                                        <td style={{ padding: '12px' }}>{resource.capacity}</td>
                                        <td style={{ padding: '12px' }}>{resource.status}</td>
                                        <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                            <Link
                                                to={`/resource/form/${resource.id}`}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#3498db',
                                                    color: 'white',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(resource.id)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/resource/form')}
                        style={{
                            padding: '10px 15px',
                            borderRadius: '6px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Add New Resource
                    </button>
                    <button
                        onClick={generateCSVReport}
                        style={{
                            padding: '10px 15px',
                            borderRadius: '6px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Generate Report
                    </button>
                </div>
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

export default ResourceAllocationList;