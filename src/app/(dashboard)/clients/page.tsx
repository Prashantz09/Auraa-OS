"use client";

import { useEffect, useState } from "react";
import { Client, Project, getClients, addClient, updateClient, deleteClient, getProjects } from "@/lib/db";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/lib/AuthContext";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [projectsCount, setProjectsCount] = useState<Record<string, { total: number, latest: number }>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Form State
    const [clientName, setClientName] = useState("");
    const [servicesInput, setServicesInput] = useState("");

    const { user } = useAuth();
    const canManageClient = user?.role === "admin" || user?.role === "manager";

    const fetchData = async () => {
        const data = await getClients();
        const projs = await getProjects();
        setClients(data);

        const counts: Record<string, { total: number, latest: number }> = {};
        projs.forEach(p => {
            if (!counts[p.clientId]) counts[p.clientId] = { total: 0, latest: 0 };
            counts[p.clientId].total += 1;
            if (p.projectDate > counts[p.clientId].latest) {
                counts[p.clientId].latest = p.projectDate;
            }
        });
        setProjectsCount(counts);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setClientName("");
        setServicesInput("");
        setEditingClient(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (client: Client) => {
        setEditingClient(client);
        setClientName(client.clientName);
        setServicesInput(client.services.join(", "));
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const services = servicesInput.split(",").map(s => s.trim()).filter(Boolean);

        if (editingClient) {
            await updateClient(editingClient.id, { clientName, services });
        } else {
            await addClient({ clientName, services });
        }
        await fetchData();
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete client "${name}"? This removes them from the list, but their projects exist. Proceed?`)) {
            await deleteClient(id);
            await fetchData();
        }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Manage your list of clients and their services.</p>
                </div>
                {canManageClient && (
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Plus className="w-4 h-4" />
                            Add Client
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clients.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No clients exist yet. Add your first client to get started.</p>
                    </div>
                ) : (
                    clients.map((client) => {
                        const stats = projectsCount[client.id] || { total: 0, latest: 0 };
                        return (
                            <div key={client.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all">
                                <div className="p-5 border-b border-gray-50 dark:border-gray-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={client.clientName}>{client.clientName}</h3>
                                        {canManageClient && (
                                            <div className="flex gap-1">
                                                <button onClick={() => handleOpenEdit(client)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(client.id, client.clientName)} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {client.services.map((svc, i) => (
                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 uppercase tracking-wider">
                                                {svc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 dark:bg-gray-800/20 p-4 flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-center mb-4 text-sm">
                                        <div className="text-gray-500 dark:text-gray-400">Total Projects</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{stats.total}</div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4 text-sm">
                                        <div className="text-gray-500 dark:text-gray-400">Latest Project</div>
                                        <div className="font-medium text-gray-700 dark:text-gray-300">
                                            {stats.latest > 0 ? new Date(stats.latest).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                    <Link href={`/projects?client=${client.id}`} className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        View Projects <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editingClient ? "Edit Client" : "Add New Client"}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                                <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services Offered</label>
                                <input required type="text" value={servicesInput} onChange={e => setServicesInput(e.target.value)} placeholder="YouTube, Reels, Podcast..." className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate multiple services with commas.</p>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/30">Save Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
