// src/pages/agent/AgentTasks.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAgentFields } from "../../hooks/useAgentDashboard";
import UpdateStageModal from "../../components/agent/UpdateStageModal";
import AgentFieldDetailsModal from "./AgentFieldDetailsModal";
import { ChevronDown, Loader2, Leaf } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AgentTasks = () => {
  const [filters, setFilters] = useState({
    stage: "Stage: All",
    status: "Category: All",
  });
  const [updatingField, setUpdatingField] = useState(null);
  const [viewingField, setViewingField] = useState(null);

  const {
    data: fieldsData,
    isLoading: isLoadingFields,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAgentFields(filters);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { threshold: 1.0 },
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const fields = fieldsData
    ? fieldsData.pages.flatMap((page) => page.data)
    : [];

  const getListStyle = (status) => {
    switch (status) {
      case "At Risk":
        return {
          badgeBg: "bg-error/10",
          badgeText: "text-error",
          dotBg: "bg-error",
          btnBg: "bg-error text-on-error hover:opacity-90",
          btnText: "Inspect",
        };
      case "Completed":
        return {
          badgeBg: "bg-outline-variant/20",
          badgeText: "text-on-surface-variant",
          dotBg: "bg-outline-variant",
          btnBg:
            "bg-surface text-on-surface border border-outline-variant/30 hover:bg-surface-container-highest",
          btnText: "Review",
        };
      default:
        return {
          badgeBg: "bg-primary/10",
          badgeText: "text-primary",
          dotBg: "bg-primary",
          btnBg:
            "bg-surface text-on-surface border border-outline-variant/30 hover:bg-surface-container-highest",
          btnText: "Update",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* List View Container */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20">
        <div className="p-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10">
          <h3 className="text-md-headline font-bold text-on-surface tracking-tight font-headline">
            Task Priorities
          </h3>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-40">
              <select
                value={filters.stage}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, stage: e.target.value }))
                }
                className="w-full appearance-none bg-surface-container-high text-on-surface text-md-body font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-fixed border-none cursor-pointer"
              >
                <option>Stage: All</option>
                <option value="preparation">Preparation</option>
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready">Ready</option>
                <option value="harvested">Harvested</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>

            <div className="relative w-full md:w-40">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full appearance-none bg-surface-container-high text-on-surface text-md-body font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-fixed border-none cursor-pointer"
              >
                <option>Category: All</option>
                <option value="active">Routine</option>
                <option value="at risk">Priority</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container-lowest text-md-label font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">
          <div className="col-span-3">Field Name</div>
          <div className="col-span-3">Crop Type</div>
          <div className="col-span-3">Current Stage</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="flex flex-col">
          {isLoadingFields ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : fields.length === 0 ? (
            <div className="p-12 text-center font-bold text-on-surface-variant">
              No fields match your current filters.
            </div>
          ) : (
            fields.map((field) => {
              const style = getListStyle(field.status);

              return (
                <div
                  key={field.id}
                  onClick={() => setViewingField(field)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-surface-container-high transition-colors duration-200 group cursor-pointer border-b border-outline-variant/10 last:border-b-0"
                >
                  <div className="col-span-8 md:col-span-3 flex flex-col">
                    <span className="font-bold text-on-surface text-md-headline truncate">
                      {field.name}
                    </span>
                    <span className="text-md-label text-on-surface-variant mt-0.5 md:hidden capitalize">
                      {field.crop_type} • {field.current_stage}
                    </span>
                  </div>

                  <div className="col-span-3 hidden md:flex items-center gap-2 text-md-body text-on-surface-variant font-bold capitalize">
                    <Leaf className="w-4 h-4 text-primary" /> {field.crop_type}
                  </div>

                  <div className="col-span-4 md:col-span-3 hidden md:flex flex-col text-md-body font-bold text-on-surface capitalize">
                    <span>{field.current_stage}</span>
                    <span className="text-md-label text-on-surface-variant font-medium lowercase mt-0.5">
                      Updated{" "}
                      {formatDistanceToNow(new Date(field.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="col-span-4 md:col-span-2 flex justify-start">
                    <span
                      className={`px-3 py-1 rounded-full text-md-label font-bold tracking-wide flex items-center gap-1.5 ${style.badgeBg} ${style.badgeText}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${style.dotBg}`}
                      ></span>{" "}
                      {field.status}
                    </span>
                  </div>

                  <div className="col-span-12 md:col-span-1 flex justify-end md:opacity-0 group-hover:opacity-100 transition-opacity mt-3 md:mt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUpdatingField(field);
                      }}
                      className={`text-md-body px-4 py-2 rounded-lg font-bold w-full md:w-auto shadow-sm ${style.btnBg}`}
                    >
                      {style.btnText}
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <div
            ref={loadMoreRef}
            className="h-4 w-full flex justify-center items-center"
          >
            {isFetchingNextPage && (
              <Loader2 className="w-5 h-5 animate-spin text-primary my-4" />
            )}
          </div>
        </div>
      </div>

      <UpdateStageModal
        isOpen={!!updatingField}
        field={updatingField}
        onClose={() => setUpdatingField(null)}
      />
      <AgentFieldDetailsModal
        isOpen={!!viewingField}
        field={viewingField}
        onClose={() => setViewingField(null)}
      />
    </div>
  );
};

export default AgentTasks;
