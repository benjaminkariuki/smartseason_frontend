// src/components/fields/FieldDetailsModal.jsx
import React from "react";
import { X, Map, Clock, User as UserIcon } from "lucide-react";
import { useActiveAgents } from "../../hooks/useFieldManagement";

const FieldDetailsModal = ({ field, isOpen, onClose }) => {
  // 1. Fetch agents for the history log name translation
  const { data: agents } = useActiveAgents();

  if (!isOpen || !field) return null;

  // 2. Native JS time formatting (No external packages needed)
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // 3. Helper to translate IDs to Names
  const getAgentName = (id) => {
    if (!id) return "Unassigned";
    if (!agents) return `Agent #${id}`; // Fallback while loading

    // Find the agent where the ID matches
    const agent = agents.find((a) => a.id.toString() === id.toString());
    return agent ? agent.name : `Agent #${id}`; // Fallback if agent was deleted
  };

  // 4. Helper to format the audit log messages dynamically
  const formatLogMessage = (log) => {
    if (log.field_changed === "created") return log.new_value;

    const oldVal = log.old_value || "nothing";
    const newVal = log.new_value;

    switch (log.field_changed) {
      case "agent_id":
        return `Reassigned agent from "${getAgentName(oldVal)}" to "${getAgentName(newVal)}"`;

      // If you add equipment or other relations in the future, add their cases here!

      default:
        // The catch-all for names, dates, stages, and crops
        return `Updated ${log.field_changed.replace("_", " ")} from "${oldVal}" to "${newVal}"`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-surface w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Strip */}
        <div className="px-8 py-4 bg-surface-container-lowest border-b border-outline-variant/20 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2 text-md-label font-medium text-outline">
            <span>Fields</span>
            <span className="text-md-label">&gt;</span>
            <span className="text-primary font-semibold">{field.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {/* Hero Header Section: Asymmetric Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="text-md-large-title font-headline font-bold text-on-surface mb-3">
                  {field.name}
                </h1>
                <p className="text-md-body text-on-surface-variant max-w-xl leading-relaxed capitalize">
                  Primary cultivation zone for {field.crop_type}. Currently
                  tracking under the {field.current_stage} phase.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex flex-col p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 min-w-[140px]">
                  <span className="text-md-label text-outline uppercase mb-1">
                    Current Stage
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-md-headline font-semibold text-primary capitalize">
                      {field.current_stage}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 min-w-[140px]">
                  <span className="text-md-label text-outline uppercase mb-1">
                    Assigned Agent
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">
                      {field.agent?.name?.charAt(0) || (
                        <UserIcon className="w-3 h-3" />
                      )}
                    </div>
                    <span className="text-md-headline font-semibold text-on-surface truncate max-w-[120px]">
                      {field.agent?.name || "Unassigned"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 min-w-[140px]">
                  <span className="text-md-label text-outline uppercase mb-1">
                    Status
                  </span>
                  <span
                    className={`text-md-headline font-semibold ${field.status === "At Risk" ? "text-error" : "text-on-surface"}`}
                  >
                    {field.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Map Placeholder Block */}
            <div className="lg:col-span-5 relative group">
              <div className="w-full h-80 rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 bg-surface-container-low flex flex-col items-center justify-center relative">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#204e2b 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>
                <Map className="w-16 h-16 text-primary/40 mb-4 z-10" />
                <button className="z-10 bg-surface-container-lowest text-primary font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
                  <Map className="w-5 h-5" />
                  View Detailed Plot Map
                </button>
              </div>
            </div>
          </section>

          {/* Audit Log Section */}
          <section className="bg-surface-container-low rounded-xl p-6 md:p-8 shadow-sm border border-outline-variant/20">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
              <div>
                <h3 className="text-md-headline font-headline font-bold text-on-surface">
                  History & Audit Log
                </h3>
                <p className="text-md-body text-on-surface-variant font-medium">
                  Tracking all interventions and environmental shifts
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container-highest text-on-surface font-semibold rounded-lg text-sm hover:bg-surface-container-high transition-colors">
                  Export PDF
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
              {!field.histories || field.histories.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/10 text-on-surface-variant font-medium">
                  No history logs recorded for this field yet.
                </div>
              ) : (
                field.histories.map((log) => (
                  <div
                    key={log.id}
                    className="bg-surface-container-lowest rounded-xl p-5 flex flex-wrap items-center gap-6 shadow-sm border-l-4 border-primary"
                  >
                    {/* Actor Info */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-10 h-10 rounded-full border-2 border-primary-fixed bg-surface-container-high flex items-center justify-center text-primary font-bold">
                        {log.user?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="text-md-body font-medium text-on-surface">
                          {log.user?.name || "System Auto"}
                        </p>
                        <p className="text-md-label text-outline capitalize">
                          {log.user?.role?.replace("_", " ") || "Process"}
                        </p>
                      </div>
                    </div>

                    {/* Action Details (Using the Helper Function) */}
                    <div className="flex-1 min-w-[300px]">
                      <p className="text-md-body text-on-surface-variant font-medium">
                        {formatLogMessage(log)}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-outline font-semibold">
                      <Clock className="w-4 h-4" />
                      {timeAgo(log.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsModal;
