"use client";

import { useEffect, useState, useMemo } from "react";
import { Project, Client, User, getProjects, getClients, getUsers, addProject, updateProject, deleteProject, ServiceType, ProjectStatus } from "@/lib/db";
import { Plus, Edit2, Trash2, Filter, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useSearchParams } from "next/navigation";

export default function ProjectsPage() {
    const searchParams = useSearchParams();
    const defaultClientFilter = searchParams.get("client") || "";

    const { user } = useAuth();
    const canManageProject = user?.role === "admin" || user?.role === "manager" || user?.role === "editor";

    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Filters
    const [search, setSearch] = useState("");
    const [clientFilter, setClientFilter] = useState(defaultClientFilter);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Form State
    const [projectName, setProjectName] = useState("");
    const [clientId, setClientId] = useState("");
    const [serviceType, setServiceType] = useState<ServiceType>("YouTube Video");
    const [assignedEditorId, setAssignedEditorId] = useState("");
    const [status, setStatus] = useState<ProjectStatus>("Working");
    const [projectDateTime, setProjectDateTime] = useState("");

    // Helper: convert timestamp to datetime-local string (local time)
    const tsToDatetimeLocal = (ts: number) => {
        const d = new Date(ts);
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // Helper: format timestamp for display
    const formatDateTime = (ts: number) => {
        if (!ts) return 'N/A';
        const d = new Date(ts);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
            ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    const fetchData = async () => {
        const [p, c, u] = await Promise.all([getProjects(), getClients(), getUsers()]);
        setProjects(p);
        setClients(c);
        setUsers(u);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const editors = users.filter(u => u.role === "editor" || u.role === "admin");

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchSearch = p.projectName.toLowerCase().includes(search.toLowerCase());
            const matchClient = clientFilter ? p.clientId === clientFilter : true;
            return matchSearch && matchClient;
        });
    }, [projects, search, clientFilter]);

    const resetForm = () => {
        setProjectName("");
        setClientId(clients[0]?.id || "");
        setServiceType("YouTube Video");
        setAssignedEditorId("");
        setStatus("Working");
        setProjectDateTime(tsToDatetimeLocal(Date.now()));
        setEditingProject(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (proj: Project) => {
        setEditingProject(proj);
        setProjectName(proj.projectName);
        setClientId(proj.clientId);
        setServiceType(proj.serviceType);
        setAssignedEditorId(proj.assignedEditorId || "");
        setStatus(proj.status);
        setProjectDateTime(tsToDatetimeLocal(proj.projectDate || Date.now()));
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const ts = projectDateTime ? new Date(projectDateTime).getTime() : Date.now();
        if (editingProject) {
            await updateProject(
                editingProject.id,
                { projectName, clientId, serviceType, assignedEditorId: assignedEditorId || null, status, projectDate: ts },
                user?.name
            );
        } else {
            await addProject({
                projectName,
                clientId,
                serviceType,
                assignedEditorId: assignedEditorId || null,
                status,
                projectDate: ts,
                createdBy: user?.name || "Unknown",
            });
        }
        await fetchData();
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete project "${name}"?`)) {
            await deleteProject(id);
            await fetchData();
        }
    };

    const getClientName = (id: string) => clients.find(c => c.id === id)?.clientName || "Unknown Client";
    const getEditorName = (id: string | null) => {
        if (!id) return "Unassigned";
        return users.find(u => u.id === id)?.name || "Unknown";
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Track and manage all your ongoing and completed projects.</p>
                </div>
                {canManageProject && (
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={handleOpenAdd}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 mb-6 transition-colors">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects by name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>
                <div className="sm:w-64 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <select
                        value={clientFilter}
                        onChange={e => setClientFilter(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                        <option value="">All Clients</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.clientName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Editor</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {filteredProjects.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No projects found.</td></tr>
                        ) : filteredProjects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{project.projectName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(project.projectDate)}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{getClientName(project.clientId)}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                        {project.serviceType}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{getEditorName(project.assignedEditorId)}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${project.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
                                        }`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {(canManageProject || project.assignedEditorId === user?.id) && (
                                            <button onClick={() => handleOpenEdit(project)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-md"><Edit2 className="w-4 h-4" /></button>
                                        )}
                                        {canManageProject && (
                                            <button onClick={() => handleDelete(project.id, project.projectName)} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="lg:hidden space-y-4">
                {filteredProjects.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm shadow-sm transition-colors">
                        No projects found.
                    </div>
                ) : filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-3 relative transition-colors">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 break-words">{project.projectName}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{getClientName(project.clientId)}</p>
                            </div>
                            <div className="shrink-0 pt-0.5">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${project.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">{project.serviceType}</span>
                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 flex items-center gap-1">
                                Editor: {getEditorName(project.assignedEditorId)}
                            </span>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 mt-1 border-t border-gray-50 dark:border-gray-800">
                            {(canManageProject || project.assignedEditorId === user?.id) && (
                                <button onClick={() => handleOpenEdit(project)} className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                            )}
                            {canManageProject && (
                                <button onClick={() => handleDelete(project.id, project.projectName)} className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 font-medium"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="my-8 bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-gray-800 transition-colors">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editingProject ? "Edit Project" : "New Project"}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                                <input required type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📅 Project Date & Time</label>
                                <input
                                    required
                                    type="datetime-local"
                                    value={projectDateTime}
                                    onChange={e => setProjectDateTime(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                                <select required value={clientId} onChange={e => setClientId(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                                    {clients.length === 0 && <option value="" disabled>No clients found - please add one first</option>}
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.clientName}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type</label>
                                <select required value={serviceType} onChange={e => setServiceType(e.target.value as ServiceType)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                                    <option value="YouTube Video">YouTube Video</option>
                                    <option value="Reels">Reels</option>
                                    <option value="Graphics">Graphics</option>
                                    <option value="Thumbnail">Thumbnail</option>
                                    <option value="Podcast">Podcast</option>
                                    <option value="Trailer Only">Trailer Only</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Editor</label>
                                <select value={assignedEditorId} onChange={e => setAssignedEditorId(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                                    <option value="">Unassigned</option>
                                    {editors.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                                    <option value="Working">Working</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" disabled={clients.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed">Save Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
