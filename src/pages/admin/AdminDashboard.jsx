// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import {
  Mountain,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Bug,
  Droplets,
  FileText,
  MapPin,
  Paperclip,
} from "lucide-react";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <main className="p-6 md:p-10 flex-1 w-full flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-lg">
          Loading metrics...
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-6 md:p-10 flex-1 w-full">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          Failed to load dashboard data. Please check your connection.
        </div>
      </main>
    );
  }

  // Map your backend API response to variables
  const { kpi } = data || { kpi: { total_fields: 0, status_breakdown: {} } };
  const totalFields = kpi.total_fields || 0;
  const activeFields = kpi.status_breakdown?.Active || 0;
  const atRiskFields = kpi.status_breakdown?.["At Risk"] || 0;
  const completedFields = kpi.status_breakdown?.Completed || 0;

  return (
    <main className="p-6 md:p-8 lg:p-10 flex-1 max-w-7xl mx-auto w-full">
      {/* Hero Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-md-large-title text-on-surface mb-2">Overview</h2>
          <p className="text-md-body text-secondary">
            Monitor your agricultural assets and agent activities.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-lg font-medium hover:bg-tertiary-container hover:text-on-primary transition-colors shadow-sm">
            Export Report
          </button>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm">
            Quick Action
          </button>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Fields (Large) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-surface-container-low p-8 rounded-xl relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-surface-container-high transition-colors shadow-sm">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1000&auto=format&fit=crop')",
            }}
          ></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Mountain className="w-5 h-5" />
              <span className="text-md-label font-medium uppercase tracking-wide">
                Total Fields Monitored
              </span>
            </div>
            <div className="text-5xl md:text-[3.5rem] font-bold leading-none text-primary mb-2">
              {totalFields}
            </div>
            <p className="text-md-body text-secondary">
              Active data connections
            </p>
          </div>
        </div>

        {/* Active Status Card */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div>
            <div className="flex items-center justify-between mb-4 text-on-surface-variant">
              <span className="text-md-label font-medium tracking-wide uppercase">
                Active
              </span>
              <CheckCircle2 className="w-6 h-6 text-surface-tint" />
            </div>
            <div className="text-3xl font-bold text-on-surface">
              {activeFields}
            </div>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-surface-tint h-full"
              style={{
                width: `${totalFields > 0 ? (activeFields / totalFields) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* At Risk Status Card */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border border-error/20">
          <div>
            <div className="flex items-center justify-between mb-4 text-on-surface-variant">
              <span className="text-md-label font-medium tracking-wide uppercase">
                At Risk
              </span>
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <div className="text-3xl font-bold text-error">{atRiskFields}</div>
          </div>
          <div className="w-full bg-error-container h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-error h-full"
              style={{
                width: `${totalFields > 0 ? (atRiskFields / totalFields) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Completed Status Card (Pushed to bottom row on large screens) */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20 md:col-start-3 lg:col-start-auto">
          <div>
            <div className="flex items-center justify-between mb-4 text-on-surface-variant">
              <span className="text-md-label font-medium tracking-wide uppercase">
                Completed
              </span>
              <Archive className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-secondary">
              {completedFields}
            </div>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-secondary h-full"
              style={{
                width: `${totalFields > 0 ? (completedFields / totalFields) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Static Mock Activity List for now */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-md-headline font-medium text-on-surface">
            Recent Activity
          </h3>
          <button className="text-md-body font-medium text-primary hover:underline">
            View All
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {/* Item 1 */}
          <div className="flex items-start gap-4 p-4 md:p-6 hover:bg-surface-container-high transition-colors cursor-pointer border-b border-outline-variant/10">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <Bug className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <h4 className="text-md-body font-medium text-on-surface">
                  Pest Alert Logged
                </h4>
                <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider mt-1 md:mt-0">
                  10 mins ago
                </span>
              </div>
              <p className="text-md-body text-secondary mb-2">
                Agent Sarah Jenkins reported early signs of aphids in Sector 4B.
              </p>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[0.6875rem] font-bold text-tertiary">
                  <MapPin className="w-3 h-3" /> Sector 4B
                </span>
                <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2 py-1 rounded text-[0.6875rem] font-bold">
                  High Priority
                </span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-4 p-4 md:p-6 hover:bg-surface-container-high transition-colors cursor-pointer border-b border-outline-variant/10">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <h4 className="text-md-body font-medium text-on-surface">
                  Irrigation Cycle Completed
                </h4>
                <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider mt-1 md:mt-0">
                  2 hours ago
                </span>
              </div>
              <p className="text-md-body text-secondary mb-2">
                Automated system finished scheduled watering for North Fields.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-4 p-4 md:p-6 hover:bg-surface-container-high transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface-dim text-on-surface flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <h4 className="text-md-body font-medium text-on-surface">
                  Soil Analysis Uploaded
                </h4>
                <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider mt-1 md:mt-0">
                  Yesterday
                </span>
              </div>
              <p className="text-md-body text-secondary mb-2">
                Lab results for Q3 soil samples attached to Field Profile 12.
              </p>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[0.6875rem] font-bold text-tertiary">
                  <MapPin className="w-3 h-3" /> Field 12
                </span>
                <span className="inline-flex items-center gap-1 bg-surface px-2 py-1 rounded text-[0.6875rem] font-bold text-primary border border-outline-variant/50">
                  <Paperclip className="w-3 h-3" /> report.pdf
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
