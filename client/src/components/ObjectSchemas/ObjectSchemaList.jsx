import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ObjectSchemaList = () => {
    const [objectSchemas, setObjectSchemas] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const fetchObjectSchemas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/objectschemas', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setObjectSchemas(response.data);
            } catch (error) {
                console.error('Error fetching object schemas:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data.message : error.message);
            }
        };

        fetchObjectSchemas();
    }, [token]);

    const handleDeleteSchema = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/objectschemas/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setObjectSchemas(objectSchemas.filter((schema) => schema.id !== id));
        } catch (error) {
            console.error('Error deleting object schema:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Object Schemas</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <Link to="/objectschemas/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 inline-block">
                Create New Schema
            </Link>

            <div className="bg-white shadow-md rounded my-6">
                <table className="min-w-max w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Client Admin</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {objectSchemas.map((schema) => (
                            <tr key={schema.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{schema.name}</td>
                                <td className="py-3 px-6 text-left">{schema.description}</td>
                                <td className="py-3 px-6 text-left">{schema.ClientAdmin ? schema.ClientAdmin.name : 'No Client Admin'}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <Link to={`/objectschemas/${schema.id}/edit`} className="text-blue-500 hover:text-blue-700 mr-2">
                                            Edit
                                        </Link>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={() => handleDeleteSchema(schema.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ObjectSchemaList;