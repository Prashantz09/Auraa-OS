import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BottomNav from "../components/BottomNav";

export default function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("auraa_user");
    if (!userData) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="mobile-container flex flex-col min-h-screen relative overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-20 transition-app">
        <Outlet />
      </main>

      {/* Bottom navigation - fixed on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark border-t border-surface-border">
        <div className="mobile-container">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
