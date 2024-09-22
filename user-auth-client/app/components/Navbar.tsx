import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/authContext';


const Navbar = () => {
    // const [error, setError] = useState<string | null>(null);  // State to handle errors
    const router = useRouter();
    const { user } = useContext(AuthContext) || {};

    const handleDashboardRoute = (path: string) => {
        if (user?.role === path || user?.role === 'SUPERADMIN') {
            router.push(`/${path.toLowerCase()}`);
        } else {
            alert('You do not have access to this page');
        }
    }
    return (
        <div className="w-full  p-4 bg-gray-200 flex justify-between items-center">


            <p
                onClick={() => router.push('/')}
                className="text-xl font-semibold text-center mb-4">User Auth </p>

            <div className="flex justify-center space-x-4">
                <button
                    className="px-2 py-1 rounded-xl text-lg font-semibold bg-blue-100 text-blue-800"
                    onClick={() => handleDashboardRoute('ADMIN')}
                >
                    Admin
                </button>
                <button
                    className="px-2 py-1 rounded-xl text-lg font-semibold bg-green-100 text-green-800"
                    onClick={() => handleDashboardRoute('SUPERADMIN')}
                >
                    SuperAdmin
                </button>
            </div>
        </div>
    )
}

export default Navbar;
