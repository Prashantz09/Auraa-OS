import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample data
const CURRENT_PROJECTS = [
  {
    id: 1,
    title: "TechTalk Podcast Series",
    client: "TechTalk Media",
    deadline: "2024-03-15",
    status: "active",
    progress: 75,
  },
  {
    id: 2,
    title: "YouTube Content Creation",
    client: "Creative Studios",
    deadline: "2024-03-18",
    status: "active",
    progress: 45,
  },
  {
    id: 3,
    title: "Social Media Campaign",
    client: "Brand Agency",
    deadline: "2024-03-20",
    status: "active",
    progress: 90,
  },
];

const UPCOMING_DEADLINES = [
  {
    id: 1,
    title: "TechTalk Podcast Series",
    deadline: "2024-03-15",
    daysLeft: 2,
    priority: "high",
  },
  {
    id: 2,
    title: "YouTube Content Creation",
    deadline: "2024-03-18",
    daysLeft: 5,
    priority: "medium",
  },
  {
    id: 3,
    title: "Social Media Campaign",
    deadline: "2024-03-20",
    daysLeft: 7,
    priority: "low",
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    user: "Sarah",
    action: "uploaded new assets for",
    target: "Nike Campaign",
    time: "10 minutes ago",
    type: "upload",
  },
  {
    id: 2,
    user: "Mike",
    action: "approved budget for",
    target: "Q3 Promo",
    time: "2 hours ago",
    type: "approval",
  },
  {
    id: 3,
    user: "System",
    action: "marked project as completed",
    target: "TechLaunch v2",
    time: "Yesterday at 4:30 PM",
    type: "completion",
  },
  {
    id: 4,
    user: "System",
    action: "new client onboarded",
    target: "Pixel Studio",
    time: "Yesterday at 11:00 AM",
    type: "onboarding",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("auraa_user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return "upload_file";
      case "approval":
        return "check_circle";
      case "completion":
        return "task_alt";
      case "onboarding":
        return "person_add";
      default:
        return "activity";
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
              {currentUser.avatar}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background-light dark:border-background-dark rounded-full"></div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Currently Active
            </p>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </h2>
          </div>
        </div>
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-2xl">
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </header>

      <div className="px-5 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {currentUser.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 dark:border-surface-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px]">
                  trending_up
                </span>
                2.1%
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Active Clients
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              12
            </h3>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 dark:border-surface-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">movie</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px]">
                  trending_up
                </span>
                12%
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Active Projects
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {CURRENT_PROJECTS.length}
            </h3>
          </div>
        </div>

        {/* Current Working Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Current Projects
            </h3>
            <button
              onClick={() => navigate("/projects")}
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {CURRENT_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-surface-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {project.client}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    {project.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      schedule
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {project.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {project.progress}%
                    </span>
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upcoming Deadlines
            </h3>
            <button className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
              View Calendar
            </button>
          </div>

          <div className="space-y-2">
            {UPCOMING_DEADLINES.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-surface-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${deadline.priority === "high" ? "bg-red-500" : deadline.priority === "medium" ? "bg-amber-500" : "bg-green-500"}`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {deadline.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {deadline.deadline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(deadline.priority)}`}
                  >
                    {deadline.priority}
                  </span>
                  <span className="text-xs font-medium text-slate-900 dark:text-white">
                    {deadline.daysLeft} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
              View All
            </button>
          </div>

          <div className="relative pl-4 space-y-4 before:absolute before:inset-y-2 before:left-[5px] before:w-px before:bg-slate-200 dark:before:bg-slate-800">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="relative">
                <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-slate-200">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {activity.user}
                      </span>{" "}
                      {activity.action}{" "}
                      <span className="text-primary font-medium">
                        {activity.target}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
