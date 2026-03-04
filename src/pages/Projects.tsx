import { useState, useEffect } from "react";

// Sample projects data
const SAMPLE_PROJECTS = [
  {
    id: 1,
    title: "TechTalk Podcast Ep. 42",
    client: "TechTalk Media",
    service: "Podcast",
    editor: "Patrick S.",
    date: "2024-03-15",
    status: "working",
    description: "Full podcast production with editing and mixing",
    deadline: "2024-03-20",
    priority: "high",
  },
  {
    id: 2,
    title: "YouTube Product Review",
    client: "Creative Studios",
    service: "YouTube",
    editor: "Alex M.",
    date: "2024-03-18",
    status: "working",
    description: "Product review video with graphics and editing",
    deadline: "2024-03-25",
    priority: "medium",
  },
  {
    id: 3,
    title: "Instagram Reels Package",
    client: "Brand Agency",
    service: "Reels",
    editor: "Patrick S.",
    date: "2024-03-20",
    status: "completed",
    description: "5 Instagram Reels with trending audio",
    deadline: "2024-03-15",
    priority: "low",
  },
  {
    id: 4,
    title: "Thumbnail Design Pack",
    client: "Production House",
    service: "Graphics",
    editor: "Alex M.",
    date: "2024-04-01",
    status: "pending",
    description: "Custom thumbnails for YouTube series",
    deadline: "2024-04-05",
    priority: "high",
  },
  {
    id: 5,
    title: "Podcast Series Launch",
    client: "TechFlow Dynamics",
    service: "Podcast",
    editor: "Sarah K.",
    date: "2024-03-25",
    status: "working",
    description: "Launch series for new podcast channel",
    deadline: "2024-04-01",
    priority: "high",
  },
  {
    id: 6,
    title: "YouTube Shorts Campaign",
    client: "Nebula Studios",
    service: "Shorts",
    editor: "Mike R.",
    date: "2024-03-22",
    status: "working",
    description: "10 YouTube Shorts for brand campaign",
    deadline: "2024-03-30",
    priority: "medium",
  },
  {
    id: 7,
    title: "Brand Video Production",
    client: "Apex Consulting",
    service: "YouTube",
    editor: "Patrick S.",
    date: "2024-03-28",
    status: "pending",
    description: "Corporate brand video with interviews",
    deadline: "2024-04-10",
    priority: "medium",
  },
  {
    id: 8,
    title: "Social Media Graphics",
    client: "Zenith Health",
    service: "Graphics",
    editor: "Alex M.",
    date: "2024-03-30",
    status: "completed",
    description: "Social media graphics package for health brand",
    deadline: "2024-03-28",
    priority: "low",
  },
  {
    id: 9,
    title: "TikTok Content Series",
    client: "Creative Studios",
    service: "TikTok",
    editor: "Sarah K.",
    date: "2024-04-02",
    status: "working",
    description: "TikTok series with trending effects",
    deadline: "2024-04-08",
    priority: "medium",
  },
  {
    id: 10,
    title: "Trailer Production",
    client: "Production House",
    service: "Trailer Only",
    editor: "Mike R.",
    date: "2024-04-05",
    status: "pending",
    description: "Movie trailer for upcoming film",
    deadline: "2024-04-15",
    priority: "high",
  },
  {
    id: 11,
    title: "Podcast Interview Series",
    client: "TechFlow Dynamics",
    service: "Podcast",
    editor: "Patrick S.",
    date: "2024-04-03",
    status: "working",
    description: "Interview series with industry experts",
    deadline: "2024-04-20",
    priority: "medium",
  },
  {
    id: 12,
    title: "YouTube Explainer Video",
    client: "Brand Agency",
    service: "YouTube",
    editor: "Alex M.",
    date: "2024-04-08",
    status: "pending",
    description: "Animated explainer video for product",
    deadline: "2024-04-12",
    priority: "low",
  },
];

