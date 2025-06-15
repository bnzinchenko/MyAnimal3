// Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Unauthorized</h1>
            <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
            <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Go back to the homepage
            </Link>
        </div>
    );
};

export default Unauthorized;