import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Demo user accounts
const DEMO_USERS = [
  { id: "bishal", password: "bishal123", name: "Bishal", role: "Editor" },
  { id: "radha", password: "radha123", name: "Radha", role: "Manager" },
  { id: "nishan", password: "nishan123", name: "Nishan", role: "Editor" },
];

export default function AuraaControlLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication
    setTimeout(() => {
      try {
        console.log("Attempting login with:", formData.userId);

        // Admin Login: Direct access
        if (formData.userId === "prash" && formData.password === "Admin") {
          console.log("Admin login successful");
          alert("Logged in as Admin");
          navigate("/dashboard");
          return;
        }

        // Check individual demo users
        const demoUser = DEMO_USERS.find(
          (user) =>
            user.id === formData.userId && user.password === formData.password,
        );

        if (demoUser) {
          console.log("Demo user login successful:", demoUser.name);
          alert(`Logged in as ${demoUser.name}`);
          navigate("/dashboard");
          return;
        }

        // Invalid Login
        console.log("Login failed - invalid credentials");
        setError("Invalid user ID or password");
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login");
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

  const handleProfileSelect = (name: string, role: string) => {
    console.log(`Logged in as ${name} (${role})`);
    alert(`Logged in as ${name}`);
    setShowProfileSelector(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0B1021] flex items-center justify-center p-4">
      {/* Main Login Container */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <span className="material-symbols-outlined text-white text-2xl">
              dashboard
            </span>
          </div>
          <h1 className="text-white text-4xl font-bold mb-2">AURAA</h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            CONTROL SYSTEM
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-xl">
            <p className="text-red-400 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* User ID Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-lg">person</span>
            </div>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="w-full bg-[#131A35] border border-gray-600 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="User ID"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-lg">lock</span>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-[#131A35] border border-gray-600 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In to AURAA Control"}
          </button>
        </form>

        {/* Demo Accounts Box */}
        <div className="mt-8 p-4 bg-[#131A35] rounded-xl border border-gray-600">
          <p className="text-gray-400 text-sm mb-3 text-center">
            Demo Accounts:
          </p>
          <div className="space-y-2 text-sm">
            <div className="text-gray-300">
              <span className="text-white font-medium">bishal</span> / bishal123
              (Editor)
            </div>
            <div className="text-gray-300">
              <span className="text-white font-medium">radha</span> / radha123
              (Manager)
            </div>
            <div className="text-gray-300">
              <span className="text-white font-medium">nishan</span> / nishan123
              (Editor)
            </div>
          </div>
        </div>
      </div>

      {/* Profile Selector Overlay */}
      {showProfileSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0B1021] rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-white text-3xl text-center mb-8">
              Who is using this?
            </h2>

            <div className="space-y-4">
              {/* Bishal Profile */}
              <button
                onClick={() => handleProfileSelect("Bishal", "Editor")}
                className="w-full bg-[#131A35] border border-gray-600 rounded-xl p-6 flex items-center gap-4 hover:bg-[#1a2332] transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-lg">Bishal</p>
                  <p className="text-gray-400">(Editor)</p>
                </div>
              </button>

              {/* Radha Profile */}
              <button
                onClick={() => handleProfileSelect("Radha", "Manager")}
                className="w-full bg-[#131A35] border border-gray-600 rounded-xl p-6 flex items-center gap-4 hover:bg-[#1a2332] transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-lg">Radha</p>
                  <p className="text-gray-400">(Manager)</p>
                </div>
              </button>

              {/* Nishan Profile */}
              <button
                onClick={() => handleProfileSelect("Nishan", "Editor")}
                className="w-full bg-[#131A35] border border-gray-600 rounded-xl p-6 flex items-center gap-4 hover:bg-[#1a2332] transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-lg">Nishan</p>
                  <p className="text-gray-400">(Editor)</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
