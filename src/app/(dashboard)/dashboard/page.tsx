"use client";

import { useEffect, useRef, useState } from "react";
import {
  getClients,
  getProjects,
  getUsers,
  getNotices,
  addKudos,
  onKudos,
  Project,
  Notice,
  Kudos,
  User,
} from "@/lib/db";

import {
  Users,
  Briefcase,
  Activity as ActivityIcon,
  CheckCircle2,
  Megaphone,
  Send,
  Sparkles,
  Heart,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import Confetti from "react-confetti";

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();

  // Stats
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalUsers: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);

  const [activeNotices, setActiveNotices] = useState<Notice[]>([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isNoticePaused, setIsNoticePaused] = useState(false);

  // Kudos
  const [kudosList, setKudosList] = useState<Kudos[]>([]);
  const [newKudosText, setNewKudosText] = useState("");
  const [isSendingKudos, setIsSendingKudos] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Quote
  const quotes = [
    "The best way to get a project done is to start.",
    "Quality is not an act, it is a habit.",
    "Simplicity is the soul of efficiency.",
    "Design is how it works.",
    "Believe you can and you're halfway there.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuoteMounted, setIsQuoteMounted] = useState(false);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
    setIsQuoteMounted(true);
  }, []);
  // Fetch dashboard data
  useEffect(() => {
    if (!user) return; // Wait until authenticated
    const fetchData = async () => {
      const [clients, projects, usersData, notices] = await Promise.all([
        getClients(),
        getProjects(),
        getUsers(),
        getNotices(),
      ]);
      setStats({
        totalClients: clients.length,
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "Working").length,
        totalUsers: usersData.length,
      });
      setRecentProjects(projects.slice(0, 5));
      setUsersData(usersData); // Store users data for avatar lookup
      console.log(
        "Users data loaded:",
        usersData.length,
        usersData.map((u) => ({ name: u.name, avatar: u.avatar })),
      );
      const active = notices
        .filter((n) => Date.now() - n.createdAt <= 48 * 60 * 60 * 1000)
        .sort((a, b) => b.createdAt - a.createdAt);
      setActiveNotices(active);
    };
    fetchData();
  }, [user]);

  // Notice Slider
  useEffect(() => {
    if (activeNotices.length <= 1 || isNoticePaused) return;
    const timer = setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % activeNotices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeNotices.length, isNoticePaused]);

  // Real-time kudos listener
  useEffect(() => {
    if (!user) return; // Wait until authenticated
    const unsub = onKudos((list) => {
      setKudosList(list);
    });
    return () => unsub();
  }, [user]);

  // Send Kudo
  const handleSendKudos = async () => {
    const text = newKudosText.trim();
    if (!text || !user || isSendingKudos) return;
    setIsSendingKudos(true);
    setNewKudosText("");

    // Pick a random sticky note color
    const themeColors = [
      "bg-yellow-200 text-yellow-900",
      "bg-blue-200 text-blue-900",
      "bg-pink-200 text-pink-900",
      "bg-emerald-200 text-emerald-900",
      "bg-purple-200 text-purple-900",
    ];
    const randomColor =
      themeColors[Math.floor(Math.random() * themeColors.length)];

    try {
      await addKudos({
        text,
        fromUser: user.name || "A Team Member",
        themeColor: randomColor,
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // Hide confetti after 4s
    } catch (e) {
      console.error("Kudos send error:", e);
    } finally {
      setIsSendingKudos(false);
    }
  };

  const handleKudosKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendKudos();
    }
  };

  const statCards = [
    {
      name: "Total Projects",
      value: stats.totalProjects,
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/40",
    },
    {
      name: "Active Projects",
      value: stats.activeProjects,
      icon: ActivityIcon,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/40",
    },
    {
      name: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
    {
      name: "Team Members",
      value: stats.totalUsers,
      icon: CheckCircle2,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/40",
    },
  ];

  const formatTime = (ts: number) => {
    try {
      const date = new Date(ts);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      // Format with relative time for better UX
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      // For older dates, show the actual date
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error, "timestamp:", ts);
      return "Date error";
    }
  };

  // Helper function to get user avatar by name (more flexible matching)
  const getUserAvatar = (userName: string) => {
    // Try exact match first
    let user = usersData.find((u) => u.name === userName);

    // If no exact match, try partial match (first name)
    if (!user) {
      const firstName = userName.split(" ")[0].toLowerCase();
      user = usersData.find(
        (u) =>
          u.name.toLowerCase().includes(firstName) ||
          u.name.toLowerCase().startsWith(firstName),
      );
    }

    return user?.avatar || null;
  };

  return (
    <div className="space-y-8 relative">
      {/* Confetti Explosion Layer */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex justify-center items-start">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            gravity={0.15}
          />
        </div>
      )}

      {/* ── Greeting ── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Hello, {user?.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
          Welcome back to your workspace
        </p>
      </div>

      {/* ── Announcement / Quote ── */}
      {activeNotices.length > 0 ? (
        <div
          onClick={() => setIsNoticePaused(!isNoticePaused)}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 pb-7 shadow-sm relative overflow-hidden cursor-pointer transition-all hover:shadow-md group"
          title="Click to pause/resume sliding"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />

          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm shrink-0">
              <Megaphone
                className={`w-6 h-6 text-blue-600 dark:text-blue-400 ${!isNoticePaused && "animate-pulse"}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {activeNotices[currentNoticeIndex].title}
                </h2>
                <div className="flex items-center gap-2 shrink-0">
                  {isNoticePaused && activeNotices.length > 1 && (
                    <span className="text-[10px] uppercase font-bold text-blue-500 dark:text-blue-400">
                      Paused
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    {activeNotices[currentNoticeIndex].type}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {activeNotices[currentNoticeIndex].message}
              </p>
              <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                Published by {activeNotices[currentNoticeIndex].createdBy}
              </p>
            </div>
          </div>

          {/* Pagination Dots */}
          {activeNotices.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              {activeNotices.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentNoticeIndex ? "bg-blue-500" : "bg-blue-200 dark:bg-blue-800"}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm flex items-center justify-center">
          <p className="text-center text-lg font-medium text-gray-400 dark:text-gray-500 italic">
            "{isQuoteMounted ? quotes[quoteIndex] : quotes[0]}"
          </p>
        </div>
      )}

      {/* ── Stats Cards: 2-col mobile, 2-col tablet, 4-col desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className={`p-3 sm:p-4 rounded-xl ${stat.bg} flex-shrink-0`}>
              <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
                {stat.name}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Grid: Recent Projects + Community Chat ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8">
        {/* Recent Projects (wider) */}
        <div className="xl:col-span-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Projects
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              No projects yet. Start by adding a client and a project.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-col min-w-0 mr-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {project.serviceType}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        project.status === "Completed"
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kudos & Shoutouts Board */}
        <div
          className="xl:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800/50 flex flex-col relative overflow-hidden"
          style={{ minHeight: "360px", maxHeight: "480px" }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-2xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-2xl opacity-50 pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-indigo-100/50 dark:border-indigo-800/30 relative z-10">
            <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
              <Heart className="w-5 h-5 fill-current opacity-80" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Kudos Board
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Celebrate the team's wins!
              </p>
            </div>
          </div>

          {/* Kudos Grid (Masonry style using flex/overflow) */}
          <div className="flex-1 overflow-y-auto p-5 relative z-10 custom-scrollbar">
            {kudosList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 text-indigo-400/50 dark:text-indigo-500/30">
                <Sparkles className="w-8 h-8 opacity-40 mb-3" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No kudos yet.
                </p>
                <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                  Be the first to shoutout a teammate!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 items-start justify-center">
                {kudosList.map((kudos, i) => {
                  // Debug logging
                  console.log(`Kudos ${i}:`, {
                    fromUser: kudos.fromUser,
                    createdAt: kudos.createdAt,
                    formattedTime: formatTime(kudos.createdAt),
                    avatar: getUserAvatar(kudos.fromUser),
                  });

                  // Generate a stable rotation based on the ID string length and index so it doesn't flicker on re-renders,
                  // but looks random (-3deg to +3deg)
                  const rotation = ((kudos.id.length + i) % 7) - 3;

                  return (
                    <div
                      key={kudos.id}
                      className={`${kudos.themeColor} w-full sm:w-[calc(50%-8px)] p-4 rounded-md shadow-[2px_3px_5px_rgba(0,0,0,0.05)] border border-black/5 dark:border-white/5 transition-transform hover:scale-105 hover:z-20 cursor-default`}
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <p className="font-handwriting text-[15px] leading-relaxed mb-3 font-medium opacity-90">
                        {/* Split text by @mentions to highlight them */}
                        {kudos.text
                          .split(/(@[a-zA-Z0-9_\-]+)/g)
                          .map((part, index) => {
                            if (part.startsWith("@")) {
                              return (
                                <span
                                  key={index}
                                  className="font-bold opacity-100 bg-white/30 px-1 rounded-md"
                                >
                                  {part}
                                </span>
                              );
                            }
                            return <span key={index}>{part}</span>;
                          })}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const avatar = getUserAvatar(kudos.fromUser);
                            return avatar ? (
                              <img
                                src={avatar}
                                alt={kudos.fromUser}
                                className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                {kudos.fromUser.charAt(0).toUpperCase()}
                              </div>
                            );
                          })()}
                          <span className="text-xs font-bold opacity-75">
                            — {kudos.fromUser.split(" ")[0]}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                          {formatTime(kudos.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-5 pb-5 pt-3 border-t border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative z-10">
            <div className="flex gap-2">
              <input
                type="text"
                value={newKudosText}
                onChange={(e) => setNewKudosText(e.target.value.slice(0, 150))}
                onKeyDown={handleKudosKeyDown}
                placeholder="Give a shoutout... (e.g. Thanks for the help!)"
                className="flex-1 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 shadow-inner"
              />
              <button
                onClick={handleSendKudos}
                disabled={!newKudosText.trim() || isSendingKudos}
                className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center shrink-0"
                title="Send Kudos"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
