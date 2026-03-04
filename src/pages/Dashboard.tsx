import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample data
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

// Motivational quotes
const MOTIVATIONAL_QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    text: "Life is 10% what happens to you and 90% how you react to it.",
    author: "Charles R. Swindoll",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "A year from now you may wish you had started today.",
    author: "Karen Lamb",
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Anonymous",
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Anonymous",
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Anonymous",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("auraa_user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("auraa-notifications");
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      // Convert string dates back to Date objects and filter out expired ones
      const validNotifications = parsed
        .map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) }))
        .filter((n: any) => {
          const now = new Date();
          const timeDiff = now.getTime() - n.createdAt.getTime();
          return timeDiff < 48 * 60 * 60 * 1000; // Less than 48 hours
        });
      setNotifications(validNotifications);
    }
  }, []);

  // Load clients from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem("auraa-clients");
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("auraa-projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Update quote every 2 hours
  useEffect(() => {
    const updateQuote = () => {
      const randomIndex = Math.floor(
        Math.random() * MOTIVATIONAL_QUOTES.length,
      );
      setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
    };

    // Initial quote
    updateQuote();

    // Update every 2 hours (2 * 60 * 60 * 1000 milliseconds)
    const quoteInterval = setInterval(updateQuote, 2 * 60 * 60 * 1000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Calculate upcoming deadlines from projects
  const getUpcomingDeadlines = () => {
    if (!projects.length) return [];

    const now = new Date();
    return projects
      .filter((project) => project.deadline && new Date(project.deadline) > now)
      .map((project) => {
        const deadlineDate = new Date(project.deadline);
        const daysLeft = Math.ceil(
          (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        return {
          id: project.id,
          title: project.title,
          deadline: project.deadline,
          daysLeft: daysLeft,
          priority: project.priority || "medium",
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft) // Sort by closest deadline first
      .slice(0, 5); // Show max 5 upcoming deadlines
  };

  // Update date and time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "client":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "holiday":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "update":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const formatDateTime = (date: Date) => {
    return {
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const { time, date } = formatDateTime(currentDateTime);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="relative hover:scale-105 transition-transform duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
              {currentUser.avatar}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background-light dark:border-background-dark rounded-full"></div>
          </button>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Currently Active
            </p>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Date and Time Button */}
          <button className="flex flex-col items-end px-3 py-2 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">
              {time}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              {date}
            </span>
          </button>
        </div>
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
              {
                clients.filter(
                  (c) => c.status === "Active" || c.status === "active",
                ).length
              }
            </h3>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 dark:border-surface-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px]">
                  priority_high
                </span>
                {notifications.filter((n) => !n.read).length}
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Unread Notifications
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {notifications.filter((n) => !n.read).length}
            </h3>
          </div>
        </div>

        {/* Admin Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Notifications from Admin
            </h3>
            <button className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
              Mark All Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-6 border border-primary/20 dark:border-primary/30">
                <div className="text-center">
                  <div className="mb-4">
                    <span className="material-symbols-outlined text-4xl text-primary/60 dark:text-primary/40">
                      lightbulb
                    </span>
                  </div>
                  <blockquote className="space-y-3">
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      "{currentQuote.text}"
                    </p>
                    <footer className="text-sm text-slate-600 dark:text-slate-400">
                      — {currentQuote.author}
                    </footer>
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-primary/20 dark:border-primary/30">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Daily motivation • Updates every 2 hours
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-surface-border transition-all hover:border-primary/30 ${
                    !notification.read
                      ? "ring-1 ring-primary/20 bg-primary/5 dark:bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${getNotificationColor(notification.category)}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {getNotificationIcon(notification.category)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 ml-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">
                          schedule
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {notification.createdAt.toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {notification.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
            {getUpcomingDeadlines().length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">
                  event_available
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No upcoming deadlines
                </p>
              </div>
            ) : (
              getUpcomingDeadlines().map((deadline) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
