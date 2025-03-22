import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ResourceAllocationList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const navigate = useNavigate();

    // API base URL
    const API_BASE_URL = 'http://localhost:8000/api/resource-allocations'; // Verify this URL

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

    // Filter resources based on search query
    const filteredResources = resources.filter((resource) => {
        const query = searchQuery.toLowerCase();
        return (
            resource.resource_name.toLowerCase().includes(query) ||
            resource.resource_type.toLowerCase().includes(query) ||
            resource.exam_id.toLowerCase().includes(query) || // Filter by exam ID
            resource.status.toLowerCase().includes(query) ||
            new Date(resource.allocation_date).toLocaleString().toLowerCase().includes(query)
        );
    });

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
        buttonHover: {
            transform: 'translateY(-2px)'
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Resource Allocations</h2>
            {error && <div style={styles.error}>{error}</div>}

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name, type, exam ID, date, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchBar}
            />

            {loading ? (
                <div style={styles.loading}>Loading resources...</div>
            ) : filteredResources.length === 0 ? (
                <div style={styles.noResources}>No resources found. Add a new resource to get started.</div>
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
            <button
                onClick={() => navigate('/resource/form')}
                style={styles.addButton}
                onMouseOver={(e) => e.target.style.transform = styles.buttonHover.transform}
                onMouseOut={(e) => e.target.style.transform = 'none'}
            >
                Add New Resource
            </button>
        </div>
    );
};

export default ResourceAllocationList;