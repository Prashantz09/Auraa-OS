import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  const [showDog, setShowDog] = useState(false);

  const handleDogClick = () => {
    setShowDog(true);
    setTimeout(() => setShowDog(false), 3000); // Hide after 3 seconds
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark pb-6 pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-none z-50">
        <div className="flex justify-between items-end max-w-md mx-auto relative">
          {/* Home */}
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

          {/* Clients */}
          <Link
            to="/clients"
            className={`flex flex-1 flex-col items-center justify-end gap-1 group transition-colors ${path === "/clients" ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"}`}
          >
            <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
              <span
                className="material-symbols-outlined text-2xl"
                style={
                  path === "/clients"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
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

          {/* Animated Dog Button (Middle) */}
          <div className="flex flex-1 justify-center relative">
            <button
              onClick={handleDogClick}
              className="absolute -top-10 bg-primary shadow-lg shadow-primary/30 rounded-full w-14 h-14 flex items-center justify-center border-4 border-background-light dark:border-background-dark transform transition-transform hover:scale-110 active:scale-95 z-10 group"
            >
              <span className="material-symbols-outlined text-white text-3xl group-hover:animate-pulse">
                pets
              </span>
            </button>
          </div>

          {/* Projects */}
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

          {/* Settings */}
          <Link
            to="/settings"
            className={`flex flex-1 flex-col items-center justify-end gap-1 group transition-colors ${path === "/settings" ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary"}`}
          >
            <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
              <span
                className="material-symbols-outlined text-2xl"
                style={
                  path === "/settings"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                settings
              </span>
            </div>
            <span
              className={`text-[10px] font-medium ${path === "/settings" ? "" : "opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1"}`}
            >
              Settings
            </span>
          </Link>
        </div>
      </nav>

      {/* Animated Dog Overlay */}
      {showDog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            {/* Animated Dog */}
            <div className="animate-bounce">
              <div className="text-8xl animate-pulse">🐕</div>
              <div className="text-white text-center mt-4 animate-fade-in">
                <p className="text-2xl font-bold mb-2">Woof! Woof! 🐾</p>
                <p className="text-lg">You found the secret dog button!</p>
                <p className="text-sm text-gray-300 mt-2">
                  * This dog won't log you out, it's just for fun! *
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
