import React from 'react'
import { User } from '../context/authContext'

const Card: React.FC<{ users: User[] }> = ({ users }) => {
    if (users.length === 0) {
        return <p>No users found</p>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
                <div key={user.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                        <p className="text-gray-600 mb-2">{user.email}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">ID: {user.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : user.role === 'SUPERADMIN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Card