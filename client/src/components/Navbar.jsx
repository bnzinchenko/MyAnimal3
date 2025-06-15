import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    HomeIcon as HomeIconSolid,
    UsersIcon as UsersIconSolid,
    Square3Stack3DIcon as CollectionIconSolid,
    ArchiveBoxIcon as ArchiveBoxIconSolid,
    ArrowDownLeftIcon as LogoutIconSolid,
} from '@heroicons/react/20/solid';

const Navbar = ({ isCollapsed, toggleCollapse }) => {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    return (
        <div
            className={`flex flex-col h-full bg-gray-100 border-r border-gray-200 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}
        >
            <div className="flex items-center justify-center h-16 shrink-0">
                <button onClick={toggleCollapse} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                    {isCollapsed ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    )}
                </button>
            </div>

            <div className={`p-4 ${isCollapsed ? 'hidden' : 'block'}`}>
            </div>

            <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 ${
                            isCollapsed ? 'justify-center' : ''
                        }`}
                    >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 text-red-500 hover:text-red-700 ${
                        isCollapsed ? 'justify-center' : ''
                    } w-full`}
                >
                    <LogoutIconSolid className="h-5 w-5" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

const sidebarItems = [
    { name: 'Home', path: '/', icon: HomeIconSolid },
    { name: 'Client Admins', path: '/clientadmins', icon: UsersIconSolid },
    { name: 'Object Schemas', path: '/objectschemas', icon: CollectionIconSolid },
    { name: 'Object Items', path: '/objectitems', icon: ArchiveBoxIconSolid },
];

export default Navbar;