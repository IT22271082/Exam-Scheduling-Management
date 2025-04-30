import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <nav>
            <Link to="/home">
                <button>Resource Management</button>
            </Link>
        </nav>
    );
};

export default NavigationBar;