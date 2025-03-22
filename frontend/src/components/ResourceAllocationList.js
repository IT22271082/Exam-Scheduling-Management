import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ResourceAllocationList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // API base URL
    const API_BASE_URL = 'http://localhost:8000/api/resource-allocations';

    // Fetch resource allocations from the backend
    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_BASE_URL);
            setResources(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching resources:', error);
            setError('Failed to fetch resources. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Delete a resource allocation
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                fetchResources(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting resource:', error);
                setError('Failed to delete resource. Please try again.');
            }
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter resources based on search query
    const filteredResources = resources.filter((resource) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.trim().toLowerCase();
        return (
            (resource.resource_name && resource.resource_name.toString().toLowerCase().includes(query)) ||
            (resource.resource_type && resource.resource_type.toString().toLowerCase().includes(query)) ||
            (resource.exam_id && String(resource.exam_id).toLowerCase().includes(query)) ||
            (resource.status && resource.status.toString().toLowerCase().includes(query)) ||
            (resource.allocation_date && new Date(resource.allocation_date).toLocaleString().toLowerCase().includes(query))
        );
    });

    // Generate CSV report
    const generateCSVReport = () => {
        // Define CSV headers
        const headers = [
            'Resource Name',
            'Resource Type',
            'Exam ID',
            'Allocation Date',
            'Status',
        ];

        // Map resources to CSV rows
        const rows = filteredResources.map((resource) => [
            resource.resource_name,
            resource.resource_type,
            resource.exam_id,
            new Date(resource.allocation_date).toLocaleString(),
            resource.status,
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','), // Header row
            ...rows.map((row) => row.join(',')) // Data rows
        ].join('\n');

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'resource_allocations_report.csv';
        link.click();
    };

    // Styles
    const styles = {
        container: {
            maxWidth: '1000px',
            margin: '20px auto',
            padding: '20px',
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            fontFamily: '"Arial", sans-serif',
            position: 'relative',
        },
        heading: {
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '20px',
            textAlign: 'center'
        },
        error: {
            color: '#e74c3c',
            marginBottom: '15px',
            textAlign: 'center'
        },
        loading: {
            textAlign: 'center',
            color: '#666',
            marginBottom: '20px'
        },
        noResources: {
            textAlign: 'center',
            color: '#666',
            marginBottom: '20px'
        },
        searchBar: {
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '20px',
            boxSizing: 'border-box'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px'
        },
        tableHeader: {
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px',
            textAlign: 'left'
        },
        tableRow: {
            borderBottom: '1px solid #eee',
            transition: 'background-color 0.3s ease'
        },
        tableRowHover: {
            backgroundColor: '#f9f9f9'
        },
        tableCell: {
            padding: '12px',
            color: '#333'
        },
        actionsCell: {
            display: 'flex',
            gap: '10px'
        },
        button: {
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.3s ease'
        },
        editButton: {
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none'
        },
        deleteButton: {
            backgroundColor: '#e74c3c',
            color: 'white'
        },
        addButton: {
            backgroundColor: '#28a745',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: 'auto',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            marginLeft: '100px',
        },
        reportButton: {
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: 'auto',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            marginLeft: '10px',
        },
        buttonHover: {
            transform: 'translateY(-2px)'
        },
        searchSection: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            position: 'relative'
        },
        searchIcon: {
            position: 'absolute',
            right: '10px',
            color: '#888',
            pointerEvents: 'none'
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Resource Allocations</h2>
            {error && <div style={styles.error}>{error}</div>}

            {/* Search Bar */}
            <div style={styles.searchSection}>
                <input
                    type="text"
                    placeholder="Search by name, type, exam ID, date, or status..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={styles.searchBar}
                />
                <span style={styles.searchIcon}>🔍</span>
            </div>

            {/* Display search results count when searching */}
            {searchQuery.trim() && (
                <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>
                    Found {filteredResources.length} result{filteredResources.length !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
            )}

            {loading ? (
                <div style={styles.loading}>Loading resources...</div>
            ) : filteredResources.length === 0 ? (
                <div style={styles.noResources}>
                    {searchQuery.trim() 
                        ? `No resources found matching "${searchQuery}". Try a different search term.` 
                        : 'No resources found. Add a new resource to get started.'}
                </div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Resource Name</th>
                            <th style={styles.tableHeader}>Resource Type</th>
                            <th style={styles.tableHeader}>Exam ID</th>
                            <th style={styles.tableHeader}>Allocation Date</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResources.map((resource) => (
                            <tr
                                key={resource.id}
                                style={styles.tableRow}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={styles.tableCell}>{resource.resource_name}</td>
                                <td style={styles.tableCell}>{resource.resource_type}</td>
                                <td style={styles.tableCell}>{resource.exam_id}</td>
                                <td style={styles.tableCell}>
                                    {new Date(resource.allocation_date).toLocaleString()}
                                </td>
                                <td style={styles.tableCell}>{resource.status}</td>
                                <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                                    <Link
                                        to={`/resource/form/${resource.id}`}
                                        style={{ ...styles.button, ...styles.editButton }}
                                        onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
                                        onMouseOut={(e) => e.target.style.transform = 'none'}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(resource.id)}
                                        style={{ ...styles.button, ...styles.deleteButton }}
                                        onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
                                        onMouseOut={(e) => e.target.style.transform = 'none'}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Buttons for Add and Generate Report */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                    onClick={() => navigate('/resource/form')}
                    style={styles.addButton}
                    onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
                    onMouseOut={(e) => e.target.style.transform = 'none'}
                >
                    Add New Resource
                </button>
                <button
                    onClick={generateCSVReport}
                    style={styles.reportButton}
                    onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
                    onMouseOut={(e) => e.target.style.transform = 'none'}
                >
                    Generate Report (CSV)
                </button>
            </div>
        </div>
    );
};

export default ResourceAllocationList;