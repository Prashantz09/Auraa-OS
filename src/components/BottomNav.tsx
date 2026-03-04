import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark pb-6 pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-none z-50">
      <div className="flex justify-between items-end max-w-md mx-auto relative">
        <Link
          to="/dashboard"
          className={`flex flex-1 flex-col items-center justify-end gap-1 group transition-colors ${path === "/dashboard" ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"}`}
        >
          <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
            <span
              className="material-symbols-outlined text-2xl"
              style={
                path === "/dashboard"
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}
              }
            >
              home
            </span>
          </div>
          <span
            className={`text-[10px] font-medium ${path === "/dashboard" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1"}`}
          >
            Home
          </span>
        </Link>

        <Link
          to="/clients"
          className={`flex flex-1 flex-col items-center justify-end gap-1 group transition-colors ${path === "/clients" ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"}`}
        >
          <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
            <span
              className="material-symbols-outlined text-2xl"
              style={
                path === "/clients" ? { fontVariationSettings: "'FILL' 1" } : {}
              }
            >
              group
            </span>
          </div>
          <span
            className={`text-[10px] font-medium ${path === "/clients" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1"}`}
          >
            Clients
          </span>
        </Link>

        {path === "/settings" ? (
          <div className="flex flex-1 flex-col items-center justify-end gap-1 text-primary relative group">
            <div className="absolute -top-10 bg-primary shadow-lg shadow-primary/30 rounded-full w-14 h-14 flex items-center justify-center border-4 border-background-light dark:border-background-dark transform transition-transform hover:scale-110">
              <span className="material-symbols-outlined text-white text-3xl">
                settings
              </span>
            </div>
            <span className="text-[10px] font-medium mt-6">Settings</span>
          </div>
        ) : (
          <div className="flex flex-1 justify-center relative">
            <button className="absolute -top-10 bg-primary shadow-lg shadow-primary/30 rounded-full w-14 h-14 flex items-center justify-center border-4 border-background-light dark:border-background-dark transform transition-transform hover:scale-110 active:scale-95">
              <span className="material-symbols-outlined text-white text-3xl">
                add
              </span>
            </button>
          </div>
        )}

        <Link
          to="/projects"
          className={`flex flex-1 flex-col items-center justify-end gap-1 group transition-colors ${path === "/projects" ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"}`}
        >
          <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
            <span
              className="material-symbols-outlined text-2xl"
              style={
                path === "/projects"
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}
              }
            >
              movie
            </span>
          </div>
          <span
            className={`text-[10px] font-medium ${path === "/projects" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1"}`}
          >
            Projects
          </span>
        </Link>

        {path !== "/settings" ? (
          <Link
            to="/settings"
            className="flex flex-1 flex-col items-center justify-end gap-1 group transition-colors text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
          >
            <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl">
                settings
              </span>
            </div>
            <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1">
              Settings
            </span>
          </Link>
        ) : (
          <Link
            to="/finance"
            className="flex flex-1 flex-col items-center justify-end gap-1 group transition-colors text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"
          >
            <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl">
                attach_money
              </span>
            </div>
            <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1">
              Finance
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
