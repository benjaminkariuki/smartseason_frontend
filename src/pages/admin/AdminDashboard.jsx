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
  Layers,
  Activity,
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
  const { kpi } = data || {
    kpi: { total_fields: 0, status_breakdown: {}, stage_breakdown: {} },
  };
  const totalFields = kpi.total_fields || 0;
  const activeFields = kpi.status_breakdown?.Active || 0;
  const atRiskFields = kpi.status_breakdown?.["At Risk"] || 0;
  const completedFields = kpi.status_breakdown?.Completed || 0;

  // New Stage Breakdown Mapping
  const stageBreakdown = kpi.stage_breakdown || {
    preparation: 0,
    planted: 0,
    growing: 0,
    ready: 0,
    harvested: 0,
  };

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

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
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
              className="bg-surface-tint h-full transition-all duration-1000 ease-out"
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
              className="bg-error h-full transition-all duration-1000 ease-out"
              style={{
                width: `${totalFields > 0 ? (atRiskFields / totalFields) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Comprehensive Breakdowns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Stages Distribution Progress Bars */}
        <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm border border-outline-variant/10">
          <h3 className="text-md-headline font-bold text-on-surface mb-6 tracking-tight flex items-center gap-2 font-headline">
            <Layers className="w-5 h-5 text-primary" /> Stage Distribution
          </h3>
          <div className="space-y-5">
            {Object.entries(stageBreakdown).map(([stage, count]) => {
              const percentage =
                totalFields > 0 ? Math.round((count / totalFields) * 100) : 0;
              return (
                <div key={stage} className="flex items-center gap-4">
                  <span className="w-24 text-xs font-bold text-on-surface-variant capitalize tracking-wide">
                    {stage}
                  </span>
                  <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right text-xs font-bold text-on-surface">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Health Blocks */}
        <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm border border-outline-variant/10">
          <h3 className="text-md-headline font-bold text-on-surface mb-6 tracking-tight flex items-center gap-2 font-headline">
            <Activity className="w-5 h-5 text-primary" /> Overall Field Health
          </h3>
          <div className="grid grid-cols-3 gap-4 h-full pb-6">
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-xl border border-primary/20 transition-colors hover:bg-primary/10">
              <span className="text-4xl md:text-5xl font-black text-primary">
                {activeFields}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-2">
                Active
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-error/5 rounded-xl border border-error/20 shadow-inner transition-colors hover:bg-error/10">
              <span className="text-4xl md:text-5xl font-black text-error">
                {atRiskFields}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-error uppercase tracking-wider mt-2">
                At Risk
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-surface-container rounded-xl border border-outline-variant/20 transition-colors hover:bg-surface-container-high">
              <span className="text-4xl md:text-5xl font-black text-on-surface-variant">
                {completedFields}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-2">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
