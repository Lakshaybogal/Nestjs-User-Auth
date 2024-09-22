'use client'

import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/api'
import { AuthContext, AuthProps, User } from '@/app/context/authContext'

export default function Login() {
    const router = useRouter()
    const authConext: AuthProps | null = useContext(AuthContext)
    const { user } = authConext || {}
    if (user) {
        router.push('/')
    }
    const setUser: React.Dispatch<React.SetStateAction<User | null>> = authConext?.setUser || (() => { })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await login(email, password);
        if (res && res.status >= 200 && res.status < 300) {
            setUser(res.data.data)
            router.push('/')
        }
        else {
            console.log(res.response.data.message)
            setError(res.response.data.message)
        }

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
                {
                    error && <div className="bg-red-500 text-white p-4">{error}</div>
                }
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Login</h2>
                    <p className="text-center text-gray-600 mb-8">Welcome back! Please login to your account.</p>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        {/* <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div> */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={() => router.push('/auth/register')} className="text-blue-600 hover:underline">
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}