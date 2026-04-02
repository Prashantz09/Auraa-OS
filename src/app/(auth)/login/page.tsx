"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Lock, User, Eye, EyeOff } from "lucide-react";

function LoginForm() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const success = await login(userId, password);
        if (success) {
            const redirect = searchParams.get("redirect") || "/dashboard";
            router.replace(redirect);
        } else {
            setError("Invalid User ID or Password");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight">AURAA</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase">Control</p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                    {/* ── User ID Field ── */}
                    <div>
                        <label htmlFor="userId" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                            User ID
                        </label>
                        <div className="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                            {/* Icon cell */}
                            <div className="flex items-center justify-center w-11 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex-shrink-0">
                                <User className="h-5 w-5 text-blue-500" />
                            </div>
                            {/* Input */}
                            <input
                                id="userId"
                                name="userId"
                                type="text"
                                required
                                className="flex-1 py-3 px-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none"
                                placeholder="Enter your ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ── Password Field ── */}
                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                            Password
                        </label>
                        <div className="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                            {/* Icon cell */}
                            <div className="flex items-center justify-center w-11 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex-shrink-0">
                                <Lock className="h-5 w-5 text-blue-500" />
                            </div>
                            {/* Input */}
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="flex-1 py-3 px-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* Show / Hide toggle */}
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="px-3 bg-white dark:bg-gray-900 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center border-l border-gray-200 dark:border-gray-700"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/30 py-2 rounded-lg border border-red-100 dark:border-red-900/50">
                            {error}
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Developed by <span className="font-semibold text-gray-900 dark:text-gray-300">Auraa Media</span>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