const EDITORS = ["Patrick S.", "Alex M.", "Sarah K.", "Mike R."];
const SERVICES = [
  {
    value: "YouTube",
    label: "YouTube",
    icon: "play_circle",
    color: "text-red-500",
  },
  {
    value: "Reels",
    label: "Reels",
    icon: "video_library",
    color: "text-pink-500",
  },
  {
    value: "Graphics",
    label: "Graphics",
    icon: "brush",
    color: "text-emerald-500",
  },
  {
    value: "Thumbnail",
    label: "Thumbnail",
    icon: "image",
    color: "text-orange-500",
  },
  {
    value: "Podcast",
    label: "Podcast",
    icon: "podcasts",
    color: "text-purple-500",
  },
  {
    value: "Shorts",
    label: "Shorts",
    icon: "video_shorts",
    color: "text-blue-500",
  },
  {
    value: "TikTok",
    label: "TikTok",
    icon: "music_video",
    color: "text-black dark:text-white",
  },
  {
    value: "Trailer Only",
    label: "Trailer Only",
    icon: "movie",
    color: "text-blue-500",
  },
];

const CLIENTS = [
  "TechTalk Media",
  "Creative Studios",
  "Brand Agency",
  "Production House",
  "TechFlow Dynamics",
  "Nebula Studios",
  "Apex Consulting",
  "Zenith Health",
];

