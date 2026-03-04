import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample users data
const SAMPLE_USERS = [
  { id: 'prash', name: 'Prash', role: 'admin', email: 'prash@auraa.com', status: 'active', avatar: 'P' },
  { id: 'alex', name: 'Alex', role: 'editor', email: 'alex@auraa.com', status: 'active', avatar: 'A' },
  { id: 'sarah', name: 'Sarah', role: 'editor', email: 'sarah@auraa.com', status: 'active', avatar: 'S' },
];

export default function Settings() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [editingUser, setEditingUser] = useState(null);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    userId: '',
    password: '',
    role: 'editor'
  });

  // App preferences state
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
    language: 'en'
  });

  useEffect(() => {
    const userData = localStorage.getItem('auraa_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setUserProfile(prev => ({ ...prev, name: user.name, email: user.email + '@auraa.com' }));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic
    alert('Profile updated successfully!');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = {
      id: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      avatar: newUser.name.charAt(0).toUpperCase()
    };
    
    setUsers(prev => [...prev, user]);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', userId: '', password: '', role: 'editor' });
    alert('User added successfully!');
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id ? editingUser : u
      ));
      setEditingUser(null);
      setShowAddUser(false);
      alert('User updated successfully!');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('auraa_user');
    navigate('/');
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 pt-6">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            User Settings
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              User Management
            </button>
          )}
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'preferences'
                ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            App Preferences
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pt-6">
        {/* User Settings Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-surface-border">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profile Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-surface-border">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Change Password</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={userProfile.currentPassword}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={userProfile.newPassword}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={userProfile.confirmPassword}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-surface-border">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Management</h3>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add User
              </button>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 dark:border-surface-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white">{user.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-400">
                          {user.status === 'active' ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowAddUser(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-400">edit</span>
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-red-500">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-surface-border">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">App Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Use dark theme across the app</p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">Push Notifications</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive notifications for updates</p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">Auto-save</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Automatically save your work</p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.autoSave ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-surface-border">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Version</span>
                  <span className="text-slate-900 dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Build</span>
                  <span className="text-slate-900 dark:text-white">2024.03.15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">License</span>
                  <span className="text-slate-900 dark:text-white">AURAA Control © 2024</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-surface-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser ? editingUser.name : newUser.name}
                  onChange={(e) => editingUser 
                    ? setEditingUser(prev => ({ ...prev, name: e.target.value }))
                    : setNewUser(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser ? editingUser.email : newUser.email}
                  onChange={(e) => editingUser 
                    ? setEditingUser(prev => ({ ...prev, email: e.target.value }))
                    : setNewUser(prev => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={newUser.userId}
                      onChange={(e) => setNewUser(prev => ({ ...prev, userId: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Role
                </label>
                <select
                  value={editingUser ? editingUser.role : newUser.role}
                  onChange={(e) => editingUser 
                    ? setEditingUser(prev => ({ ...prev, role: e.target.value }))
                    : setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUser(false);
                    setEditingUser(null);
                    setNewUser({ name: '', email: '', userId: '', password: '', role: 'editor' });
                  }}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl transition-colors"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
