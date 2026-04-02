"use client";

import { Bell, Megaphone, Sparkles, ChevronDown, ChevronUp, Check, Menu } from "lucide-react";
import { Notification, getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/db";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type Tab = "admin" | "system";

// ── Header ─────────────────────────────────────────────────────────────────
export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const pathname = usePathname();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("admin");

    const fetchNotifs = async () => {
        const data = await getNotifications();
        setNotifications(data);
    };

    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 10000);
        return () => clearInterval(interval);
    }, []);

    const unreadAdminCount = notifications.filter(n => !n.readStatus).length;

    const totalUnread = unreadAdminCount;

    const handleRead = async (id: string) => {
        await markNotificationRead(id);
        fetchNotifs();
    };

    const handleReadAll = async () => {
        await markAllNotificationsRead();
        fetchNotifs();
    };

    const title = pathname === "/dashboard"
        ? "Dashboard"
        : pathname.split('/')[1]?.charAt(0).toUpperCase() + pathname.split('/')[1]?.slice(1);

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md sticky top-0 z-30 transition-colors">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title || "Dashboard"}</h1>
            </div>

            <div className="flex items-center gap-4 relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                    {totalUnread > 0 && (
                        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    )}
                </button>

                <button
                    onClick={onMenuClick}
                    className="md:hidden relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="sr-only">Open Menu</span>
                    <Menu className="h-6 w-6" />
                </button>

                {isOpen && (
                    <div className="absolute top-full -right-2 sm:right-0 mt-2 w-[90vw] sm:w-96 max-w-[380px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 flex flex-col" style={{ maxHeight: '540px' }}>

                        {/* Header/Tabs Area */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col gap-3 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                {activeTab === "admin" && unreadAdminCount > 0 && (
                                    <button onClick={handleReadAll} className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shrink-0">
                                <button
                                    onClick={() => setActiveTab("admin")}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 px-2 rounded-lg transition-all",
                                        activeTab === "admin"
                                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    )}
                                >
                                    <Megaphone className="w-3.5 h-3.5" />
                                    From Admin
                                    {unreadAdminCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                                            {unreadAdminCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tab Content - Scrollable Region */}
                        <div className="overflow-y-auto flex-1 h-full min-h-[100px]" style={{ maxHeight: '420px' }}>
                            {/* ── Admin Tab ── */}
                            {activeTab === "admin" && (
                                notifications.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
                                        <Bell className="w-8 h-8 opacity-20" />
                                        <span>No notifications yet.</span>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={clsx(
                                                    "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
                                                    !notif.readStatus && "bg-blue-50/50 dark:bg-blue-900/10"
                                                )}
                                                onClick={() => handleRead(notif.id)}
                                            >
                                                <p className={clsx("text-sm", !notif.readStatus ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400")}>
                                                    {notif.message}
                                                </p>
                                                <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
                                                    <span>{formatDistanceToNow(notif.createdAt, { addSuffix: true })}</span>
                                                    {!notif.readStatus && (
                                                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Overlay to close dropdown */}
                {isOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                )}
            </div>
        </header>
    );
}
