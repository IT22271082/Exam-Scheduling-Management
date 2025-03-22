import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResourceTimetable = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch resource allocations from the backend
    useEffect(() => {
        const fetchResources = async () => {
            try {
                // Updated to use the full URL
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

    // Group resources by date
    const groupedResources = resources.reduce((acc, resource) => {
        const date = new Date(resource.allocation_date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(resource);
        return acc;
    }, {});

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
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
        },
        tableHeader: {
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px',
            textAlign: 'left',
        },
        tableRow: {
            borderBottom: '1px solid #eee',
        },
        tableCell: {
            padding: '12px',
            color: '#333',
        },
        loading: {
            textAlign: 'center',
            color: '#666',
            marginBottom: '20px',
        },
        error: {
            color: '#e74c3c',
            marginBottom: '15px',
            textAlign: 'center',
        },
    };

    if (loading) {
        return <div style={styles.loading}>Loading resources...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h2>Resource Timetable</h2>
            {Object.keys(groupedResources).length > 0 ? (
                Object.entries(groupedResources).map(([date, resources]) => (
                    <div key={date}>
                        <h3>{date}</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.tableHeader}>Resource Name</th>
                                    <th style={styles.tableHeader}>Resource Type</th>
                                    <th style={styles.tableHeader}>Time</th>
                                    <th style={styles.tableHeader}>Duration</th>
                                    <th style={styles.tableHeader}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map((resource) => {
                                    const startTime = new Date(resource.allocation_date).toLocaleTimeString();
                                    const endTime = new Date(
                                        new Date(resource.allocation_date).getTime() + resource.duration * 60000
                                    ).toLocaleTimeString();
                                    return (
                                        <tr key={resource.id} style={styles.tableRow}>
                                            <td style={styles.tableCell}>{resource.resource_name}</td>
                                            <td style={styles.tableCell}>{resource.resource_type}</td>
                                            <td style={styles.tableCell}>
                                                {startTime} - {endTime}
                                            </td>
                                            <td style={styles.tableCell}>{resource.duration} minutes</td>
                                            <td style={styles.tableCell}>{resource.status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    No resources found. Please add some resources to view them here.
                </div>
            )}
        </div>
    );
};

export default ResourceTimetable;