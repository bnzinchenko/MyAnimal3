import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ObjectSchemaForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([{ name: '', type: 'string', required: false }]);
    const [clientAdmins, setClientAdmins] = useState([]); //  <---- Добавляем состояние для клиентских админов
    const [clientAdminId, setClientAdminId] = useState(''); //  <---- Добавляем состояние для выбранного clientAdminId
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Get object schema ID from URL params
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const fetchClientAdmins = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clientadmins', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClientAdmins(response.data);
            } catch (error) {
                console.error('Error fetching client admins:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data.message : error.message);
            }
        };

        fetchClientAdmins();

        if (id) {
            // If ID is present, fetch existing object schema
            const fetchObjectSchema = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/objectschemas/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const schema = response.data;
                    setName(schema.name);
                    setDescription(schema.description);
                    setFields(schema.fields);
                    setClientAdminId(schema.clientAdminId || ''); //  <---- Устанавливаем clientAdminId
                } catch (error) {
                    console.error('Error fetching object schema:', error.response ? error.response.data : error.message);
                    setError(error.response ? error.response.data.message : error.message);
                }
            };
            fetchObjectSchema();
        }
    }, [id, token]);

    const handleAddField = () => {
        setFields([...fields, { name: '', type: 'string', required: false }]);
    };

    const handleFieldChange = (index, event) => {
        const newFields = [...fields];
        newFields[index][event.target.name] = event.target.value;
        setFields(newFields);
    };

    const handleFieldCheckboxChange = (index, event) => {
        const newFields = [...fields];
        newFields[index].required = event.target.checked;
        setFields(newFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name,
                description,
                fields,
                clientAdminId //  <---- Отправляем clientAdminId
            };
            if (id) {
                // Update existing object schema
                await axios.put(`http://localhost:5000/api/objectschemas/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Create new object schema
                await axios.post('http://localhost:5000/api/objectschemas', data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            navigate('/objectschemas');
        } catch (error) {
            console.error('Error submitting object schema:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{id ? 'Edit Object Schema' : 'Create Object Schema'}</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/*  Поле для выбора ClientAdmin */}
                <div className="mb-4">
                    <label htmlFor="clientAdminId" className="block text-gray-700 text-sm font-bold mb-2">Assign to Client Admin:</label>
                    <select
                        id="clientAdminId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={clientAdminId}
                        onChange={(e) => setClientAdminId(e.target.value)}
                    >
                        <option value="">No Client Admin</option>
                        {clientAdmins.map((admin) => (
                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                        ))}
                    </select>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-800">Fields:</h3>
                {fields.map((field, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <div className="mb-2">
                            <label htmlFor={`name-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id={`name-${index}`}
                                name="name"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, e)}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`type-${index}`} className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id={`type-${index}`}
                                name="type"
                                value={field.type}
                                onChange={(e) => handleFieldChange(index, e)}
                            >
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    name="required"
                                    checked={field.required}
                                    onChange={(e) => handleFieldCheckboxChange(index, e)}
                                />
                                <span className="ml-2 text-gray-700 text-sm font-bold">Required</span>
                            </label>
                        </div>
                    </div>
                ))}
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" onClick={handleAddField}>Add Field</button>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {id ? 'Update Schema' : 'Create Schema'}
                </button>
            </form>
        </div>
    );
};

export default ObjectSchemaForm;