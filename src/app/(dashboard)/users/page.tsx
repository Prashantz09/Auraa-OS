"use client";

import { useEffect, useState } from "react";
import { User, getUsers, addUser, updateUser, deleteUser, Role } from "@/lib/db";
import { Plus, Edit2, Trash2, KeyRound } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("editor");
    const [avatar, setAvatar] = useState("");

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setName("");
        setUserId("");
        setPassword("");
        setRole("editor");
        setAvatar("");
        setEditingUser(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setName(user.name);
        setUserId(user.userId);
        setRole(user.role);
        setAvatar(user.avatar);
        setPassword(""); // Do not show existing password, only allow changing it
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            const updates: Partial<User> = { name, userId, role, avatar };
            if (password) updates.password = password; // Only update if provided
            await updateUser(editingUser.id, updates);
        } else {
            await addUser({
                name,
                userId,
                password: password || "password", // default if empty
                role,
                avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            });
        }
        await fetchUsers();
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string, currentRole: string) => {
        if (currentRole === "admin" && users.filter(u => u.role === "admin").length === 1) {
            alert("Cannot delete the last admin user.");
            return;
        }
        if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser(id);
            await fetchUsers();
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Manage team members, roles, and access.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User ID</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" src={user.avatar} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Created {new Date(user.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.userId}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' : user.role === 'manager' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => handleOpenEdit(user)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/40">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(user.id, user.role)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/40">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="sm:hidden mt-6 space-y-4">
                {users.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                            <img src={user.avatar} alt="" className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.userId}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' : user.role === 'manager' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                                }`}>
                                {user.role}
                            </span>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                            <button onClick={() => handleOpenEdit(user)} className="flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => handleDelete(user.id, user.role)} className="flex items-center gap-1 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg font-medium">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editingUser ? "Edit User" : "Add New User"}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User ID (Login ID)</label>
                                <input required type="text" value={userId} onChange={e => setUserId(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {editingUser ? "Change Password (optional)" : "Password"}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required={!editingUser} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors">
                                    <option value="editor">Editor</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL (optional)</label>
                                <input type="url" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                            </div>
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/30">Save User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