export default function Projects() {
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [filterEditor, setFilterEditor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Get current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    service: "",
    editor: "",
    date: "",
    status: "working",
    description: "",
    deadline: "",
    priority: "medium",
  });

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClient =
        filterClient === "all" || project.client === filterClient;
      const matchesService =
        filterService === "all" || project.service === filterService;
      const matchesEditor =
        filterEditor === "all" || project.editor === filterEditor;
      const matchesStatus =
        filterStatus === "all" || project.status === filterStatus;
      return (
        matchesSearch &&
        matchesClient &&
        matchesService &&
        matchesEditor &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "client":
          return a.client.localeCompare(b.client);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getServiceInfo = (service: string) => {
    return SERVICES.find((s) => s.value === service) || SERVICES[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();

    const project = {
      id: Math.max(...projects.map((p) => p.id)) + 1,
      ...formData,
    };

    setProjects((prev) => [project, ...prev]);
    setShowAddForm(false);
    setFormData({
      title: "",
      client: "",
      service: "",
      editor: "",
      date: "",
      status: "working",
    });
  };

  const handleQuickEdit = (project: any) => {
    setEditingProject(project);
    setFormData(project);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();

    setProjects((prev) =>
      prev.map((p) => (p.id === editingProject.id ? formData : p)),
    );

    setEditingProject(null);
    setFormData({
      title: "",
      client: "",
      service: "",
      editor: "",
      date: "",
      status: "working",
    });
  };

  const handleDeleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const clearFilters = () => {
    setFilterClient("all");
    setFilterService("all");
    setFilterEditor("all");
    setFilterStatus("all");
    setSearchTerm("");
  };

  const activeFiltersCount = [
    filterClient,
    filterService,
    filterEditor,
    filterStatus,
  ].filter((f) => f !== "all").length;

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Projects
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentDate}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Project
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </span>
            <input
              type="text"
              placeholder="Search projects or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Desktop Filters */}
            <div className="hidden md:flex gap-2 flex-wrap">
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-xs"
              >
                <option value="all">All Clients</option>
                {CLIENTS.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>

              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-xs"
              >
                <option value="all">All Services</option>
                {SERVICES.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>

              <select
                value={filterEditor}
                onChange={(e) => setFilterEditor(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-xs"
              >
                <option value="all">All Editors</option>
                {EDITORS.map((editor) => (
                  <option key={editor} value={editor}>
                    {editor}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-xs"
              >
                <option value="all">All Status</option>
                <option value="working">Working</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-xs relative"
            >
              <span className="material-symbols-outlined text-[16px]">
                filter_list
              </span>
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-xs"
            >
              <option value="date">Latest First</option>
              <option value="client">Client Name</option>
              <option value="status">Status</option>
            </select>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Filters Panel */}
      {showMobileFilters && (
        <div className="px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-surface-border md:hidden">
          <div className="grid grid-cols-2 gap-3">
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-sm"
            >
              <option value="all">All Clients</option>
              {CLIENTS.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>

            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-sm"
            >
              <option value="all">All Services</option>
              {SERVICES.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>

            <select
              value={filterEditor}
              onChange={(e) => setFilterEditor(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-sm"
            >
              <option value="all">All Editors</option>
              {EDITORS.map((editor) => (
                <option key={editor} value={editor}>
                  {editor}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-sm"
            >
              <option value="all">All Status</option>
              <option value="working">Working</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="px-4 pt-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] opacity-80">
                work
              </span>
              <span className="text-xl font-bold">
                {projects.filter((p) => p.status === "working").length}
              </span>
            </div>
            <p className="text-xs opacity-90">Working</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] opacity-80">
                check_circle
              </span>
              <span className="text-xl font-bold">
                {projects.filter((p) => p.status === "completed").length}
              </span>
            </div>
            <p className="text-xs opacity-90">Completed</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[20px] opacity-80">
                schedule
              </span>
              <span className="text-xl font-bold">
                {projects.filter((p) => p.status === "pending").length}
              </span>
            </div>
            <p className="text-xs opacity-90">Pending</p>
          </div>
        </div>
      </div>

      {/* Projects List - Desktop Table View */}
      <div className="hidden md:block px-4 pb-4">
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-surface-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-surface-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Editor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-surface-border">
              {filteredProjects.map((project) => {
                const serviceInfo = getServiceInfo(project.service);
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-[20px] ${serviceInfo.color}`}
                        >
                          {serviceInfo.icon}
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {project.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {project.client}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${serviceInfo.color}`}
                      >
                        {project.service}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {project.editor}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {project.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          project.status,
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickEdit(project);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px] text-slate-400">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px] text-red-500">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projects List - Mobile Card View */}
      <div className="md:hidden px-4 pb-4">
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const serviceInfo = getServiceInfo(project.service);
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 dark:border-surface-border hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[24px] ${serviceInfo.color}`}
                    >
                      {serviceInfo.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {project.client}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      Service:
                    </span>
                    <span className={`ml-1 font-medium ${serviceInfo.color}`}>
                      {project.service}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      Editor:
                    </span>
                    <span className="ml-1 font-medium text-slate-900 dark:text-white">
                      {project.editor}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">
                      Date:
                    </span>
                    <span className="ml-1 font-medium text-slate-900 dark:text-white">
                      {project.date}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickEdit(project);
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-surface-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-4">
            folder_open
          </span>
          <p className="text-slate-500 dark:text-slate-400">
            No projects found
          </p>
        </div>
      )}

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={() => setShowAddForm(true)}
        className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white hover:bg-primary/90 transition-colors z-10"
      >
        <span className="material-symbols-outlined text-[24px]">add</span>
      </button>

      {/* Add/Edit Project Modal */}
      {(showAddForm || editingProject) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-surface-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h3>
            <form
              onSubmit={editingProject ? handleUpdateProject : handleAddProject}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Client
                  </label>
                  <select
                    value={formData.client}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        client: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  >
                    <option value="">Select Client</option>
                    {CLIENTS.map((client) => (
                      <option key={client} value={client}>
                        {client}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        service: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  >
                    <option value="">Select Service</option>
                    {SERVICES.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Editor
                  </label>
                  <select
                    value={formData.editor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        editor: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  >
                    <option value="">Select Editor</option>
                    {EDITORS.map((editor) => (
                      <option key={editor} value={editor}>
                        {editor}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="working">Working</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProject(null);
                    setFormData({
                      title: "",
                      client: "",
                      service: "",
                      editor: "",
                      date: "",
                      status: "working",
                    });
                  }}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl transition-colors"
                >
                  {editingProject ? "Update" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-2xl border border-slate-200 dark:border-surface-border max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Project Details
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-400">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Project Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                  <span
                    className={`material-symbols-outlined text-[32px] ${getServiceInfo(selectedProject.service).color}`}
                  >
                    {getServiceInfo(selectedProject.service).icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {selectedProject.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedProject.client}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full ${getStatusColor(selectedProject.status)}`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Service
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedProject.service}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Editor
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedProject.editor}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Start Date
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedProject.date}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Deadline
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedProject.deadline}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Description
                </p>
                <p className="text-sm text-slate-900 dark:text-white">
                  {selectedProject.description}
                </p>
              </div>

              {/* Priority */}
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Priority
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedProject.priority === "high"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : selectedProject.priority === "medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  }`}
                >
                  {selectedProject.priority.charAt(0).toUpperCase() +
                    selectedProject.priority.slice(1)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-surface-border">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    handleQuickEdit(selectedProject);
                  }}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Edit Project
                </button>
                <button
                  onClick={() => {
                    handleDeleteProject(selectedProject.id);
                    setSelectedProject(null);
                  }}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
