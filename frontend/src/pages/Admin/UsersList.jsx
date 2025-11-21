
import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.get("/admin/users").then((res) => setUsers(res.data)).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen p-6 bg-gray-900">
            <h2 className="text-2xl font-bold text-[#38bdf8] mb-6">👥 Registered Users</h2>
            {users.length ? (
                <div>
                    <table className="min-w-full border border-gray-700 text-left text-sm text-gray-100">
                        <thead className="bg-gray-700/40">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-700/30 border-b border-gray-700">
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">{u.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400">No users found.</p>
            )}
        </div>
    );
}
