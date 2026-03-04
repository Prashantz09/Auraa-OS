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
    <div className="flex flex-col min-h-screen relative overflow-hidden max-w-md mx-auto w-full border-x border-surface-border bg-background-light dark:bg-background-dark shadow-2xl">
      <Outlet />
      <BottomNav />
    </div>
  );
}
