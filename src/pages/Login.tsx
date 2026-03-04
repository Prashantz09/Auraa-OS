import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupabaseDataManager from "../utils/supabaseDataManager";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Load users from Supabase on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await SupabaseDataManager.getUsers();
        setAvailableUsers(users.filter(u => u.status === 'active'));
      } catch (error) {
        console.error('Error loading users:', error);
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
      // Try Supabase authentication first
      if (formData.email && formData.password) {
        const user = await SupabaseDataManager.signIn(formData.email, formData.password);
        
        // Store user session (you might want to use Supabase session management)
        localStorage.setItem("auraa_user", JSON.stringify(user));
        navigate("/dashboard");
        return;
      }

      // Fallback for demo accounts (if needed)
      const demoUser = availableUsers.find(u => u.email === formData.email);
      if (demoUser && formData.password === "password") {
        localStorage.setItem("auraa_user", JSON.stringify(demoUser));
        navigate("/dashboard");
        return;
      }

      setError("Invalid email or password");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: any) => {
    setFormData({ email: user.email || "", password: "password" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl mb-4">
            <span className="material-symbols-outlined text-3xl text-white">dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Auraa OS</h1>
          <p className="text-slate-400">Team Collaboration Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400">person</span>
                </div>
                <input
                  className="block w-full rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary pl-11 pr-4 py-4 sm:text-sm transition-all outline-none"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  type="email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400">lock</span>
                </div>
                <input
                  className="block w-full rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary pl-11 pr-12 py-4 sm:text-sm transition-all outline-none"
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-slate-400 hover:text-white transition-colors">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
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

          {/* Available Accounts */}
          {availableUsers.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Available Accounts</h3>
              <div className="space-y-2">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {user.role}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Click on an account to auto-fill credentials
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-400">
            Powered by <span className="text-primary font-semibold">Supabase</span>
          </p>
        </div>
      </div>
    </div>
  );
}
