import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Default admin account
const DEFAULT_ADMIN = {
  id: "prash",
  password: "admin123",
  name: "Prash",
  role: "admin",
  avatar: "P",
};

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Load users from localStorage on component mount
  useEffect(() => {
    try {
      // Try multiple possible localStorage keys for compatibility
      const possibleKeys = ["auraa-users", "users", "app-users", "auraa_users"];

      let savedUsers: any[] = [];

      for (const key of possibleKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          console.log(`Found users in ${key}:`, stored);
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              savedUsers = parsed;
              console.log(
                `Successfully loaded ${savedUsers.length} users from ${key}`,
              );
              break;
            }
          } catch (parseError) {
            console.warn(`Failed to parse users from ${key}:`, parseError);
          }
        }
      }

      // Use only saved users (no default fallback users)
      setUsers(savedUsers);

      // Create display list with only non-admin saved users (filtered)
      const displayUsers = []; // Start with empty array (no admin)
      if (savedUsers.length > 0) {
        // Filter out unwanted users and admin
        const filteredUsers = savedUsers.filter((user) => {
          const userId = (user.id || "").toLowerCase();
          // Remove users with "wife" in ID, first admin user, and admin users
          return (
            !userId.includes("wife") &&
            userId !== "first admin" &&
            userId !== "prash" && // Remove main admin
            user.role !== "admin" // Remove any admin role users
          );
        });
        displayUsers.push(...filteredUsers);
      }
      setAvailableUsers(displayUsers);

      console.log("Total available users:", savedUsers);
      console.log("Users for display:", displayUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      // Fallback to empty users array
      setUsers([]);
      setAvailableUsers([DEFAULT_ADMIN]);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication delay
    setTimeout(() => {
      try {
        const userIdLower = formData.userId.toLowerCase().trim();
        const password = formData.password.trim();

        console.log("Login attempt:", { userId: userIdLower, password });
        console.log("Available users:", users);

        // Check admin first
        if (
          userIdLower === DEFAULT_ADMIN.id &&
          password === DEFAULT_ADMIN.password
        ) {
          console.log("✅ Admin login successful");
          localStorage.setItem("auraa_user", JSON.stringify(DEFAULT_ADMIN));
          navigate("/dashboard");
          setIsLoading(false);
          return;
        }

        // Check created users with better validation
        const authenticatedUser = users.find((user) => {
          if (!user || !user.id || !user.password) {
            console.warn("Invalid user object:", user);
            return false;
          }

          const userIdMatch = user.id.toLowerCase().trim() === userIdLower;
          const passwordMatch = user.password.trim() === password;

          console.log(`Checking user ${user.id}:`, {
            userIdMatch,
            passwordMatch,
            storedId: user.id.toLowerCase().trim(),
            inputId: userIdLower,
            storedPassword: user.password.trim(),
            inputPassword: password,
          });

          return userIdMatch && passwordMatch;
        });

        if (authenticatedUser) {
          console.log("✅ User login successful:", authenticatedUser);

          // Create session with proper fallbacks
          const userSession = {
            id: authenticatedUser.id,
            name: authenticatedUser.name || authenticatedUser.id || "User",
            role: authenticatedUser.role || "editor",
            avatar:
              authenticatedUser.avatar ||
              authenticatedUser.name?.charAt(0)?.toUpperCase() ||
              authenticatedUser.id?.charAt(0)?.toUpperCase() ||
              "U",
          };

          localStorage.setItem("auraa_user", JSON.stringify(userSession));
          navigate("/dashboard");
        } else {
          console.log("❌ Login failed - no matching user found");
          setError(
            "Invalid credentials. Please check your User ID and password.",
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login. Please try again.");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const fillCredentials = (userId: string, password: string) => {
    setFormData({ userId, password });
    setError("");
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden max-w-md mx-auto w-full bg-black text-white">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 flex flex-col flex-1 h-full p-6 justify-center">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 flex items-center justify-center mb-6">
            <img
              src="/New_logo.webp"
              alt="AURAA Control System"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white tracking-tight text-4xl font-bold leading-tight text-center">
            AURAA
          </h1>
          <p className="text-gray-400 text-sm font-medium leading-normal pt-2 text-center uppercase tracking-widest">
            Control System
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            </div>
          )}

          {/* User ID Input */}
          <div className="space-y-2">
            <label
              className="block text-gray-300 text-sm font-medium ml-1"
              htmlFor="userId"
            >
              User ID
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500 group-focus-within:text-blue-400 transition-colors duration-200">
                  badge
                </span>
              </div>
              <input
                className="block w-full rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-11 pr-4 py-4 sm:text-sm transition-all outline-none"
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
            <label
              className="block text-gray-300 text-sm font-medium ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500 group-focus-within:text-blue-400 transition-colors duration-200">
                  lock
                </span>
              </div>
              <input
                className="block w-full rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-11 pr-12 py-4 sm:text-sm transition-all outline-none"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold leading-normal h-12 px-5 shadow-2xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Available Accounts */}
        <div className="mt-8 p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-300">
              Available Accounts:
            </p>
            <span className="text-xs text-gray-500">
              {availableUsers.length} user
              {availableUsers.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableUsers.length > 0 ? (
              availableUsers.map((user, index) => (
                <button
                  key={user.id || index}
                  onClick={() => {
                    if (user.id === "prash") {
                      fillCredentials("prash", "admin123");
                    } else {
                      fillCredentials(user.id, user.password);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full text-left p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50 hover:border-gray-600 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        user.role === "admin" ? "bg-purple-600" : "bg-blue-600"
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-300 group-hover:text-white">
                          {user.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.name || "Unknown User"}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 group-hover:text-gray-400 text-sm">
                      login
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4">
                <span className="material-symbols-outlined text-gray-600 text-2xl mb-2">
                  person_off
                </span>
                <p className="text-xs text-gray-500">
                  No additional users available
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Create users in Settings to see them here
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-600 mt-3 text-center">
            {availableUsers.length === 1
              ? "Only admin account available"
              : "Click any account to auto-fill credentials"}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-gray-600 text-xs">AURAA Control © 2024</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-600 text-xs font-mono">
              System Operational
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
