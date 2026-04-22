// src/layouts/AgentLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  UserCircle,
  Bell,
  Sprout,
  CloudSun,
} from "lucide-react";

const AgentLayout = () => {
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // --- Dynamic Greeting Logic ---
  const [greeting, setGreeting] = useState("Good day");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Helper to dynamically set the small subtitle based on the route
  const getPageSubtitle = () => {
    if (location.pathname.includes("tasks")) return "Task Management";
    return "Agent Dashboard";
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex flex-col md:flex-row pb-16 md:pb-0 overflow-hidden">
      {/* Top App Bar (Mobile & Desktop) */}
      <header className="flex justify-between items-center w-full px-4 py-3 bg-surface-bright/95 backdrop-blur-md text-primary z-10 sticky top-0 border-b border-outline-variant/10 md:hidden">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          <span className="text-md-headline">Smart Season</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors relative">
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || "A"}
          </div>
        </div>
      </header>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-outline-variant/10 p-4 z-20">
        <div className="flex items-center gap-3 mb-8 px-2">
          <Sprout className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-md-headline text-primary leading-tight">
              Field Agent
            </h1>
            <p className="text-md-label text-secondary">{user?.name}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <Link
            to="/agent/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${isActive("/agent/dashboard") ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-md-body">Dashboard</span>
          </Link>

          <Link
            to="/agent/tasks"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${isActive("/agent/tasks") ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"}`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-md-body">My Tasks</span>
          </Link>

          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg transition-colors font-bold"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-md-body">Submit Report</span>
          </Link>
        </div>

        <div className="mt-auto pt-4 border-t border-outline-variant/20">
          <button
            onClick={clearAuth}
            className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container rounded-lg w-full transition-colors font-bold"
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-md-body">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* --- Main Content Area (Now manages scrolling and the Unified Header) --- */}
      <main className="flex-1 md:ml-64 w-full h-[calc(100vh-64px)] md:h-screen overflow-y-auto relative pb-safe">
        <div className="max-w-7xl mx-auto w-full p-6 md:p-10 space-y-8">
          {/* UNIFIED HEADER FOR ALL PAGES */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-outline-variant/10 pb-6 md:pb-8">
            <div>
              <h2 className="text-md-label font-bold text-secondary tracking-widest uppercase mb-1">
                {getPageSubtitle()}
              </h2>
              <h1 className="text-md-large-title font-display font-bold text-on-surface tracking-tight font-headline">
                {greeting}, {user?.name?.split(" ")[0] || "Agent"}
              </h1>
            </div>
            <div className="bg-surface-container-lowest/70 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 shadow-sm border border-outline-variant/20 min-w-[280px]">
              <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                <CloudSun className="w-7 h-7" />
              </div>
              <div>
                <div className="text-md-body text-on-surface-variant font-medium">
                  Regional Sector
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-md-headline font-bold text-on-surface">
                    Active
                  </span>
                  <span className="text-md-label text-primary font-medium">
                    Monitoring Phase
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Page specific content is injected here */}
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 flex justify-around items-center px-2 py-2 z-50 pb-safe shadow-[0_-8px_24px_rgba(25,28,25,0.06)]">
        <Link
          to="/agent/dashboard"
          className={`flex flex-col items-center p-2 rounded-xl min-w-[64px] ${isActive("/agent/dashboard") ? "text-primary bg-primary-container/20" : "text-on-surface-variant"}`}
        >
          <LayoutDashboard
            className={`w-6 h-6 ${isActive("/agent/dashboard") ? "fill-primary/20" : ""}`}
          />
          <span className="text-[10px] font-bold mt-1">Dash</span>
        </Link>
        <Link
          to="/agent/tasks"
          className={`flex flex-col items-center p-2 rounded-xl min-w-[64px] ${isActive("/agent/tasks") ? "text-primary bg-primary-container/20" : "text-on-surface-variant hover:text-primary"}`}
        >
          <MapPin
            className={`w-6 h-6 ${isActive("/agent/tasks") ? "fill-primary/20" : ""}`}
          />
          <span className="text-[10px] font-bold mt-1">Fields</span>
        </Link>
        <div className="relative -top-5">
          <button className="bg-primary text-on-primary p-4 rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </button>
        </div>
        <Link
          to="#"
          className="flex flex-col items-center p-2 rounded-xl min-w-[64px] text-on-surface-variant hover:text-primary"
        >
          <Bell className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Alerts</span>
        </Link>
        <button
          onClick={clearAuth}
          className="flex flex-col items-center p-2 rounded-xl min-w-[64px] text-on-surface-variant hover:text-error"
        >
          <UserCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default AgentLayout;
