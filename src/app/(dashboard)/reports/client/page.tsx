"use client";

import { useEffect, useState, useMemo } from "react";
import { getClient, getProjects } from "@/lib/db";
import type { Client, Project } from "@/lib/db";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
    ChevronLeft,
    FileText,
    Download,
    Archive,
    Phone,
    Mail,
    Briefcase,
    CheckCircle,
    PlayCircle,
    DollarSign,
    Calendar,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { generateProjectInvoice, generateProjectReport, downloadZip, generateAllProjectsReport } from "@/lib/reportUtils";

function ClientReportContent() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get("id");

    const [client, setClient] = useState<Client | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Route protection
    useEffect(() => {
        if (!isLoading && user?.role !== "admin") {
            router.replace("/dashboard");
        }
    }, [user, isLoading, router]);

    // Fetch Client and Projects
    useEffect(() => {
        if (user?.role === "admin" && clientId) {
            setLoadingData(true);
            Promise.all([
                getClient(clientId),
                getProjects()
            ])
                .then(([clientData, allProjects]) => {
                    if (!clientData) {
                        setError("Client not found.");
                        setLoadingData(false);
                        return;
                    }

                    setClient(clientData);

                    const clientProjects = allProjects.filter((p: Project) => p.clientId === clientId);
                    // Sort projects by newest first
                    clientProjects.sort((a: Project, b: Project) => b.createdDate - a.createdDate);
                    setProjects(clientProjects);

                    // Calculate total revenue from approved payments for this client's projects
                    const revenue = clientProjects
                        .filter((p: Project) => p.status === "Completed")
                        .reduce((sum: number, p: Project) => sum + (p.budget || 0), 0);
                    setTotalRevenue(revenue);

                    setLoadingData(false);
                })
                .catch(err => {
                    console.error("Error fetching client report data:", err);
                    setError("Failed to load client data.");
                    setLoadingData(false);
                });
        }
    }, [user, clientId]);

    const stats = useMemo(() => {
        const active = projects.filter(p => p.status === "Working").length;
        const completed = projects.filter(p => p.status === "Completed").length;
        return { total: projects.length, active, completed };
    }, [projects]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (ts?: number) => {
        if (!ts) return "—";
        return format(new Date(ts), "MMM d, yyyy");
    };

    // Download handlers
    const handleDownloadInvoice = (project: Project) => {
        if (!client) return;
        const pdf = generateProjectInvoice(project, client);
        pdf.save(`Invoice_${project.projectName.replace(/\s+/g, '_')}.pdf`);
    };

    const handleDownloadReport = (project: Project) => {
        if (!client) return;
        const pdf = generateProjectReport(project, client);
        pdf.save(`Report_${project.projectName.replace(/\s+/g, '_')}.pdf`);
    };

    const handleDownloadAllInvoices = async () => {
        if (!client || projects.length === 0) return;
        const items = projects.map(p => ({
            name: `Invoice_${p.projectName.replace(/\s+/g, '_')}.pdf`,
            pdf: generateProjectInvoice(p, client)
        }));
        await downloadZip(`${client.clientName.replace(/\s+/g, '_')}_All_Invoices`, items);
    };

    const handleDownloadAllReports = () => {
        if (!client || projects.length === 0) return;
        const pdf = generateAllProjectsReport(projects, client);
        pdf.save(`${client.clientName.replace(/\s+/g, '_')}_All_Reports.pdf`);
    };

    if (isLoading || loadingData) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user?.role !== "admin") return null;

    if (error || !client) {
        return (
            <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error || "Client not found."}</p>
                </div>
                <Link href="/reports" className="mt-4 inline-flex items-center text-blue-600 hover:underline text-sm font-medium">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Reports
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link href="/reports" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-2">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Reports
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {client.clientName}
                    </h1>
                    {(client.email || client.phone) && (
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {client.email && (
                                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                                    <Mail className="w-3.5 h-3.5" /> {client.email}
                                </span>
                            )}
                            {client.phone && (
                                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                                    <Phone className="w-3.5 h-3.5" /> {client.phone}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Section (Stats Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Projects</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shrink-0">
                        <PlayCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Active Projects</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Completed</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shrink-0">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
                    </div>
                </div>
            </div>

            {/* Project List Section */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Client Projects</h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleDownloadAllInvoices}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            <Archive className="w-4 h-4" />
                            All Invoices (ZIP)
                        </button>
                        <button
                            onClick={handleDownloadAllReports}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <Archive className="w-4 h-4" />
                            All Reports (ZIP)
                        </button>
                    </div>
                </div>

                <div className="p-0">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="py-3.5 px-6 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Name</th>
                                    <th className="py-3.5 px-6 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="py-3.5 px-6 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                                    <th className="py-3.5 px-6 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Budget</th>
                                    <th className="py-3.5 px-6 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                            <Briefcase className="w-8 h-8 opacity-30 mx-auto mb-2" />
                                            <p className="text-sm">No projects found for this client.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map(project => (
                                        <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                                                {project.projectName}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${project.status === "Completed"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                                    : project.status === "Working"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                                        : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                                    }`}>
                                                    {project.status === "Working" ? "Active" : project.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-1.5" title="Start Date">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                        {formatDate(project.createdDate)}
                                                    </div>
                                                    {project.deadline && (
                                                        <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400" title="Deadline">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {formatDate(project.deadline)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                {project.budget ? formatCurrency(project.budget) : "—"}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                                        title="Download Invoice PDF"
                                                    >
                                                        <Download className="w-3.5 h-3.5" /> Invoice
                                                    </button>
                                                    <button
                                                        className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg transition-colors border border-blue-100 dark:border-blue-800/50"
                                                        title="Download Report PDF"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" /> Report
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Project Cards */}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {projects.length === 0 ? (
                            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                <Briefcase className="w-8 h-8 opacity-30 mx-auto mb-2" />
                                <p className="text-sm">No projects found for this client.</p>
                            </div>
                        ) : (
                            projects.map(project => (
                                <div key={project.id} className="p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white leading-tight mb-1">{project.projectName}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(project.createdDate)}</span>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${project.status === "Completed"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                            : project.status === "Working"
                                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                                : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                            }`}>
                                            {project.status === "Working" ? "Active" : project.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-semibold">Budget</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{project.budget ? formatCurrency(project.budget) : "—"}</p>
                                        </div>
                                        {project.deadline && (
                                            <div>
                                                <p className="text-[10px] text-orange-600 dark:text-orange-400 uppercase font-semibold">Deadline</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-xs mt-0.5">{formatDate(project.deadline)}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={() => handleDownloadInvoice(project)}
                                            className="flex-1 px-3 py-2 flex justify-center items-center gap-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors border border-gray-200 dark:border-gray-700"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Invoice
                                        </button>
                                        <button
                                            onClick={() => handleDownloadReport(project)}
                                            className="flex-1 px-3 py-2 flex justify-center items-center gap-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl transition-colors border border-blue-100 dark:border-blue-800/50"
                                        >
                                            <FileText className="w-3.5 h-3.5" /> Report
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ClientReportPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ClientReportContent />
        </Suspense>
    );
}
