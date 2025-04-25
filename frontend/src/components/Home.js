import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/download.jpg';

const Home = () => {
    const styles = {
        // Navigation Bar Styles (updated to match ResourceAllocationForm)
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
        // Container Styles
        container: {
            textAlign: 'center',
            padding: '120px 20px 50px',
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"Arial", sans-serif',
            '@media (max-width: 768px)': {
                padding: '80px 10px 20px',
            },
        },
        backgroundImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `url(${backgroundImage}) no-repeat center center / cover`,
            filter: 'blur(5px)',
            zIndex: -1,
        },
        heading: {
            color: '#212f3d',
            fontSize: '2.0rem',
            marginBottom: '20px',
            fontWeight: '600',
            fontFamily: '"Arial", sans-serif',
            marginTop: '-200px',
            textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white',
            '@media (max-width: 768px)': {
                fontSize: '1.5rem',
                marginTop: '0',
            },
        },
        paragraph: {
            color: '#2a6ca5',
            fontSize: '1.6rem',
            marginBottom: '40px',
            fontWeight: '600',
            maxWidth: '600px',
            lineHeight: '1.6',
            fontFamily: '"Arial", sans-serif',
            textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white',
            '@media (max-width: 768px)': {
                fontSize: '1rem',
                padding: '0 10px',
            },
        },
        navigationContainer: {
            color: '#cdddfa',
            display: 'flex',
            flexDirection: 'row',
            gap: '15px',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '30px',
            margin: '20px',
            width: '70%',
            maxWidth: '100%',
            height: '100%',
        },
        navigationLink: {
            color: '#000000',
            textDecoration: 'none',
            fontSize: '1.3rem',
            padding: '30px 30px',
            fontWeight: '600',
            backgroundColor: 'rgba(221, 221, 245, 0.8)',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            width: '100%',
            textAlign: 'center',
            boxSizing: 'border-box',
            '@media (max-width: 768px)': {
                padding: '10px 15px',
                fontSize: '1rem',
            },
        },
        navigationLinkHover: {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.03)',
        },
    };

    const createHoverEffect = (e, hoverStyle) => {
        e.target.style.backgroundColor = hoverStyle.backgroundColor;
        e.target.style.transform = hoverStyle.transform;
    };

    const resetHoverEffect = (e, defaultStyle) => {
        e.target.style.backgroundColor = defaultStyle.backgroundColor;
        e.target.style.transform = 'scale(1)';
    };

    return (
        <>
            {/* Updated Navigation Bar */}
            <div style={styles.navBar}>
                <div style={styles.navLeft}>
                    <span style={styles.navTitle}>Resource Allocation System</span>
                </div>
                <div style={styles.navRight}>
                    <Link to="/home" style={styles.navActiveLink}>
                        <span style={styles.navIcon}>🏠</span> Home
                    </Link>
                    <Link to="/resource/form" style={styles.navLink}>
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

            {/* Main Content */}
            <div className="home" style={styles.container}>
                <div style={styles.backgroundImage}></div>
                <h1 style={styles.heading}>Welcome to the Resource Allocation System</h1>
                
                <p style={styles.paragraph}>
                    Manage your resources efficiently and effectively with our system.
                </p>
                
                <div style={styles.navigationContainer}>
                    <Link 
                        to="/resource/list" 
                        style={styles.navigationLink}
                        onMouseOver={(e) => createHoverEffect(e, styles.navigationLinkHover)}
                        onMouseOut={(e) => resetHoverEffect(e, styles.navigationLink)}
                    >
                        Resource List
                    </Link>

                    <Link 
                        to="/resource/form" 
                        style={styles.navigationLink}
                        onMouseOver={(e) => createHoverEffect(e, styles.navigationLinkHover)}
                        onMouseOut={(e) => resetHoverEffect(e, styles.navigationLink)}
                    >
                        Resource Form
                    </Link>

                    <Link 
                        to="/timetable" 
                        style={styles.navigationLink}
                        onMouseOver={(e) => createHoverEffect(e, styles.navigationLinkHover)}
                        onMouseOut={(e) => resetHoverEffect(e, styles.navigationLink)}
                    >
                        View Timetable
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Home;