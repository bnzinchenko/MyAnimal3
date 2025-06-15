import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ObjectItemForm = () => {
    const [objectSchema, setObjectSchema] = useState(null);
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get object item ID from URL params
    const token = localStorage.getItem('token');
    const location = useLocation();

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const fetchObjectSchema = async (schemaId) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/objectschemas/${schemaId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setObjectSchema(response.data);
            } catch (error) {
                console.error('Error fetching object schema:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data.message : error.message);
            }
        };

        if (id) {
            // If ID is present, fetch existing object item
            const fetchObjectItem = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/objectitems/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const item = response.data;
                    setData(item.data);
                    fetchObjectSchema(item.objectSchemaId);
                } catch (error) {
                    console.error('Error fetching object item:', error.response ? error.response.data : error.message);
                    setError(error.response ? error.response.data : error.message);
                }
            };
            fetchObjectItem();
        } else {
            // If no ID is present, get schemaId from query params
            const searchParams = new URLSearchParams(location.search);
            const schemaId = searchParams.get('schemaId');
            if (schemaId) {
                fetchObjectSchema(schemaId);
            } else {
                setError('Schema ID is required to create a new object item.');
            }
        }
    }, [id, token, location.search]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!objectSchema) {
            setError('Object schema is not loaded.');
            return;
        }

        try {
            const payload = {
                data: data,
                objectSchemaId: objectSchema.id,
            };

            if (id) {
                // Update existing object item
                await axios.put(`http://localhost:5000/api/objectitems/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Create new object item
                await axios.post('http://localhost:5000/api/objectitems', payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            navigate('/objectitems');
        } catch (error) {
            console.error('Error submitting object item:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        }
    };

    if (!objectSchema) {
        return (
            <div className="container mx-auto p-4">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {/*  Loader or message */}
                Loading...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{id ? 'Edit Object Item' : 'Create Object Item'}</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                {objectSchema.fields.map((field) => (
                    <div className="mb-4" key={field.name}>
                        <label htmlFor={field.name} className="block text-gray-700 text-sm font-bold mb-2">{field.name}:</label>
                        <input
                            type="text" //  TODO:  Diferent types
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id={field.name}
                            name={field.name}
                            value={data[field.name] || ''}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {id ? 'Update Item' : 'Create Item'}
                </button>
            </form>
        </div>
    );
};

export default ObjectItemForm;