// src/pages/agent/AgentDashboard.jsx
import React from "react";
import { useAgentDashboard } from "../../hooks/useAgentDashboard";
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Droplets,
  Bug,
  Camera,
} from "lucide-react";

const AgentDashboard = () => {
  const { data, isLoading, isError } = useAgentDashboard();

  if (isLoading) {
    return (
      <main className="p-4 flex-1 flex justify-center items-center h-[80vh]">
        <div className="animate-pulse font-bold text-primary">
          Loading field data...
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-4 flex-1">
        <div className="bg-error-container text-on-error-container p-4 rounded-lg font-medium">
          Unable to load dashboard. Please check your connection.
        </div>
      </main>
    );
  }

  // Defaulting to 0 in case the backend hasn't populated data yet
  const assignedCount = data?.assigned_fields || 0;
  const pendingTasks = data?.pending_tasks || 0;
  const alerts = data?.active_alerts || 0;

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto w-full pb-20 md:pb-8">
      {/* Header Greeting */}
      <div className="mb-6">
        <h1 className="text-md-headline text-on-surface tracking-tight mb-1">
          Today's Overview
        </h1>
        <p className="text-md-body text-secondary">
          You have {pendingTasks} pending tasks across your fields.
        </p>
      </div>

      {/* Action Grid (Large Touch Targets for Mobile) */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button className="bg-primary text-on-primary p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
          <Bug className="w-8 h-8" />
          <span className="text-md-body font-medium">Log Pest Alert</span>
        </button>
        <button className="bg-surface-container-highest text-primary p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
          <Camera className="w-8 h-8" />
          <span className="text-md-body font-medium">Upload Photo</span>
        </button>
      </div>

      {/* Critical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-md-label font-medium text-on-surface-variant uppercase tracking-wider mb-1">
              Assigned Fields
            </p>
            <p className="text-3xl font-black text-primary">{assignedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div
          className={`p-5 rounded-xl border flex justify-between items-center shadow-sm ${alerts > 0 ? "bg-error-container border-error/30 text-on-error-container" : "bg-surface-container-lowest border-outline-variant/20 text-on-surface"}`}
        >
          <div>
            <p
              className={`text-md-label font-medium uppercase tracking-wider mb-1 ${alerts > 0 ? "text-error" : "text-on-surface-variant"}`}
            >
              Active Alerts
            </p>
            <p
              className={`text-3xl font-black ${alerts > 0 ? "text-error" : "text-on-surface"}`}
            >
              {alerts}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${alerts > 0 ? "bg-error/20 text-error" : "bg-surface-variant text-on-surface-variant"}`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="mb-4">
        <h2 className="text-md-headline font-medium text-on-surface mb-3">
          Priority Tasks
        </h2>
        <div className="flex flex-col gap-3">
          {/* Mock Task Item 1 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm flex gap-4 items-start active:bg-surface-container transition-colors">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0 mt-1">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-md-body font-medium text-on-surface leading-tight">
                  Soil Moisture Check
                </h3>
                <span className="text-md-label font-bold px-2 py-1 bg-surface-container rounded-md text-on-surface-variant">
                  Due 2:00 PM
                </span>
              </div>
              <p className="text-md-body text-secondary mt-1">
                Verify irrigation line pressure.
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs font-bold text-tertiary">
                <MapPin className="w-3 h-3" /> Sector 4B (Maize)
              </div>
            </div>
          </div>

          {/* Mock Task Item 2 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm flex gap-4 items-start active:bg-surface-container transition-colors">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant shrink-0 mt-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-md-body font-medium text-on-surface leading-tight">
                  Weekly Crop Report
                </h3>
                <span className="text-md-label font-bold px-2 py-1 bg-surface-container rounded-md text-on-surface-variant">
                  Due Today
                </span>
              </div>
              <p className="text-md-body text-secondary mt-1">
                Upload growth metrics and photos.
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs font-bold text-tertiary">
                <MapPin className="w-3 h-3" /> North Field (Wheat)
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AgentDashboard;
