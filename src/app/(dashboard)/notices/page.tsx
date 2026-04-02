"use client";

import { useEffect, useState } from "react";
import { getNotices, addNotice, deleteNotice, Notice, NoticeType } from "@/lib/db";
import { Megaphone, Plus, Trash2, Calendar, Edit2, Users, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function NoticesPage() {
    const { user } = useAuth();
    const canManageNotices = user?.role === "admin";

    const [notices, setNotices] = useState<Notice[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState<NoticeType>("Update");

    const fetchData = async () => {
        const data = await getNotices();
        setNotices(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setType("Update");
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await addNotice({
            title,
            message,
            type,
            createdBy: user?.name || "System"
        });
        await fetchData();
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string, noticeTitle: string) => {
        if (confirm(`Delete notice "${noticeTitle}"?`)) {
            await deleteNotice(id);
            await fetchData();
        }
    };

    const getIconForType = (noticeType: NoticeType) => {
        switch (noticeType) {
            case "Update": return <Megaphone className="w-5 h-5 text-blue-500" />;
            case "Holiday": return <Calendar className="w-5 h-5 text-emerald-500" />;
            case "Project": return <Briefcase className="w-5 h-5 text-purple-500" />;
            case "Client": return <Users className="w-5 h-5 text-orange-500" />;
            default: return <Megaphone className="w-5 h-5 text-gray-500" />;
        }
    };

    if (!canManageNotices && user) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8">
                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-full mb-4">
                    <Megaphone className="w-8 h-8 text-red-500 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center">Only administrators can manage the Notice Board.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notice Board Manager</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Broadcast important updates to all users on their dashboard.</p>
                </div>
                {canManageNotices && (
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            New Notice
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notices.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No notices published. Create one to broadcast to the team.</p>
                    </div>
                ) : (
                    notices.map((notice) => {
                        const isExpired = (Date.now() - notice.createdAt) > 48 * 60 * 60 * 1000;
                        return (
                            <div key={notice.id} className={`bg-white dark:bg-gray-900 rounded-2xl border ${isExpired ? 'border-gray-200 dark:border-gray-800 opacity-60' : 'border-blue-100 dark:border-blue-900 shadow-md'} flex flex-col overflow-hidden transition-all relative`}>
                                {isExpired && (
                                    <div className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Expired</div>
                                )}
                                {!isExpired && (
                                    <div className="absolute top-3 right-3 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div> Active
                                    </div>
                                )}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            {getIconForType(notice.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 pr-16">{notice.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(notice.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 line-clamp-3 mb-4">{notice.message}</p>

                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50 dark:border-gray-800">
                                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">By {notice.createdBy}</div>
                                        <button onClick={() => handleDelete(notice.id, notice.title)} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create Broadcast Notice</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notice Type</label>
                                <select required value={type} onChange={e => setType(e.target.value as NoticeType)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                                    <option value="Update">General Update</option>
                                    <option value="Holiday">Holiday / Leave</option>
                                    <option value="Project">Project Announcement</option>
                                    <option value="Client">Client Announcement</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Office closed tomorrow" className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea required rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter the details of the broadcast..." className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"></textarea>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This notice will appear on the dashboard for 48 hours.</p>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/30">Publish Notice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
