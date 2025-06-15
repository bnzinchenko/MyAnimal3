import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const ClientAdmins = () => {
    const [clientAdmins, setClientAdmins] = useState([]);
    const [newClientAdminName, setNewClientAdminName] = useState('');
    const [newClientAdminPassword, setNewClientAdminPassword] = useState('');
    const [newClientAdminOrganization, setNewClientAdminOrganization] = useState('');
    const [editingClientId, setEditingClientId] = useState(null);
    const [editedClientName, setEditedClientName] = useState('');
    const [editedClientOrganization, setEditedClientOrganization] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Инициализируем useNavigate

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Используем useNavigate для перенаправления
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
    }, [token, navigate]); // Добавляем navigate в массив зависимостей

    const handleAddClientAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/api/clientadmins',
                {
                    name: newClientAdminName,
                    initialPassword: newClientAdminPassword,
                    organization: newClientAdminOrganization
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setClientAdmins([...clientAdmins, response.data]);
            setNewClientAdminName('');
            setNewClientAdminPassword('');
            setNewClientAdminOrganization('');
        } catch (error) {
            console.error('Error adding client admin:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    const handleEditClientAdmin = (admin) => {
        setEditingClientId(admin.id);
        setEditedClientName(admin.name);
        setEditedClientOrganization(admin.organization || '');
    };

    const handleUpdateClientAdmin = async (id) => {
        try {
            await axios.put(
                `http://localhost:5000/api/clientadmins/${id}`,
                {
                    name: editedClientName,
                    organization: editedClientOrganization
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setClientAdmins(
                clientAdmins.map((admin) =>
                    admin.id === id ? { ...admin, name: editedClientName, organization: editedClientOrganization } : admin
                )
            );
            setEditingClientId(null);
        } catch (error) {
            console.error('Error updating client admin:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteClientAdmin = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/clientadmins/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClientAdmins(clientAdmins.filter((admin) => admin.id !== id));
        } catch (error) {
            console.error('Error deleting client admin:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        }
    };

    const handleResetPassword = async (id) => {
        const newPassword = prompt('Enter new password for this client admin:');
        if (newPassword) {
            try {
                await axios.post(
                    `http://localhost:5000/api/clientadmins/${id}/reset-password`,
                    { newPassword },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Password reset successfully!');
            } catch (error) {
                console.error('Error resetting password:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data : error.message);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Client Administrators</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Форма для добавления нового клиентского администратора */}
            <form onSubmit={handleAddClientAdmin} className="mb-4">
                <div className="flex">
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        placeholder="Client Admin Name"
                        value={newClientAdminName}
                        onChange={(e) => setNewClientAdminName(e.target.value)}
                    />
                    <input
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        placeholder="Initial Password"
                        value={newClientAdminPassword}
                        onChange={(e) => setNewClientAdminPassword(e.target.value)}
                    />
                    {/* Новое поле для организации */}
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        placeholder="Organization"
                        value={newClientAdminOrganization}
                        onChange={(e) => setNewClientAdminOrganization(e.target.value)}
                    />
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Add
                    </button>
                </div>
            </form>

            {/* Список клиентских администраторов */}
            <div className="bg-white shadow-md rounded my-6">
                <table className="min-w-max w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Organization</th>
                            <th className="py-3 px-6 text-left">Assigned Schemas</th> {/* Новая колонка */}
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {clientAdmins.map((admin) => (
                            <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <div className="flex items-center">
                                        {editingClientId === admin.id ? (
                                            <input
                                                type="text"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={editedClientName}
                                                onChange={(e) => setEditedClientName(e.target.value)}
                                            />
                                        ) : (
                                            <span>{admin.name}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <div className="flex items-center">
                                        {editingClientId === admin.id ? (
                                            <input
                                                type="text"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={editedClientOrganization}
                                                onChange={(e) => setEditedClientOrganization(e.target.value)}
                                            />
                                        ) : (
                                            <span>{admin.organization}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-left"> {/* Новая колонка */}
                                    {admin.ObjectSchemas && admin.ObjectSchemas.length > 0 ? (
                                        <ul>
                                            {admin.ObjectSchemas.map((schema) => (
                                                <li key={schema.id}>{schema.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No schemas assigned</span>
                                    )}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        {editingClientId === admin.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateClientAdmin(admin.id)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => setEditingClientId(null)}
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClientAdmin(admin)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteClientAdmin(admin.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Delete
                                        </button>
                                        {/* Кнопка сброса пароля */}
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                                            onClick={() => handleResetPassword(admin.id)}
                                        >
                                            Reset Password
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

export default ClientAdmins;