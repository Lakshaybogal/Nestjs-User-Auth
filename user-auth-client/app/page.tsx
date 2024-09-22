'use client'

import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { AuthContext, AuthProps } from './context/authContext'
import axios from 'axios'

export default function Home() {
    const authContext: AuthProps | null = useContext(AuthContext)
    const { user } = authContext || {}
    const router = useRouter()

    if (!user) {
        router.push('/auth/login')
    }

    const handleLogout = async () => {
        try {

            await axios.post(
                'http://localhost:3000/users/auth/logout',
                {},
                { withCredentials: true }
            );
            authContext?.setUser(null);
            router.push('/auth/login');
        } catch (error) {
            console.error("Error during logout", error);
        }
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome, {user?.name}!</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Role</p>
                            <p className="text-lg font-semibold text-gray-800 capitalize">{user?.role}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">User ID</p>
                            <p className="text-lg font-semibold text-gray-800">{user?.id}</p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}