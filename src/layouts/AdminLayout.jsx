// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  Map,
  Leaf,
  BarChart3,
  LifeBuoy,
  UserCircle,
  Menu,
  Search,
  Bell,
  Settings,
  HelpCircle,
  X,
  Plus,
} from "lucide-react";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();

  // Helper to highlight the active menu item
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-surface text-on-surface flex min-h-screen font-body">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-low text-primary text-sm font-semibold tracking-wide transition-transform duration-300 ease-in-out p-4 gap-4 z-30 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-md-headline text-primary leading-tight">
                Field Ops
              </h1>
              <p className="text-md-label text-secondary font-medium">
                Smart Season
              </p>
            </div>
          </div>
          <button
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Link
          to="/admin/fields/new"
          className="w-full bg-primary text-on-primary rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-2 hover:bg-primary-container transition-colors mb-4 shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Field
        </Link>

        <div className="flex-1 flex flex-col gap-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive("/admin/dashboard") ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-md-body">Dashboard</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <Map className="w-5 h-5" />
            <span className="text-md-body">Field Map</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <Leaf className="w-5 h-5" />
            <span className="text-md-body">Crop Cycles</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-md-body">Reports</span>
          </Link>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant/20">
          <Link
            to="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <LifeBuoy className="w-5 h-5" />
            <span className="text-md-body">Support</span>
          </Link>
          <button
            onClick={clearAuth}
            className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container rounded-lg transition-colors text-left"
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-md-body">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 w-full min-h-screen">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-6 py-4 bg-surface-bright/80 backdrop-blur-md text-primary text-sm font-medium z-10 sticky top-0 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-primary p-1 -ml-2 rounded-md hover:bg-surface-container"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-md-headline text-primary hidden sm:block">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center bg-surface-container-highest rounded-md px-3 py-2 w-64 max-w-sm hidden md:flex focus-within:ring-2 focus-within:ring-primary-fixed transition-shadow">
            <Search className="w-4 h-4 text-on-surface-variant mr-2" />
            <input
              className="bg-transparent border-none outline-none w-full text-md-body text-on-surface placeholder:text-on-surface-variant"
              placeholder="Search fields, agents..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors hidden sm:block">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-outline-variant/30">
              <div className="hidden md:block text-right">
                <p className="text-md-body font-bold text-on-surface leading-tight">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-md-label text-secondary">
                  {user?.email || "admin@openrails.com"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold ring-2 ring-surface-container-highest">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content loads here based on the route */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
