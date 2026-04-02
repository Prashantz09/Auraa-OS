"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function RootRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Wait for Firebase auth to resolve

    if (user) {
      // Firebase SPA rewrite serves index.html for ALL URLs (e.g. /dashboard, /clients).
      // After hydration, Next.js is internally on the "/" route even if the browser URL
      // shows /dashboard. We must ALWAYS call router.replace so Next.js actually renders
      // the correct route component — even when pathname already looks correct.
      const target = (pathname === "/" || pathname === "") ? "/dashboard" : pathname;
      router.replace(target);
    } else {
      // Not logged in — preserve intended destination for post-login redirect
      const intended = (pathname === "/" || pathname === "") ? "/dashboard" : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(intended)}`);
    }
  }, [user, isLoading, router, pathname]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading AURAA Control...</p>
      </div>
    </div>
  );
}
