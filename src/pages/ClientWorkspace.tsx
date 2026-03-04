import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// Initial sample entries data
const INITIAL_ENTRIES = [
  {
    id: 1,
    title: "Ep. 42: The Future of Space Travel",
    service: "Podcast",
    quantity: 1,
    date: "Oct 24",
    editor: "Patrick S.",
    editorInitial: "P",
    editorColor: "from-indigo-500 to-purple-600",
  },
  {
    id: 2,
    title: "Why Coding is Changing",
    service: "YouTube",
    quantity: 2,
    date: "Oct 22",
    editor: "Alex M.",
    editorInitial: "A",
    editorColor: "from-orange-500 to-red-600",
  },
  {
    id: 3,
    title: "Clip: AI Ethics Debate",
    service: "Shorts",
    quantity: 3,
    date: "Oct 20",
    editor: "Patrick S.",
    editorInitial: "P",
    editorColor: "from-indigo-500 to-purple-600",
  },
  {
    id: 4,
    title: "NordVPN Integrated Ad",
    service: "Sponsor",
    quantity: 1,
    date: "Oct 18",
    editor: "Alex M.",
    editorInitial: "A",
    editorColor: "from-orange-500 to-red-600",
  },
];

export default function ClientWorkspace() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get client ID from URL parameter
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load entries from localStorage or use sample data
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("auraa-entries");
    return savedEntries ? JSON.parse(savedEntries) : INITIAL_ENTRIES;
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("auraa-entries", JSON.stringify(entries));
  }, [entries]);

  // Load completed projects from localStorage
  const [completedProjects, setCompletedProjects] = useState(() => {
    const savedProjects = localStorage.getItem("auraa-completed-projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  // Save completed projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "auraa-completed-projects",
      JSON.stringify(completedProjects),
    );
  }, [completedProjects]);

  const [editingEntry, setEditingEntry] = useState(null);

  // Load clients from localStorage to get client names
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem("auraa-clients");
    return savedClients ? JSON.parse(savedClients) : [];
  });

  // Get client name from URL parameter by looking up client data
  const getClientName = () => {
    console.log("Current URL ID:", id);
    console.log("Available clients:", clients);
    if (id) {
      // Look up client by ID
      const client = clients.find((c) => c.id === id);
      if (client) {
        console.log("Found client by ID:", id, "name:", client.name);
        return client.name;
      } else {
        console.log("Client not found for ID:", id, "using ID as name");
        return decodeURIComponent(id).replace(/-/g, " ");
      }
    }
    console.log("No URL param found, using default client name.");
    return "TechTalk Podcast"; // Default client
  };

  // Filter completed projects by current client
  const getClientCompletedProjects = () => {
    const clientName = getClientName();
    console.log("Client workspace for:", clientName);
    console.log("Available completed projects:", completedProjects);

    return completedProjects.filter((project) => {
      const matches =
        project.client &&
        project.client.toLowerCase().trim() === clientName.toLowerCase().trim();
      console.log(
        `Project "${project.title}" - client: "${project.client}" - matches: ${matches}`,
      );
      return matches;
    });
  };

  // Handle entry editing
  const handleEditEntry = (entry) => {
    setEditingEntry({ ...entry });
  };

  // Handle entry update
  const handleUpdateEntry = (e) => {
    e.preventDefault();
    if (!editingEntry.title.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === editingEntry.id ? editingEntry : entry,
      ),
    );

    setEditingEntry(null);
    alert("Entry updated successfully!");
  };

  // Handle entry deletion
  const handleDeleteEntry = (id) => {
    // Check if this is a completed project (shouldn't be deleted)
    const isCompletedProject = completedProjects.some(
      (project) => project.id === id,
    );

    if (isCompletedProject) {
      alert(
        "Completed projects cannot be deleted. They are archived in the client workspace.",
      );
      setShowDeleteConfirm(null);
      return;
    }

    // Only allow deletion of regular entries
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    setShowDeleteConfirm(null);
    alert("Project deleted successfully!");
  };

  // Handle entry duplicate
  const handleDuplicateEntry = (entry) => {
    const duplicatedEntry = {
      ...entry,
      id: Math.max(...entries.map((e) => e.id)) + 1,
      title: entry.title + " (Copy)",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };

    setEntries((prev) => [duplicatedEntry, ...prev]);
    alert("Entry duplicated successfully!");
  };

  // Handle report generation
  const handleGenerateReport = () => {
    // Create report content
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const reportNumber = `RPT-${Date.now()}`;
    const clientName = "TechTalk Podcast";

    let csvContent = "Report Number: " + reportNumber + "\n";
    csvContent += "Date: " + currentDate + "\n";
    csvContent += "Client: " + clientName + "\n";
    csvContent += "\n";
    csvContent += "Project Title,Service Type,Quantity,Date,Editor\n";

    entries.forEach((entry) => {
      csvContent += `"${entry.title}","${entry.service}",${entry.quantity},"${entry.date}","${entry.editor}"\n`;
    });

    csvContent += "\n";
    csvContent += "Total Projects: " + entries.length + "\n";

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${clientName.replace(/\s+/g, "-")}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert("Report downloaded successfully!");
  };

  // Handle invoice download
  const handleDownloadInvoice = () => {
    // Create invoice content
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const invoiceNumber = `INV-${Date.now()}`;
    const clientName = "TechTalk Podcast";

    let csvContent = "Invoice Number: " + invoiceNumber + "\n";
    csvContent += "Date: " + currentDate + "\n";
    csvContent += "Client: " + clientName + "\n";
    csvContent += "\n";
    csvContent += "Project Title,Service Type,Quantity,Date,Editor\n";

    entries.forEach((entry) => {
      csvContent += `"${entry.title}","${entry.service}",${entry.quantity},"${entry.date}","${entry.editor}"\n`;
    });

    csvContent += "\n";
    csvContent += "Total Projects: " + entries.length + "\n";

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${clientName.replace(/\s+/g, "-")}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert("Invoice downloaded successfully!");
  };

  // Get service badge color
  const getServiceBadgeColor = (service) => {
    const colorMap = {
      Podcast:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      YouTube: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      Shorts:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      Sponsor:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      Thumbnail:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    };
    return colorMap[service] || colorMap.Podcast;
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 px-4 py-4 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">
            arrow_back
          </span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            {getClientName()}
          </h2>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Client Workspace
          </span>
        </div>

        {/* Project Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              more_vert
            </span>
          </button>

          {showProjectMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProjectMenu(false)}
              />
              <div className="absolute right-0 top-12 z-20 w-48 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-slate-200 dark:border-surface-border py-2">
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                    handleGenerateReport();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    bar_chart
                  </span>
                  Generate Report
                </button>
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                    handleDownloadInvoice();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    request_quote
                  </span>
                  Download Invoice
                </button>
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                    alert("Edit project feature coming soon!");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                  Edit Project Details
                </button>
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                    alert("Export data feature coming soon!");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  Export Data
                </button>
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                    alert("Settings feature coming soon!");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    settings
                  </span>
                  Project Settings
                </button>
                <hr className="my-2 border-slate-200 dark:border-surface-border" />
                <button
                  onClick={() => {
                    setShowProjectMenu(false);
                    if (
                      confirm("Are you sure you want to archive this project?")
                    ) {
                      alert("Project archived!");
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    archive
                  </span>
                  Archive Project
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Projects Section */}
      <div className="px-4 pt-6 pb-4">
        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Projects
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                bar_chart
              </span>
              Report
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white hover:bg-primary-light rounded-lg text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                request_quote
              </span>
              Invoice
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Combine regular entries with completed projects for this client */}
          {[...entries, ...getClientCompletedProjects()].map((project) => {
            const item = {
              ...project,
              service: project.service || project.service,
              quantity: project.quantity || 1,
              date:
                project.date ||
                (project.completedDate
                  ? new Date(project.completedDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })),
              editor: project.editor || project.completedBy || "Unknown",
              editorInitial: project.editor
                ? project.editor.charAt(0).toUpperCase()
                : project.completedBy
                  ? project.completedBy.charAt(0).toUpperCase()
                  : "E",
              editorColor: project.editorColor || "from-blue-500 to-blue-600",
              isCompleted: !!project.completedDate,
            };

            return (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-4 transition-all hover:border-primary/50 dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-[#202330]"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getServiceBadgeColor(item.service)}`}
                    >
                      {item.service}
                    </span>
                    <span className="rounded bg-slate-500/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-500/20">
                      {item.quantity}x
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.date}
                    </span>
                  </div>
                  <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Editor:{" "}
                    <span className="text-slate-900 dark:text-white">
                      {item.editor}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${item.editorColor} text-xs font-bold text-white shadow-md ring-2 ring-background-light dark:ring-background-dark`}
                    >
                      {item.editorInitial}
                    </div>
                    {item.isCompleted && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditEntry(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Edit Project"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDuplicateEntry(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      title="Duplicate Project"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        content_copy
                      </span>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete Project"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {[...entries, ...getClientCompletedProjects()].length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">
                  folder_open
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your projects will appear here once they're created.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-surface-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Edit Project
            </h3>
            <form onSubmit={handleUpdateEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingEntry.title}
                  onChange={(e) =>
                    setEditingEntry((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Service Type
                  </label>
                  <select
                    value={editingEntry.service}
                    onChange={(e) =>
                      setEditingEntry((prev) => ({
                        ...prev,
                        service: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Podcast">Podcast</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Sponsor">Sponsor</option>
                    <option value="Thumbnail">Thumbnail</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editingEntry.quantity}
                    onChange={(e) =>
                      setEditingEntry((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-light rounded-xl transition-colors"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-surface-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[24px]">
                  warning
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Delete Project
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-surface-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEntry(showDeleteConfirm)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
