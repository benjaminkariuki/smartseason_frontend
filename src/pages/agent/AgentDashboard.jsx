// src/pages/agent/AgentDashboard.jsx
import React from "react";
import { useAgentDashboard } from "../../hooks/useAgentDashboard";
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
} from "lucide-react";

const AgentDashboard = () => {
  // --- Stats Hook ---
  const { data: statsData, isLoading: isLoadingStats } = useAgentDashboard();

  // Top level counts
  const assignedCount = statsData?.work_queue?.total_assigned || 0;
  const alerts = statsData?.priority_alerts?.length || 0;
  const readyToHarvest = statsData?.work_queue?.ready_to_harvest || 0;

  // Breakdown Data
  const stageBreakdown = statsData?.stage_breakdown || {
    preparation: 0,
    planted: 0,
    growing: 0,
    ready: 0,
    harvested: 0,
  };
  const statusBreakdown = statsData?.status_breakdown || {
    Active: 0,
    "At Risk": 0,
    Completed: 0,
  };

  if (isLoadingStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="bg-surface-container-low h-36 rounded-xl"></div>
        <div className="bg-surface-container-low h-36 rounded-xl"></div>
        <div className="bg-surface-container-low h-36 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between h-36 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start">
            <span className="text-md-label font-bold text-on-surface-variant">
              Total Assigned Fields
            </span>
            <MapPin className="text-outline w-5 h-5" />
          </div>
          <div className="text-md-large-title font-display font-bold text-on-surface tracking-tight">
            {assignedCount}
          </div>
        </div>

        <div
          className={`rounded-xl p-6 flex flex-col justify-between h-36 shadow-sm border border-outline-variant/10 ${alerts > 0 ? "bg-error-container border-l-4 border-l-error text-on-error-container" : "bg-surface-container-low"}`}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-md-label font-bold ${alerts > 0 ? "text-error" : "text-on-surface-variant"}`}
            >
              Fields At Risk
            </span>
            <AlertTriangle
              className={
                alerts > 0 ? "text-error w-5 h-5" : "text-outline w-5 h-5"
              }
            />
          </div>
          <div className="flex items-baseline gap-2">
            <div
              className={`text-md-large-title font-display font-bold tracking-tight ${alerts > 0 ? "text-error" : "text-on-surface"}`}
            >
              {alerts}
            </div>
            {alerts > 0 && (
              <span className="text-md-label font-bold text-error/80 uppercase tracking-wider">
                Requires Action
              </span>
            )}
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between h-36 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start">
            <span className="text-md-label font-bold text-on-surface-variant">
              Ready to Harvest
            </span>
            <CheckCircle2 className="text-primary w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-md-large-title font-display font-bold text-primary tracking-tight">
              {readyToHarvest}
            </div>
            <span className="text-md-label font-bold text-primary/80 uppercase tracking-wider">
              Action Needed
            </span>
          </div>
        </div>
      </div>

      {/* Comprehensive Breakdowns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stages Distribution Progress Bars */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
          <h3 className="text-md font-bold text-on-surface mb-6 tracking-tight flex items-center gap-2 font-headline">
            <Layers className="w-5 h-5 text-primary" /> Stage Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(stageBreakdown).map(([stage, count]) => {
              const percentage =
                assignedCount > 0
                  ? Math.round((count / assignedCount) * 100)
                  : 0;
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
                  <span className="w-8 text-right text-xs font-bold text-on-surface">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Health Blocks */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
          <h3 className="text-md font-bold text-on-surface mb-6 tracking-tight flex items-center gap-2 font-headline">
            <Activity className="w-5 h-5 text-primary" /> Overall Field Health
          </h3>
          <div className="grid grid-cols-3 gap-4 h-full pb-8">
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-xl border border-primary/20">
              <span className="text-3xl font-black text-primary">
                {statusBreakdown["Active"] || 0}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-2">
                Active
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-error/5 rounded-xl border border-error/20 shadow-inner">
              <span className="text-3xl font-black text-error">
                {statusBreakdown["At Risk"] || 0}
              </span>
              <span className="text-[10px] font-bold text-error uppercase tracking-wider mt-2">
                At Risk
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-surface-container rounded-xl border border-outline-variant/20">
              <span className="text-3xl font-black text-on-surface-variant">
                {statusBreakdown["Completed"] || 0}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-2">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
