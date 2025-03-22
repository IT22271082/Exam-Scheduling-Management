import React from 'react';
import { Link } from 'react-router-dom';
// Import the background image
import backgroundImage from '../assets/Aula Universidad.jpg';

const Home = () => {
    const styles = {
        // Navigation Bar Styles

        image: {
            maxWidth: '30%', // Makes the image responsive but not too large
            height: 'auto',
            marginBottom: '10px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        navbar: {
            display: 'flex',
            alignItems: 'center',
            padding: '15px 30px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            fontFamily: '"Arial", sans-serif'
        },
        backButton: {
            display: 'flex',
            alignItems: 'center',
            color: '#3498db',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'color 0.3s ease',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
        },
        // Original Container Styles
        container: {
            textAlign: 'center',
            padding: '120px 20px 50px', // Added top padding to accommodate navbar
            background: 'linear-gradient(135deg, #f0f8ff, #e6f7ff)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"Arial", sans-serif'
        },
        heading: {
            color: '#2c3e50',
            fontSize: '2.0rem',
            marginBottom: '20px',
            fontWeight: '600',
            fontFamily: '"Arial", sans-serif',
            marginTop: '-40px',
        },
        paragraph: {
            color: '#666',
            fontSize: '1.2rem',
            marginBottom: '40px',
            maxWidth: '600px',
            lineHeight: '1.6',
            fontFamily: '"Arial", sans-serif'
        },
        buttonContainer: {
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },
        button: {
            margin: '10px',
            padding: '15px 30px',
            fontSize: '1rem',
            cursor: 'pointer',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontFamily: '"Arial", sans-serif'
        },
        buttonHover: {
            backgroundColor: '#2980b9',
            transform: 'translateY(-2px)'
        }
    };

    return (
        <>
            {/* Navigation Bar with Back Button */}
            <nav style={styles.navbar}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={styles.backButton}>
                        Back
                    </button>
                </Link>
            </nav>

            {/* Main Content */}
            <div className="home" style={styles.container}>
                <h1 style={styles.heading}>Welcome to the Resource Allocation System</h1>
                
                {/* Add the image here */}
                <img 
                    src={backgroundImage} 
                    alt="University Classroom" 
                    style={styles.image} 
                />
                
               
                <div style={styles.buttonContainer}>
                    <Link to="/resource/list" style={{ textDecoration: 'none' }}>
                        <button 
                            style={styles.button}
                            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                        >
                            Go to Resource List
                        </button>
                    </Link>
                    <Link to="/resource/form" style={{ textDecoration: 'none' }}>
                        <button 
                            style={styles.button}
                            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                        >
                            Go to Resource Form
                        </button>
                    </Link>
                    <Link to="/timetable" style={{ textDecoration: 'none' }}>
                        <button 
                            style={styles.button}
                            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                        >
                            View Timetable
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Home;