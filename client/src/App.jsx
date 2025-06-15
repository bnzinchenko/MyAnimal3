import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ClientAdmins from './components/ClientAdmins';
import ObjectSchemaForm from './components/ObjectSchemas/ObjectSchemaForm';
import ObjectSchemaList from './components/ObjectSchemas/ObjectSchemaList';
import ObjectItemList from './components/ObjectItems/ObjectItemList';
import ObjectItemForm from './components/ObjectItems/ObjectItemForm';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AuthContext from './context/AuthContext.jsx';
import Unauthorized from './components/Unauthorized';

function App() {
    const { token, role } = useContext(AuthContext);
    const isAdmin = role === 'superadmin';
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Router>
            {token ? (
                <div className="flex h-screen">
                    <div className="sidebar bg-gray-100 border-l-2">
                        <Navbar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
                    </div>
                    <div className={`content flex-1 ml-24'}`}> {/* Добавлен условный класс ml-16/ml-64 */}
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/clientadmins" element={isAdmin ? <ClientAdmins /> : <Unauthorized />} />
                            <Route path="/objectschemas/new" element={isAdmin ? <ObjectSchemaForm /> : <Unauthorized />} />
                            <Route path="/objectschemas/:id/edit" element={isAdmin ? <ObjectSchemaForm /> : <Unauthorized />} />
                            <Route path="/objectschemas" element={isAdmin ? <ObjectSchemaList /> : <Unauthorized />} />
                            <Route path="/objectitems" element={isAdmin ? <ObjectItemList /> : <Unauthorized />} />
                            <Route path="/objectitems/new" element={isAdmin ? <ObjectItemForm /> : <Unauthorized />} />
                            <Route path="/objectitems/:id/edit" element={isAdmin ? <ObjectItemForm /> : <Unauthorized />} />
                            <Route path="/login" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            ) : (
                <div className="grid h-screen place-items-center">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            )}
        </Router>
    );
}

export default App;