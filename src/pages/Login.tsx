import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupabaseDataManager from "../utils/supabaseDataManager";

// Default admin account (hidden from UI but still functional)
const DEFAULT_ADMIN = {
  id: "prash",
  name: "Prash",
  role: "admin",
  avatar: "P",
  status: "active",
  email: "prash@auraa.com",
};

// Hidden user IDs that shouldn't appear in available accounts
const HIDDEN_USER_IDS = ["prash", "aartee", "wife"];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Load users from multiple sources on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        let allUsers: any[] = [];

        // Try to load from localStorage (Settings created users)
        try {
          const localStorageKeys = [
            "auraa-users",
            "users",
            "app-users",
            "auraa_users",
          ];
          for (const key of localStorageKeys) {
            const stored = localStorage.getItem(key);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                const activeLocalUsers = parsed.filter(
                  (u) =>
                    u.status === "active" &&
                    !HIDDEN_USER_IDS.includes(u.id?.toLowerCase()), // Filter out hidden users
                );
                allUsers = [...allUsers, ...activeLocalUsers];
                break;
              }
            }
          }
        } catch (localError) {
          console.warn("Error loading local users:", localError);
        }

        // Try to load from Supabase
        try {
          const supabaseUsers = await SupabaseDataManager.getUsers();
          const activeSupabaseUsers = supabaseUsers.filter(
            (u) =>
              u.status === "active" &&
              !HIDDEN_USER_IDS.includes(u.id?.toLowerCase()), // Filter out hidden users
          );
          allUsers = [...allUsers, ...activeSupabaseUsers];
        } catch (supabaseError) {
          console.warn("Error loading Supabase users:", supabaseError);
        }

        // Remove duplicates based on ID
        const uniqueUsers = allUsers.filter(
          (user, index, arr) =>
            arr.findIndex(
              (u) => u.id?.toLowerCase() === user.id?.toLowerCase(),
            ) === index,
        );

        setAvailableUsers(uniqueUsers);
        console.log("Loaded users (filtered):", uniqueUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        setAvailableUsers([]);
      }
    };
    loadUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userIdLower = formData.userId.toLowerCase().trim();
      const password = formData.password.trim();

      console.log("Login attempt:", { userId: userIdLower });

      // Check admin credentials first (hidden from UI but still functional)
      if (userIdLower === "prash" && password === "admin123") {
        localStorage.setItem("auraa_user", JSON.stringify(DEFAULT_ADMIN));
        navigate("/dashboard");
        return;
      }

      // Load all users (including hidden ones) for authentication
      let allAuthUsers: any[] = [];

      // Load from localStorage for authentication
      try {
        const localStorageKeys = [
          "auraa-users",
          "users",
          "app-users",
          "auraa_users",
        ];
        for (const key of localStorageKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              const activeUsers = parsed.filter((u) => u.status === "active");
              allAuthUsers = [...allAuthUsers, ...activeUsers];
              break;
            }
          }
        }
      } catch (localError) {
        console.warn("Error loading local auth users:", localError);
      }

      // Load from Supabase for authentication
      try {
        const supabaseUsers = await SupabaseDataManager.getUsers();
        const activeSupabaseUsers = supabaseUsers.filter(
          (u) => u.status === "active",
        );
        allAuthUsers = [...allAuthUsers, ...activeSupabaseUsers];
      } catch (supabaseError) {
        console.warn("Error loading Supabase auth users:", supabaseError);
      }

      // Check against all users (including hidden ones) for authentication
      const foundUser = allAuthUsers.find((user) => {
        if (!user || !user.id) return false;

        const userMatches =
          user.id?.toLowerCase() === userIdLower ||
          user.name?.toLowerCase() === userIdLower ||
          user.email?.toLowerCase() === userIdLower;

        // For local users (created in Settings), check stored password
        if (userMatches && user.password && user.password === password) {
          return true;
        }

        return false;
      });

      if (foundUser) {
        console.log("User found:", foundUser.id);

        // If user has email and no direct password match, try Supabase auth
        if (foundUser.email && !foundUser.password) {
          try {
            const authResult = await SupabaseDataManager.signIn(
              foundUser.email,
              password,
            );
            if (authResult) {
              const sessionUser = {
                id: foundUser.id,
                name: foundUser.name,
                role: foundUser.role || "user",
                avatar: foundUser.avatar,
                email: foundUser.email,
                status: foundUser.status,
              };
              localStorage.setItem("auraa_user", JSON.stringify(sessionUser));
              navigate("/dashboard");
              return;
            }
          } catch (authError) {
            console.warn("Supabase auth failed:", authError);
          }
        }

        // For users with stored passwords (Settings users)
        if (foundUser.password && foundUser.password === password) {
          const sessionUser = {
            id: foundUser.id,
            name: foundUser.name || foundUser.id,
            role: foundUser.role || "editor",
            avatar:
              foundUser.avatar ||
              foundUser.name?.charAt(0)?.toUpperCase() ||
              "U",
            email: foundUser.email,
            status: foundUser.status || "active",
          };
          localStorage.setItem("auraa_user", JSON.stringify(sessionUser));
          navigate("/dashboard");
          return;
        }
      }

      setError("Invalid User ID or password");
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: any) => {
    setFormData({
      userId: user.id || user.name || user.email || "",
      password: user.password ? user.password : "", // Auto-fill known passwords
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Mobile-first responsive container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo and Title - Mobile Optimized */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 shadow-2xl shadow-blue-600/20">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-white">
                dashboard
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Auraa OS
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Team Collaboration Platform
            </p>
          </div>

          {/* Login Form - Mobile Optimized */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User ID Field */}
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  User ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-500">
                      person
                    </span>
                  </div>
                  <input
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-12 pr-4 py-4 text-base sm:text-sm transition-all outline-none"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    placeholder="Enter your User ID or Email"
                    type="text"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-500">
                      lock
                    </span>
                  </div>
                  <input
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-12 pr-12 py-4 text-base sm:text-sm transition-all outline-none"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-gray-500 hover:text-gray-300 transition-colors">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400 text-lg">
                      error
                    </span>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-blue-600/25"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      refresh
                    </span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">login</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Available Accounts - Only show visible users */}
            {availableUsers.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    group
                  </span>
                  Available Accounts ({availableUsers.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableUsers.map((user, index) => (
                    <button
                      key={user.id || index}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 transition-all text-left group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                          user.role === "admin"
                            ? "bg-purple-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            {user.name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {user.id} {user.email && `• ${user.email}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span className="material-symbols-outlined text-gray-600 group-hover:text-gray-400 text-sm">
                          login
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Tap an account to auto-fill credentials
                </p>
              </div>
            )}

            {/* Empty state when no users available */}
            {availableUsers.length === 0 && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-gray-600 mb-3">
                    person_off
                  </span>
                  <p className="text-sm text-gray-500 mb-2">
                    No user accounts available
                  </p>
                  <p className="text-xs text-gray-600">
                    Contact your administrator to create an account
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Mobile Optimized */}
          <div className="text-center mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-500">System Online</span>
            </div>
            <p className="text-sm text-gray-400">
              Powered by{" "}
              <span className="text-blue-400 font-semibold">Supabase</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
