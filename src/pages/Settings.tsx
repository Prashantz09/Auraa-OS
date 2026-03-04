import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample users data - only admin remains, other users must be created
const SAMPLE_USERS = [
  {
    id: "prash",
    name: "Prash",
    role: "admin",
    email: "prash@auraa.com",
    status: "active",
    avatar: "P",
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("auraa-users");
    return savedUsers ? JSON.parse(savedUsers) : SAMPLE_USERS;
  });
  const [editingUser, setEditingUser] = useState(null);

  // Notification state
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("auraa-notifications");
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      return parsed
        .map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) }))
        .filter((n: any) => {
          const now = new Date();
          const timeDiff = now.getTime() - n.createdAt.getTime();
          return timeDiff < 48 * 60 * 60 * 1000;
        });
    }
    return [
      {
        id: 1,
        title: "New Project Assignment",
        message:
          "You've been assigned to the TechCorp Q1 Marketing Campaign. Please review the brief and timeline.",
        category: "project",
        priority: "high",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: 2,
        title: "Client Meeting Scheduled",
        message:
          "Meeting with Creative Studios scheduled for tomorrow at 2:00 PM. Please prepare the project updates.",
        category: "client",
        priority: "medium",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: 3,
        title: "Office Holiday - March 25th",
        message:
          "Office will be closed on March 25th for Holi celebration. Please plan your deliverables accordingly.",
        category: "holiday",
        priority: "low",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
      },
    ];
  });

  // Form states
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    category: "project",
    priority: "medium",
  });

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    userId: "",
    password: "",
    role: "editor",
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
    language: "en",
  });

  useEffect(() => {
    const userData = localStorage.getItem("auraa_user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setUserProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email + "@auraa.com",
      }));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // For admin users, allow changing any user's password
    if (currentUser?.role === "admin") {
      // In a real app, this would make an API call to update the password
      // For now, we'll just show a success message
      if (
        userProfile.newPassword &&
        userProfile.newPassword === userProfile.confirmPassword
      ) {
        alert(
          `Password updated successfully for ${userProfile.name || "user"}!`,
        );
        // Reset password fields
        setUserProfile((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else if (userProfile.newPassword) {
        alert("New passwords do not match!");
      } else {
        alert("Profile updated successfully!");
      }
    } else {
      // For regular users, just update profile info
      alert("Profile updated successfully!");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUserProfile((prev) => ({ ...prev, profileImage: imageUrl }));

        // Update user avatar if admin
        if (currentUser?.role === "admin") {
          const updatedUsers = users.map((u) =>
            u.id === "prash"
              ? { ...u, avatar: userProfile.name.charAt(0).toUpperCase() }
              : u,
          );
          setUsers(updatedUsers);
          localStorage.setItem("auraa-users", JSON.stringify(updatedUsers));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      id: newUser.userId,
      name: newUser.name,
      password: newUser.password,
      role: newUser.role,
      status: "active",
      avatar: newUser.name.charAt(0).toUpperCase(),
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("auraa-users", JSON.stringify(updatedUsers));
    setShowAddUser(false);
    setNewUser({
      name: "",
      userId: "",
      password: "",
      role: "editor",
    });
    alert("User added successfully!");
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? editingUser : u,
      );
      setUsers(updatedUsers);
      localStorage.setItem("auraa-users", JSON.stringify(updatedUsers));
      setEditingUser(null);
      setShowAddUser(false);
      alert("User updated successfully!");
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((u) => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem("auraa-users", JSON.stringify(updatedUsers));
      alert("User deleted successfully!");
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((u) =>
      u.id === userId
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u,
    );
    setUsers(updatedUsers);
    localStorage.setItem("auraa-users", JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem("auraa_user");
    navigate("/");
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const notification = {
      id: Date.now(),
      title: newNotification.title,
      message: newNotification.message,
      category: newNotification.category,
      priority: newNotification.priority,
      createdAt: new Date(),
      read: false,
    };
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "auraa-notifications",
      JSON.stringify(updatedNotifications),
    );
    setNewNotification({
      title: "",
      message: "",
      category: "project",
      priority: "medium",
    });
    alert("Notification broadcasted successfully!");
  };

  const handleDeleteNotification = (id: number) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      const updatedNotifications = notifications.filter((n) => n.id !== id);
      setNotifications(updatedNotifications);
      localStorage.setItem(
        "auraa-notifications",
        JSON.stringify(updatedNotifications),
      );
    }
  };

  const getTimeRemaining = (createdAt: Date) => {
    const now = new Date();
    const timeDiff =
      48 * 60 * 60 * 1000 - (now.getTime() - createdAt.getTime());
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    if (timeDiff <= 0) return "Expired";
    if (hours > 0) return `Expires in ${hours}h ${minutes}m`;
    return `Expires in ${minutes}m`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "project":
        return "work";
      case "client":
        return "people";
      case "holiday":
        return "celebration";
      case "update":
        return "system_update";
      default:
        return "notifications";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "project":
        return "bg-blue-500/20 text-blue-400";
      case "client":
        return "bg-green-500/20 text-green-400";
      case "holiday":
        return "bg-purple-500/20 text-purple-400";
      case "update":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-gray-800">
        <div className="safe-area-inset-top">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center hover:bg-gray-700/80 transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-gray-300">
                  arrow_back
                </span>
              </button>
              <h1 className="text-xl font-bold text-white">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 py-4">
        <div className="bg-gray-900/50 rounded-2xl p-1 backdrop-blur-xl border border-gray-800">
          <div className="grid grid-cols-2 gap-1">
            {currentUser.role === "admin" && (
              <button
                onClick={() => setActiveTab("notifications")}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "notifications"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Notifications
              </button>
            )}
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Profile
            </button>
            {currentUser.role === "admin" && (
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Users
              </button>
            )}
            <button
              onClick={() => setActiveTab("preferences")}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "preferences"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-8 space-y-4">
        {/* Notifications Tab */}
        {activeTab === "notifications" && currentUser.role === "admin" && (
          <div className="space-y-4">
            {/* Create Notification */}
            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">
                Create Notification
              </h3>
              <form
                onSubmit={handleBroadcastNotification}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Enter notification title..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newNotification.category}
                      onChange={(e) =>
                        setNewNotification((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      <option value="project">Project</option>
                      <option value="client">Client</option>
                      <option value="holiday">Holiday</option>
                      <option value="update">Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newNotification.priority}
                      onChange={(e) =>
                        setNewNotification((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    rows={4}
                    placeholder="Enter notification message..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Notifications expire after 48 hours
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span>
                  Broadcast Notification
                </button>
              </form>
            </div>

            {/* Active Notifications */}
            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Active Notifications
                </h3>
                <span className="text-sm text-gray-400">
                  {notifications.length} active
                </span>
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">
                      notifications_off
                    </span>
                    <p className="text-gray-500">No active notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(notification.category)}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {getCategoryIcon(notification.category)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {notification.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </span>
                          </div>

                          <p className="text-sm text-gray-300 mb-2 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>
                              {notification.createdAt.toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="text-yellow-500">
                              {getTimeRemaining(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">
                {currentUser?.role === "admin"
                  ? "User Management"
                  : "Profile Information"}
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {currentUser?.role === "admin" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select User to Manage
                    </label>
                    <select
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      <option value="">Select a user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.name}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) =>
                      setUserProfile((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    disabled={currentUser?.role === "admin"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) =>
                      setUserProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    disabled={currentUser?.role === "admin"}
                  />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-medium text-white mb-4">
                    Change Password
                  </h4>

                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={userProfile.currentPassword}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />

                    <input
                      type="password"
                      placeholder="New Password"
                      value={userProfile.newPassword}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />

                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={userProfile.confirmPassword}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors"
                >
                  Update Profile
                </button>
              </form>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">
                Account Actions
              </h3>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && currentUser.role === "admin" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Users</h3>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add User
              </button>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-900/50 rounded-2xl p-4 backdrop-blur-xl border border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">
                        {user.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400"
                              : user.role === "manager"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm text-gray-300">
                          {user.status === "active" ? "pause" : "play_arrow"}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowAddUser(true);
                        }}
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm text-gray-300">
                          edit
                        </span>
                      </button>

                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm text-red-400">
                            delete
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">
                App Preferences
              </h3>

              <div className="space-y-6">
                {[
                  {
                    key: "darkMode",
                    label: "Dark Mode",
                    description: "Use dark theme across the app",
                  },
                  {
                    key: "notifications",
                    label: "Push Notifications",
                    description: "Receive notifications for updates",
                  },
                  {
                    key: "autoSave",
                    label: "Auto-save",
                    description: "Automatically save your work",
                  },
                ].map((pref) => (
                  <div
                    key={pref.key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{pref.label}</h4>
                      <p className="text-sm text-gray-400">
                        {pref.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          preferences[pref.key as keyof typeof preferences]
                        }
                        onChange={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            [pref.key]: !prev[pref.key as keyof typeof prev],
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">About</h3>
              <div className="space-y-4">
                {[
                  { label: "Version", value: "1.0.0" },
                  { label: "Build", value: "2024.03.15" },
                  { label: "License", value: "AURAA Control © 2024" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0"
                  >
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md border border-gray-800 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 rounded-t-3xl border-b border-gray-800 p-6 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {editingUser ? "Edit User" : "Add New User"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddUser(false);
                    setEditingUser(null);
                    setNewUser({
                      name: "",
                      email: "",
                      userId: "",
                      password: "",
                      role: "editor",
                    });
                  }}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-400">
                    close
                  </span>
                </button>
              </div>
              {/* Modal Handle */}
              <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mt-2 sm:hidden"></div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form
                onSubmit={editingUser ? handleUpdateUser : handleAddUser}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingUser ? editingUser.name : newUser.name}
                    onChange={(e) =>
                      editingUser
                        ? setEditingUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        : setNewUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={newUser.userId}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          userId: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter unique user ID"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPassword ? "text" : "password"}
                      value={
                        editingUser ? editingUser.password : newUser.password
                      }
                      onChange={(e) =>
                        editingUser
                          ? setEditingUser((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          : setNewUser((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder={
                        editingUser
                          ? "Update password (leave blank to keep current)"
                          : "Enter password"
                      }
                      required={!editingUser}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showUserPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["editor", "manager", "admin"].map((role) => (
                      <label key={role} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={
                            editingUser
                              ? editingUser.role === role
                              : newUser.role === role
                          }
                          onChange={(e) =>
                            editingUser
                              ? setEditingUser((prev) => ({
                                  ...prev,
                                  role: e.target.value,
                                }))
                              : setNewUser((prev) => ({
                                  ...prev,
                                  role: e.target.value,
                                }))
                          }
                          className="sr-only peer"
                        />
                        <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-4 text-center peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-all">
                          <div
                            className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                              role === "admin"
                                ? "bg-purple-500/20 text-purple-400"
                                : role === "manager"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {role === "admin"
                                ? "admin_panel_settings"
                                : role === "manager"
                                  ? "supervisor_account"
                                  : "person"}
                            </span>
                          </div>
                          <span className="text-white font-medium capitalize text-sm">
                            {role}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUser(false);
                      setEditingUser(null);
                      setNewUser({
                        name: "",
                        userId: "",
                        password: "",
                        role: "editor",
                      });
                    }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-4 rounded-xl transition-colors border border-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors"
                  >
                    {editingUser ? "Update User" : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Safe Area Bottom */}
      <div className="safe-area-inset-bottom"></div>
    </div>
  );
}
