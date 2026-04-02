"use client";

import { useEffect, useState, useMemo } from "react";
import { getClients, getProjects } from "@/lib/db";
import type { Client, Project } from "@/lib/db";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { FileBarChart, Search, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ClientStats extends Client {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    lastUpdated: number;
}

export default function ReportsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [clients, setClients] = useState<ClientStats[]>([]);
    const [search, setSearch] = useState("");
    const [loadingData, setLoadingData] = useState(true);

    // Route protection
    useEffect(() => {
        if (!isLoading && user?.role !== "admin") {
            router.replace("/dashboard");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user?.role === "admin") {
            Promise.all([getClients(), getProjects()]).then(([allClients, allProjects]) => {
                const stats = allClients.map((client) => {
                    const clientProjects = allProjects.filter((p) => p.clientId === client.id);
                    const active = clientProjects.filter((p) => p.status === "Working").length;
                    const completed = clientProjects.filter((p) => p.status === "Completed").length;

                    // Find mostly recently updated project or client creation date
                    const lastUpdated = clientProjects.length > 0
                        ? Math.max(...clientProjects.map((p) => p.createdDate))
                        : client.createdAt;

                    return {
                        ...client,
                        totalProjects: clientProjects.length,
                        activeProjects: active,
                        completedProjects: completed,
                        lastUpdated,
                    };
                }).sort((a, b) => b.lastUpdated - a.lastUpdated);

                setClients(stats);
                setLoadingData(false);
            });
        }
    }, [user]);

    const filteredClients = useMemo(() => {
        if (!search.trim()) return clients;
        return clients.filter((c) =>
            c.clientName.toLowerCase().includes(search.toLowerCase())
        );
    }, [clients, search]);

    if (isLoading || loadingData) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user?.role !== "admin") return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileBarChart className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        Client Reports
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Detailed reporting and analytics for all clients.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none flex-1 ml-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                    />
                </div>

                <div className="mt-6">
                    {filteredClients.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <FileBarChart className="w-10 h-10 opacity-30 mx-auto mb-2" />
                            <p className="text-sm font-medium">No clients found.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            <th className="py-3 px-4 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Name</th>
                                            <th className="py-3 px-4 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Total Projects</th>
                                            <th className="py-3 px-4 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Active</th>
                                            <th className="py-3 px-4 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Completed</th>
                                            <th className="py-3 px-4 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left">Last Update</th>
                                            <th className="py-3 px-4 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {filteredClients.map((client) => (
                                            <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                                            {client.clientName.substring(0, 2)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>{client.clientName}</span>
                                                            {(client.email || client.phone) && (
                                                                <span className="text-xs text-gray-500 font-normal mt-0.5">
                                                                    {[client.email, client.phone].filter(Boolean).join(" • ")}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {client.totalProjects}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                                                        {client.activeProjects}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                        {client.completedProjects}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-left text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDistanceToNow(client.lastUpdated, { addSuffix: true })}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <Link
                                                        href={`/reports/client?id=${client.id}`}
                                                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium gap-1"
                                                    >
                                                        View <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile/Tablet Card View */}
                            <div className="grid grid-cols-1 md:hidden gap-4">
                                {filteredClients.map((client) => (
                                    <div key={client.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                                                    {client.clientName.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{client.clientName}</h3>
                                                    <p className="text-xs text-gray-500 flex flex-col gap-0.5 mt-0.5">
                                                        {(client.email || client.phone) && (
                                                            <span>{[client.email, client.phone].filter(Boolean).join(" • ")}</span>
                                                        )}
                                                        <span>Updated {formatDistanceToNow(client.lastUpdated, { addSuffix: true })}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 dark:border-gray-700/50 mb-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Total</p>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{client.totalProjects}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-orange-600 dark:text-orange-400 uppercase font-semibold mb-1">Active</p>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{client.activeProjects}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold mb-1">Done</p>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{client.completedProjects}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/reports/client?id=${client.id}`}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-medium transition-colors"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Report
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
