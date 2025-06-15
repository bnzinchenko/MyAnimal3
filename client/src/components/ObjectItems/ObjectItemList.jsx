import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ObjectItemList = () => {
    const [objectItems, setObjectItems] = useState([]);
    const [objectSchemas, setObjectSchemas] = useState([]);
    const [selectedSchemaId, setSelectedSchemaId] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const fetchObjectItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/objectitems?schemaId=${selectedSchemaId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setObjectItems(response.data);
            } catch (error) {
                console.error('Error fetching object items:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data.message : error.message);
            }
        };

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

        fetchObjectItems();
        if (userRole !== 'operator') {
            fetchObjectSchemas();
        }
    }, [token, selectedSchemaId, userRole]);

    const handleSchemaChange = (e) => {
        setSelectedSchemaId(e.target.value);
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/objectitems/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setObjectItems(objectItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting object item:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    const renderItemData = (item) => {
        if (!item.ObjectSchema || !item.ObjectSchema.fields) {
            return "Schema or fields not found";
        }

        return (
            <ul>
                {item.ObjectSchema.fields.map((field) => (
                    <li key={field.name}>
                        <strong>{field.name}:</strong> {item.data[field.name] || 'N/A'}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Object Items</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {userRole !== 'operator' && (
                <div className="mb-4">
                    <label htmlFor="schema" className="block text-gray-700 text-sm font-bold mb-2">Filter by Schema:</label>
                    <select
                        id="schema"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedSchemaId}
                        onChange={handleSchemaChange}
                    >
                        <option value="">All Schemas</option>
                        {objectSchemas.map((schema) => (
                            <option key={schema.id} value={schema.id}>{schema.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <Link to={{ pathname: '/objectitems/new', search: `?schemaId=${selectedSchemaId}` }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 inline-block">
                Create New Item
            </Link>

            <div className="bg-white shadow-md rounded my-6">
                <table className="min-w-max w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Data</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {objectItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {renderItemData(item)}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <Link to={`/objectitems/${item.id}/edit`} className="text-blue-500 hover:text-blue-700 mr-2">
                                            Edit
                                        </Link>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={() => handleDeleteItem(item.id)}
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

export default ObjectItemList;