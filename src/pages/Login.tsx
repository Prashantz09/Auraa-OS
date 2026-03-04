import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// User database
const USERS = [
  {
    id: "prash",
    password: "admin123",
    name: "Prash",
    role: "admin",
    avatar: "P",
  },
  {
    id: "alex",
    password: "editor123",
    name: "Alex",
    role: "editor",
    avatar: "A",
  },
  {
    id: "sarah",
    password: "editor123",
    name: "Sarah",
    role: "editor",
    avatar: "S",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication
    setTimeout(() => {
      const user = USERS.find(
        (u) =>
          u.id === formData.userId.toLowerCase() &&
          u.password === formData.password,
      );

      if (user) {
        // Store user session
        localStorage.setItem("auraa_user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        setError("Invalid User ID or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden max-w-md mx-auto w-full bg-background-light dark:bg-background-dark shadow-2xl border-x border-surface-border">
      {/* Cinematic Background Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(10, 59, 255, 0.15) 0%, rgba(15, 19, 35, 0) 60%)",
        }}
      ></div>

      {/* Abstract Tech Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <main className="relative z-10 flex flex-col flex-1 h-full p-6 justify-center">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-900 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: "32px" }}
            >
              movie_filter
            </span>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-bold leading-tight text-center">
            AURAA
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal pt-2 text-center uppercase tracking-widest">
            Control System
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* User ID Input */}
          <div className="space-y-2">
            <label
              className="block text-slate-700 dark:text-slate-300 text-sm font-medium ml-1"
              htmlFor="userId"
            >
              User ID
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors duration-200">
                  badge
                </span>
              </div>
              <input
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary pl-11 pr-4 py-3.5 sm:text-sm sm:leading-6 transition-all shadow-sm outline-none"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="Enter your User ID"
                type="text"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label
                className="block text-slate-700 dark:text-slate-300 text-sm font-medium"
                htmlFor="password"
              >
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors duration-200">
                  lock
                </span>
              </div>
              <input
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary pl-11 pr-12 py-3.5 sm:text-sm sm:leading-6 transition-all shadow-sm outline-none"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary hover:bg-blue-700 text-white text-base font-semibold leading-normal h-12 px-5 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin">
                  refresh
                </span>
                Signing in...
              </span>
            ) : (
              "Sign In to AURAA Control"
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            Demo Accounts:
          </p>
          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">
                prash / admin123
              </span>{" "}
              (Admin)
            </div>
            <div>
              <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">
                alex / editor123
              </span>{" "}
              (Editor)
            </div>
          </div>
        </div>

        {/* Footer / Version Info */}
        <div className="mt-auto pt-10 text-center">
          <p className="text-slate-500 dark:text-slate-600 text-xs">
            AURAA Control © 2024
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="text-slate-500 dark:text-slate-600 text-xs font-mono">
              System Operational
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
