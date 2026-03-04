import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Initial sample entries data
const INITIAL_ENTRIES = [
  {
    id: 1,
    title: "Ep. 42: The Future of Space Travel",
    service: "Podcast",
    quantity: 1,
    amount: 450,
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
    amount: 850,
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
    amount: 150,
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
    amount: 300,
    date: "Oct 18",
    editor: "Alex M.",
    editorInitial: "A",
    editorColor: "from-orange-500 to-red-600",
  },
];

export default function ClientWorkspace() {
  const navigate = useNavigate();
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showEntryMenu, setShowEntryMenu] = useState(null);
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // New project form state
  const [newProject, setNewProject] = useState({
    title: "",
    service: "",
    quantity: 1,
    amount: "",
  });

  // Handle new project form changes
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new project submission
  const handleCreateEntry = (e) => {
    e.preventDefault();

    // Validate form
    if (!newProject.title.trim() || !newProject.service || !newProject.amount) {
      alert("Please fill in all required fields");
      return;
    }

    // Get service colors and editor info
    const getServiceInfo = (service) => {
      const serviceMap = {
        podcast: {
          color: "purple",
          editor: "Patrick S.",
          initial: "P",
          editorColor: "from-indigo-500 to-purple-600",
        },
        youtube: {
          color: "red",
          editor: "Alex M.",
          initial: "A",
          editorColor: "from-orange-500 to-red-600",
        },
        short: {
          color: "blue",
          editor: "Patrick S.",
          initial: "P",
          editorColor: "from-indigo-500 to-purple-600",
        },
        thumbnail: {
          color: "emerald",
          editor: "Alex M.",
          initial: "A",
          editorColor: "from-orange-500 to-red-600",
        },
      };
      return serviceMap[service] || serviceMap.podcast;
    };

    const serviceInfo = getServiceInfo(newProject.service);

    // Create new entry
    const newEntry = {
      id: Math.max(...entries.map((e) => e.id)) + 1,
      title: newProject.title,
      service:
        newProject.service === "podcast"
          ? "Podcast"
          : newProject.service === "youtube"
            ? "YouTube"
            : newProject.service === "short"
              ? "Shorts"
              : newProject.service === "thumbnail"
                ? "Thumbnail"
                : "Podcast",
      quantity: parseInt(newProject.quantity),
      amount: parseFloat(newProject.amount),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      editor: serviceInfo.editor,
      editorInitial: serviceInfo.initial,
      editorColor: serviceInfo.editorColor,
    };

    // Add to entries
    setEntries((prev) => [newEntry, ...prev]);

    // Reset form
    setNewProject({
      title: "",
      service: "",
      quantity: 1,
      amount: "",
    });

    // Show success message
    alert("Project entry created successfully!");
  };

  // Handle entry editing
  const handleEditEntry = (entry) => {
    setEditingEntry({ ...entry });
    setShowEntryMenu(null);
  };

  // Handle entry update
  const handleUpdateEntry = (e) => {
    e.preventDefault();
    if (!editingEntry.title.trim() || !editingEntry.amount) {
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
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    setShowDeleteConfirm(null);
    setShowEntryMenu(null);
    alert("Entry deleted successfully!");
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
    setShowEntryMenu(null);
    alert("Entry duplicated successfully!");
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
    csvContent += "Item,Service,Quantity,Amount,Total\n";

    let subtotal = 0;
    entries.forEach((entry) => {
      const itemTotal = entry.amount * entry.quantity;
      csvContent += `"${entry.title}","${entry.service}",${entry.quantity},${entry.amount},${itemTotal}\n`;
      subtotal += itemTotal;
    });

    csvContent += "\n";
    csvContent += "Subtotal,,," + subtotal + "\n";

    // Add tax (10%)
    const tax = subtotal * 0.1;
    csvContent += "Tax (10%),,,," + tax.toFixed(2) + "\n";

    const total = subtotal + tax;
    csvContent += "Total,,,,," + total.toFixed(2) + "\n";

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

  // Calculate total revenue
  const totalRevenue = entries.reduce(
    (sum, entry) => sum + entry.amount * entry.quantity,
    0,
  );

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
            TechTalk Podcast
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

      <div className="px-4 pt-6 pb-2">
        {/* Total Revenue Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-dark to-[#161822] p-6 border border-surface-border shadow-lg group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[80px] text-primary">
              analytics
            </span>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
              Total Revenue
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-white">
                रू {totalRevenue.toLocaleString()}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                +12%
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Year to Date • {entries.length} Projects
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 rounded-lg bg-surface-border hover:bg-[#323749] py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                bar_chart
              </span>
              Report
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 rounded-lg bg-primary hover:bg-primary-dark py-2.5 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[18px]">
                request_quote
              </span>
              Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* New Project Entry */}
        <div className="rounded-2xl bg-white dark:bg-surface-dark p-5 border border-slate-200 dark:border-surface-border shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                add_circle
              </span>
              New Project Entry
            </h3>
          </div>
          <form onSubmit={handleCreateEntry} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                Project Details
              </label>
              <input
                name="title"
                value={newProject.title}
                onChange={handleProjectChange}
                className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="Project Title (e.g. Ep. 45 - AI Future)"
                type="text"
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-[2] flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  Service
                </label>
                <div className="relative">
                  <select
                    name="service"
                    value={newProject.service}
                    onChange={handleProjectChange}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] pl-3 pr-8 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="podcast">Podcast Edit</option>
                    <option value="youtube">YouTube Cut</option>
                    <option value="short">Short/Reel</option>
                    <option value="thumbnail">Thumbnail</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-[1] flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  Qty
                </label>
                <input
                  name="quantity"
                  value={newProject.quantity}
                  onChange={handleProjectChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-2 py-3 text-sm text-center text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="1"
                  type="number"
                  min="1"
                  required
                />
              </div>
              <div className="flex-[1.5] flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-500 dark:text-slate-400 text-sm">
                    Rs.
                  </span>
                  <input
                    name="amount"
                    value={newProject.amount}
                    onChange={handleProjectChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] pl-8 pr-2 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform active:scale-[0.98] hover:bg-primary-light"
            >
              <span>Create Entry</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Entries
          </h3>
          <button className="text-xs font-medium text-primary hover:text-primary-light">
            View All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-4 transition-all hover:border-primary/50 dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-[#202330]"
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getServiceBadgeColor(entry.service)}`}
                  >
                    {entry.service}
                  </span>
                  <span className="rounded bg-slate-500/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-500/20">
                    {entry.quantity}x
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {entry.date}
                  </span>
                </div>
                <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {entry.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Editor:{" "}
                  <span className="text-slate-900 dark:text-white">
                    {entry.editor}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    रू {(entry.amount * entry.quantity).toFixed(2)}
                  </span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${entry.editorColor} text-xs font-bold text-white shadow-md ring-2 ring-background-light dark:ring-background-dark`}
                  >
                    {entry.editorInitial}
                  </div>
                </div>

                {/* Entry Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEntryMenu(
                        showEntryMenu === entry.id ? null : entry.id,
                      );
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      more_vert
                    </span>
                  </button>

                  {showEntryMenu === entry.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowEntryMenu(null)}
                      />
                      <div className="absolute right-0 top-10 z-20 w-44 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-slate-200 dark:border-surface-border py-2">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            edit
                          </span>
                          Edit Entry
                        </button>
                        <button
                          onClick={() => handleDuplicateEntry(entry)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            content_copy
                          </span>
                          Duplicate
                        </button>
                        <hr className="my-2 border-slate-200 dark:border-surface-border" />
                        <button
                          onClick={() => setShowDeleteConfirm(entry.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                          Delete Entry
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-surface-border">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Edit Entry
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
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={editingEntry.amount}
                    onChange={(e) =>
                      setEditingEntry((prev) => ({
                        ...prev,
                        amount: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#101218] px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    min="0"
                    step="0.01"
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
                  Update Entry
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
                  Delete Entry
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
