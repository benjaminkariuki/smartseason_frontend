// src/components/agent/AgentFieldDetailsModal.jsx
import React from "react";
import {
  X,
  Map,
  Clock,
  Leaf,
  AlertTriangle,
  User as UserIcon,
  Loader2, // <-- Add Loader2 for the spinner
} from "lucide-react";
import { useActiveAgents } from "../../hooks/useFieldManagement";

const AgentFieldDetailsModal = ({ field, isOpen, onClose }) => {
  // 1. Grab isLoading from the hook
  const { data: agents, isLoading: isAgentsLoading } = useActiveAgents();

  if (!isOpen || !field) return null;

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getAgentName = (id) => {
    if (!id || id === "nothing") return "Unassigned";

    // We don't need the fallback here anymore because we are blocking the render entirely
    // if agents haven't loaded yet (see line 56).
    const agent = agents?.find((a) => a.id.toString() === id.toString());
    return agent ? agent.name : `Deleted Agent (ID: ${id})`; // Better fallback if agent was deleted from DB
  };

  const formatLogMessage = (log) => {
    if (log.field_changed === "created") return log.new_value;

    const newVal = log.new_value;
    const oldVal = log.old_value || "nothing";

    switch (log.field_changed) {
      case "notes":
        return `Added field observation: "${newVal}"`;
      case "current_stage":
        return `Advanced crop stage to "${newVal}"`;
      case "agent_id":
        return `Field reassigned from "${getAgentName(oldVal)}" to "${getAgentName(newVal)}"`;
      default:
        return `Updated ${log.field_changed.replace("_", " ")} to "${newVal}"`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center p-0 md:p-4 bg-surface md:bg-on-surface/60 backdrop-blur-sm transition-all">
      <div className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl bg-surface md:rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 md:px-8 py-4 bg-surface-container-lowest border-b border-outline-variant/20 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div>
            <p className="text-md-label font-bold text-outline uppercase tracking-wider mb-0.5">
              Field Dossier
            </p>
            <h2 className="text-md-headline font-bold text-primary tracking-tight font-headline truncate max-w-[250px] md:max-w-md">
              {field.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 md:p-2 bg-surface-container-high md:bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-surface-container-low/30 p-4 md:p-8 space-y-6">
          {/* Quick Stats Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-2 md:col-span-1 p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
              <span className="text-md-label font-bold text-outline uppercase mb-1 block">
                Crop Type
              </span>
              <div className="flex items-center gap-2 text-md-body font-bold text-on-surface capitalize">
                <Leaf className="w-4 h-4 text-primary" /> {field.crop_type}
              </div>
            </div>
            <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
              <span className="text-md-label font-bold text-outline uppercase mb-1 block">
                Current Stage
              </span>
              <div className="flex items-center gap-2 text-md-body font-semibold text-primary capitalize">
                <span className="w-2 h-2 rounded-full bg-primary"></span>{" "}
                {field.current_stage}
              </div>
            </div>
            <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
              <span className="text-md-label font-bold text-outline uppercase mb-1 block">
                Health Status
              </span>
              <div
                className={`text-md-body font-bold ${field.status === "At Risk" ? "text-error flex items-center gap-1" : "text-on-surface"}`}
              >
                {field.status === "At Risk" && (
                  <AlertTriangle className="w-4 h-4" />
                )}{" "}
                {field.status}
              </div>
            </div>
          </div>

          {/* Timeline / Audit Log */}
          <div className="bg-surface-container-lowest rounded-xl p-5 md:p-8 shadow-sm border border-outline-variant/10">
            <h3 className="text-md-headline font-bold text-on-surface mb-6 font-headline flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Operational Timeline
            </h3>

            {/* 2. Block the entire timeline render until agents are loaded! */}
            {isAgentsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
                {!field.histories || field.histories.length === 0 ? (
                  <div className="text-center text-md-body text-on-surface-variant py-8 italic">
                    No operational logs recorded yet.
                  </div>
                ) : (
                  field.histories.map((log) => {
                    const isNote = log.field_changed === "notes";

                    return (
                      <div
                        key={log.id}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-lowest shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${isNote ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"}`}
                        >
                          {log.user?.name?.charAt(0) || (
                            <UserIcon className="w-4 h-4" />
                          )}
                        </div>

                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-outline-variant/20 shadow-sm bg-surface transition-shadow hover:shadow-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-md-body font-medium text-on-surface truncate">
                              {log.user?.name || "System"}
                            </span>
                            <span className="text-md-label font-bold text-grey-500 uppercase tracking-wider whitespace-nowrap">
                              {timeAgo(log.created_at)}
                            </span>
                          </div>
                          <p
                            className={`text-md-body font-medium ${isNote ? "text-secondary italic border-l-2 border-secondary/30 pl-3" : "text-on-surface-variant"}`}
                          >
                            {formatLogMessage(log)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentFieldDetailsModal;
