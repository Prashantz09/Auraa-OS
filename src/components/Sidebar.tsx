"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Users as ClientIcon, Briefcase, LogOut, Menu, X, Megaphone, BarChart2, Settings } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import clsx from "clsx";

export function Sidebar({ isOpen = false, setIsOpen = () => { } }: { isOpen?: boolean, setIsOpen?: (val: boolean) => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isAdmin = user?.role === "admin";

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ...(isAdmin ? [{ name: "Users", href: "/users", icon: Users }] : []),
        { name: "Clients", href: "/clients", icon: ClientIcon },
        { name: "Projects", href: "/projects", icon: Briefcase },
        ...(isAdmin ? [{ name: "Reports", href: "/reports", icon: BarChart2 }] : []),
        ...(isAdmin ? [{ name: "Notice Board", href: "/notices", icon: Megaphone }] : []),
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <div className={clsx(
                "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl leading-none">A</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">AURAA</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ml-1">Control</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={clsx(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                            active
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                                        )}
                                    >
                                        <item.icon className={clsx("w-5 h-5", active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500")} />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 object-cover border border-gray-200 dark:border-gray-700" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="w-5 h-5 text-red-500" />
                        Sign out
                    </button>
                </div>
            </div>
        </>
    );
}
