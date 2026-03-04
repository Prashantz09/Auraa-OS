import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Enhanced sample data for clients with monthly projects
const CLIENTS = [
  {
    id: "techflow",
    name: "TechFlow Dynamics",
    status: "Active",
    activity: "2h ago",
    monthlyProjects: 3,
    thisMonthProjects: [
      {
        id: 1,
        title: "TechTalk Podcast Ep. 42",
        date: "2024-03-01",
        service: "Podcast",
      },
      {
        id: 2,
        title: "YouTube Product Review",
        date: "2024-03-10",
        service: "YouTube",
      },
      {
        id: 3,
        title: "Social Media Clips",
        date: "2024-03-15",
        service: "Shorts",
      },
    ],
    totalProjects: 24,
    clientSince: "2023-06-15",
    priority: "High",
    budget: "Premium",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "nebula",
    name: "Nebula Studios",
    status: "Active",
    activity: "5h ago",
    monthlyProjects: 5,
    thisMonthProjects: [
      {
        id: 4,
        title: "Brand Campaign Video",
        date: "2024-03-05",
        service: "YouTube",
      },
      {
        id: 5,
        title: "Instagram Reels Package",
        date: "2024-03-08",
        service: "Reels",
      },
      {
        id: 6,
        title: "TikTok Content Series",
        date: "2024-03-12",
        service: "TikTok",
      },
      {
        id: 7,
        title: "Thumbnail Design Pack",
        date: "2024-03-18",
        service: "Graphics",
      },
      {
        id: 8,
        title: "Behind the Scenes",
        date: "2024-03-20",
        service: "YouTube",
      },
    ],
    totalProjects: 48,
    clientSince: "2022-11-20",
    priority: "Medium",
    budget: "Standard",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: "apex",
    name: "Apex Consulting",
    status: "Active",
    activity: "1d ago",
    monthlyProjects: 2,
    thisMonthProjects: [
      {
        id: 9,
        title: "Corporate Training Video",
        date: "2024-03-03",
        service: "YouTube",
      },
      {
        id: 10,
        title: "Client Testimonial Series",
        date: "2024-03-14",
        service: "YouTube",
      },
    ],
    totalProjects: 15,
    clientSince: "2024-01-10",
    priority: "High",
    budget: "Premium",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "zenith",
    name: "Zenith Health",
    status: "Active",
    activity: "2w ago",
    monthlyProjects: 1,
    thisMonthProjects: [
      {
        id: 11,
        title: "Health Awareness Series",
        date: "2024-03-07",
        service: "YouTube",
      },
    ],
    totalProjects: 8,
    clientSince: "2023-08-05",
    priority: "Low",
    budget: "Basic",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function ClientDirectory() {
  // Load clients from localStorage or use sample data
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem("auraa-clients");
    return savedClients ? JSON.parse(savedClients) : CLIENTS;
  });

  // Save clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("auraa-clients", JSON.stringify(clients));
  }, [clients]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Generate unique avatar for client based on name
  const generateClientAvatar = (clientName: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-red-500 to-red-600",
      "from-amber-500 to-amber-600",
      "from-teal-500 to-teal-600",
      "from-orange-500 to-orange-600",
      "from-cyan-500 to-cyan-600",
    ];

    const initials = clientName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

    const colorIndex =
      clientName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;

    return {
      initials,
      color: colors[colorIndex],
    };
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!newClient.name.trim()) {
      alert("Client name is required");
      return;
    }

    if (!newClient.phone.trim()) {
      alert("Phone number is required");
      return;
    }

    // Generate unique avatar for this client
    const avatar = generateClientAvatar(newClient.name.trim());

    // Create new client object with unique ID
    const newClientData = {
      id: `client_${Date.now()}`, // Generate unique ID
      name: newClient.name.trim(),
      email: newClient.email.trim() || "",
      phone: newClient.phone.trim(),
      status: "Active",
      activity: "Just now",
      monthlyProjects: 0,
      thisMonthProjects: [],
      totalProjects: 0,
      clientSince: new Date().toISOString().split("T")[0],
      priority: "Medium",
      budget: "Standard",
      avatar: avatar, // Add avatar data
    };

    // Add to clients list
    setClients((prev) => [...prev, newClientData]);

    // Reset form and close modal
    setShowAddClient(false);
    setNewClient({ name: "", email: "", phone: "" });

    // Show success message
    alert(`Client "${newClientData.name}" added successfully!`);
  };

  const handleDeleteClient = (clientId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this client? This action cannot be undone.",
      )
    ) {
      setClients((prev) => prev.filter((client) => client.id !== clientId));
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "YouTube":
        return "play_circle";
      case "Podcast":
        return "podcasts";
      case "Shorts":
        return "video_shorts";
      case "Reels":
        return "video_library";
      case "TikTok":
        return "music_video";
      case "Graphics":
        return "brush";
      default:
        return "movie";
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case "YouTube":
        return "text-red-500";
      case "Podcast":
        return "text-purple-500";
      case "Shorts":
        return "text-blue-500";
      case "Reels":
        return "text-pink-500";
      case "TikTok":
        return "text-black dark:text-white";
      case "Graphics":
        return "text-emerald-500";
      default:
        return "text-slate-500";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Clients
            </h1>
            <button
              onClick={() => setShowAddClient(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Client
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                search
              </span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base outline-none"
              placeholder="Search clients..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-5 pt-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] opacity-80">
                group
              </span>
              <span className="text-xl font-bold">{clients.length}</span>
            </div>
            <p className="text-xs opacity-90">Total Clients</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] opacity-80">
                assignment
              </span>
              <span className="text-xl font-bold">
                {clients.reduce(
                  (sum, client) => sum + client.monthlyProjects,
                  0,
                )}
              </span>
            </div>
            <p className="text-xs opacity-90">This Month</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] opacity-80">
                trending_up
              </span>
              <span className="text-xl font-bold">
                {CLIENTS.filter((c) => c.status === "Active").length}
              </span>
            </div>
            <p className="text-xs opacity-90">Active</p>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="px-5 pb-4">
        <div className="flex flex-col gap-4">
          {filteredClients.map((client) => (
            <Link
              to={`/clients/${client.id}`}
              key={client.id}
              className="block bg-white dark:bg-surface-dark rounded-2xl p-5 border border-slate-200 dark:border-surface-border hover:border-primary/50 dark:hover:border-primary/50 transition-all"
            >
              {/* Client Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {client.avatar ? (
                    // New client with generated avatar
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${client.avatar.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {client.avatar.initials}
                    </div>
                  ) : (
                    // Existing client with image
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-border to-[#161822] flex items-center justify-center overflow-hidden">
                      <img
                        alt={client.name}
                        className="w-full h-full object-cover"
                        src={client.image}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {client.status}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {client.activity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Monthly Projects
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {client.monthlyProjects}
                  </p>
                </div>
              </div>

              {/* This Month's Projects */}
              <div className="border-t border-slate-200 dark:border-surface-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                    This Month's Projects
                  </h4>
                  <span className="text-xs text-primary hover:text-primary-light transition-colors">
                    View all {client.totalProjects} projects
                  </span>
                </div>
                <div className="space-y-2">
                  {client.thisMonthProjects.slice(0, 2).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-[18px] ${getServiceColor(project.service)}`}
                        >
                          {getServiceIcon(project.service)}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {project.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {project.date}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {project.service}
                      </span>
                    </div>
                  ))}
                  {client.thisMonthProjects.length > 2 && (
                    <div className="text-center py-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        +{client.thisMonthProjects.length - 2} more projects
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-surface-border">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteClient(client.id);
                  }}
                  className="px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
                <button className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-surface-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  Edit Client
                </button>
                <button className="flex-1 px-3 py-2 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                  Add Project
                </button>
                <button className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-surface-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-4">
              search_off
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              No clients found
            </p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-surface-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Add New Client
            </h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, name: e.target.value }))
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
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Optional: client@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl transition-colors"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
