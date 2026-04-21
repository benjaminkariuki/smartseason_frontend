// src/layouts/AgentLayout.jsx
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  UserCircle,
  Bell,
  Menu,
  Sprout,
} from "lucide-react";

const AgentLayout = () => {
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body flex flex-col md:flex-row pb-16 md:pb-0">
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

      {/* Desktop Side Navigation (Hidden on Mobile) */}
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${isActive("/agent/dashboard") ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-md-body">My Tasks</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg transition-colors font-medium"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-md-body">Assigned Fields</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg transition-colors font-medium"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-md-body">Submit Report</span>
          </Link>
        </div>
        <div className="mt-auto pt-4 border-t border-outline-variant/20">
          <button
            onClick={clearAuth}
            className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container rounded-lg w-full transition-colors font-medium"
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-md-body">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 w-full">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 flex justify-around items-center px-2 py-2 z-50 pb-safe">
        <Link
          to="/agent/dashboard"
          className={`flex flex-col items-center p-2 rounded-xl min-w-[64px] ${isActive("/agent/dashboard") ? "text-primary bg-primary-container/20" : "text-on-surface-variant"}`}
        >
          <LayoutDashboard
            className={`w-6 h-6 ${isActive("/agent/dashboard") ? "fill-primary/20" : ""}`}
          />
          <span className="text-md-label font-bold mt-1">Tasks</span>
        </Link>
        <Link
          to="#"
          className="flex flex-col items-center p-2 rounded-xl min-w-[64px] text-on-surface-variant hover:text-primary"
        >
          <MapPin className="w-6 h-6" />
          <span className="text-md-label font-bold mt-1">Fields</span>
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
          <span className="text-md-label font-bold mt-1">Alerts</span>
        </Link>
        <button
          onClick={clearAuth}
          className="flex flex-col items-center p-2 rounded-xl min-w-[64px] text-on-surface-variant hover:text-error"
        >
          <UserCircle className="w-6 h-6" />
          <span className="text-md-label font-bold mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default AgentLayout;
