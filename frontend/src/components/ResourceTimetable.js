import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ResourceTimetable = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterResourceType, setFilterResourceType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Format duration from minutes to "Xh Ym"
    const formatDuration = (minutes) => {
        if (!minutes || isNaN(minutes)) return '0h 0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Format time in local timezone
    const formatTime = (dateString, timeString) => {
        if (!dateString || !timeString) return '';
        
        try {
            const [hours, minutes] = timeString.split(':').map(Number);
            const date = new Date(dateString);
            date.setHours(hours, minutes, 0, 0);
            
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error('Error formatting time:', e);
            return '';
        }
    };

    // Fetch resource allocations from the backend
    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8000/api/resource-allocations');
                setResources(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching resources:', error);
                setError('Failed to fetch resources. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    // Filter and group resources
    const filteredResources = resources
        .filter(resource => {
            const matchesDate = filterDate ? 
                new Date(resource.allocation_date).toISOString().substring(0, 10) === filterDate : 
                true;
            const matchesType = filterResourceType ? 
                resource.resource_type.toLowerCase() === filterResourceType.toLowerCase() : 
                true;
            const matchesStatus = filterStatus ?
                resource.status.toLowerCase() === filterStatus.toLowerCase() :
                true;
            return matchesDate && matchesType && matchesStatus;
        });

    // Group by date
    const groupedResources = filteredResources.reduce((acc, resource) => {
        const date = new Date(resource.allocation_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(resource);
        return acc;
    }, {});

    // Get unique values for filters
    const resourceTypes = [...new Set(resources.map(resource => resource.resource_type))];
    const statusTypes = [...new Set(resources.map(resource => resource.status))];

    // Pagination logic
    const groupedDates = Object.keys(groupedResources);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDates = groupedDates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(groupedDates.length / itemsPerPage);

    const resetFilters = () => {
        setFilterDate('');
        setFilterResourceType('');
        setFilterStatus('');
        setCurrentPage(1);
    };

    if (loading) {
        return <div style={styles.loading}>
            <div className="spinner"></div>
            Loading resources...
        </div>;
    }

    if (error) {
        return <div style={styles.error}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
            <button onClick={() => window.location.reload()} style={styles.retryButton}>
                Retry
            </button>
        </div>;
    }

    return (
        <div style={styles.pageContainer}>
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
                    <Link to="/resource/list" style={styles.navLink}>
                        <span style={styles.navIcon}>📋</span> List
                    </Link>
                    <Link to="/timetable" style={styles.navActiveLink}>
                        <span style={styles.navIcon}>📅</span> Timetable
                    </Link>
                </div>
            </div>

            <div style={styles.container}>
                <h2 style={styles.heading}>Resource Timetable</h2>
                
                {/* Filters */}
                <div style={styles.filters}>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Filter by Date:</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => {
                                setFilterDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={styles.filterInput}
                        />
                    </div>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Filter by Type:</label>
                        <select
                            value={filterResourceType}
                            onChange={(e) => {
                                setFilterResourceType(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={styles.filterInput}
                        >
                            <option value="">All Types</option>
                            {resourceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={styles.filterInput}
                        >
                            <option value="">All Statuses</option>
                            {statusTypes.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={resetFilters}
                        style={styles.resetButton}
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Results count */}
                <div style={styles.resultsCount}>
                    {filteredResources.length} resources found
                </div>

                {/* Timetable */}
                {currentDates.length > 0 ? (
                    currentDates.map((date) => (
                        <div key={date} style={styles.dateSection}>
                            <div style={styles.dateHeader}>
                                <span style={styles.dateText}>{date}</span>
                                <span style={styles.dateCount}>{groupedResources[date].length} allocations</span>
                            </div>
                            <div style={styles.tableContainer}>
                                <table style={styles.resourceTable}>
                                    <thead>
                                        <tr>
                                            <th style={styles.resourceTableTh}>Resource</th>
                                            <th style={styles.resourceTableTh}>Type</th>
                                            <th style={styles.resourceTableTh}>Exam</th>
                                            <th style={styles.resourceTableTh}>Time</th>
                                            <th style={styles.resourceTableTh}>Duration</th>
                                            <th style={styles.resourceTableTh}>Capacity</th>
                                            <th style={styles.resourceTableTh}>Status</th>
                                            <th style={styles.resourceTableTh}>Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedResources[date].map((resource) => {
                                            const startTime = formatTime(resource.allocation_date, resource.start_time);
                                            const endTime = formatTime(resource.allocation_date, resource.end_time);
                                            
                                            return (
                                                <tr key={resource.id} style={styles.resourceTableTr}>
                                                    <td style={styles.resourceTableTd}>{resource.resource_name}</td>
                                                    <td style={styles.resourceTableTd}>{resource.resource_type}</td>
                                                    <td style={styles.resourceTableTd}>{resource.exam_name}</td>
                                                    <td style={styles.resourceTableTd}>
                                                        {startTime && endTime ? `${startTime} - ${endTime}` : 'N/A'}
                                                    </td>
                                                    <td style={styles.resourceTableTd}>{formatDuration(resource.duration)}</td>
                                                    <td style={styles.resourceTableTd}>{resource.capacity}</td>
                                                    <td style={{
                                                        ...styles.resourceTableTd,
                                                        color: getStatusColor(resource.status)
                                                    }}>
                                                        {resource.status}
                                                    </td>
                                                    <td style={styles.resourceTableTd}>
                                                        {resource.notes || <span style={styles.emptyCell}>-</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.noResults}>
                        No resources found matching your criteria.
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={styles.paginationButton}
                        >
                            Previous
                        </button>
                        <span style={styles.pageInfo}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={styles.paginationButton}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper function for status colors
const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'available': return '#28a745';
        case 'allocated': return '#007bff';
        case 'maintenance': return '#ffc107';
        case 'unavailable': return '#dc3545';
        default: return '#6c757d';
    }
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '20px'
    },
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
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '25px',
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },
    heading: {
        fontSize: '1.7rem',
        color: '#2c3e50',
        marginBottom: '25px',
        textAlign: 'center',
        fontWeight: '600'
    },
    filters: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'flex-end'
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '200px',
        flex: '1 1 200px'
    },
    filterLabel: {
        marginBottom: '8px',
        fontWeight: '500',
        fontSize: '0.9rem',
        color: '#495057'
    },
    filterInput: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ced4da',
        width: '100%',
        fontSize: '0.9rem',
        transition: 'border-color 0.15s',
        ':focus': {
            borderColor: '#80bdff',
            outline: 'none',
            boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
        }
    },
    resetButton: {
        padding: '10px 15px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s',
        alignSelf: 'flex-end',
        marginBottom: '8px',
        ':hover': {
            backgroundColor: '#5a6268'
        }
    },
    resultsCount: {
        marginBottom: '15px',
        color: '#6c757d',
        fontSize: '0.9rem',
        fontStyle: 'italic'
    },
    dateSection: {
        marginBottom: '2.5rem',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    dateHeader: {
        backgroundColor: '#e9ecef',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dateText: {
        fontWeight: '600',
        color: '#212529'
    },
    dateCount: {
        backgroundColor: '#adb5bd',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem'
    },
    tableContainer: {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
    },
    resourceTable: {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
    },
    resourceTableTh: {
        backgroundColor: '#343a40',
        color: 'white',
        padding: '14px',
        textAlign: 'left',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        fontWeight: '500',
        fontSize: '0.9rem'
    },
    resourceTableTr: {
        borderBottom: '1px solid #e9ecef',
        ':hover': {
            backgroundColor: '#f8f9fa'
        }
    },
    resourceTableTd: {
        padding: '12px 14px',
        color: '#495057',
        wordBreak: 'break-word',
        fontSize: '0.9rem',
        verticalAlign: 'top'
    },
    emptyCell: {
        color: '#adb5bd',
        fontStyle: 'italic'
    },
    loading: {
        textAlign: 'center',
        color: '#495057',
        margin: '3rem 0',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
    },
    error: {
        color: '#dc3545',
        margin: '3rem 0',
        textAlign: 'center',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
    },
    errorIcon: {
        fontSize: '2rem'
    },
    retryButton: {
        marginTop: '1rem',
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#c82333'
        }
    },
    noResults: {
        textAlign: 'center',
        padding: '3rem',
        color: '#6c757d',
        fontSize: '1.1rem'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem'
    },
    paginationButton: {
        padding: '8px 16px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#2185d0'
        },
        ':disabled': {
            backgroundColor: '#b3d7ff',
            cursor: 'not-allowed'
        }
    },
    pageInfo: {
        color: '#495057',
        fontWeight: '500'
    },
    '@media (max-width: 768px)': {
        navBar: {
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem'
        },
        navLinks: {
            width: '100%',
            justifyContent: 'center'
        },
        container: {
            padding: '15px',
            margin: '0 10px'
        },
        filters: {
            flexDirection: 'column',
            gap: '15px'
        },
        filterGroup: {
            minWidth: '100%'
        },
        resetButton: {
            alignSelf: 'center',
            marginTop: '10px'
        },
        resourceTableTh: {
            fontSize: '0.8rem',
            padding: '10px'
        },
        resourceTableTd: {
            fontSize: '0.8rem',
            padding: '10px'
        }
    }
};

export default ResourceTimetable;