// src/pages/admin/FieldList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useFieldsList, useDeleteField } from "../../hooks/useFieldsList";
import FieldDetailsModal from "../../components/fields/FieldDetailsModal";
import { useActiveAgents } from "../../hooks/useFieldManagement";
import EditFieldModal from "../../components/fields/EditFieldModal";
import DeleteConfirmationModal from "../../components/fields/DeleteConfirmationModal";

import { Leaf, Download, Trash2, Edit3, Eye, Loader2 } from "lucide-react";

const FieldList = () => {
  // Filter State
  const [filters, setFilters] = useState({
    stage: "All Stages",
    agent_id: "All Assignees",
    status: "All Statuses",
  });

  const [editingField, setEditingField] = useState(null);
  const [viewingField, setViewingField] = useState(null);
  const [deletingField, setDeletingField] = useState(null);

  // API Hooks
  const { data: agents } = useActiveAgents();
  const { mutate: deleteField } = useDeleteField();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFieldsList(filters);

  // Infinite Scroll Logic (Intersection Observer)
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Flatten the paginated chunks into a single array for rendering
  const fields = data ? data.pages.flatMap((page) => page.data) : [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-md-large-title font-headline text-primary mb-2">
            Active Fields
          </h1>
          <p className="text-md-body text-on-surface-variant max-w-2xl">
            Manage and monitor current agricultural operations across all
            sectors. Data synced via telemetry.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-surface-container-highest text-on-surface rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-low rounded-xl p-3 flex flex-wrap gap-3 items-center">
        <span className="text-md-label font-bold text-on-surface-variant uppercase px-2">
          Stage
        </span>
        {[
          "All Stages",
          "Preparation",
          "Planted",
          "Growing",
          "Ready",
          "Harvested",
        ].map((stage) => (
          <button
            key={stage}
            onClick={() => handleFilterChange("stage", stage)}
            className={`px-4 py-2 rounded-lg text-md-body font-semibold transition-colors ${filters.stage === stage ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            {stage}
          </button>
        ))}

        <div className="w-px h-6 bg-outline-variant/30 mx-2 hidden md:block"></div>

        <span className="text-md-label font-bold text-on-surface-variant uppercase px-2">
          Status
        </span>
        {["All Statuses", "Active", "At Risk", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange("status", status)}
            className={`px-4 py-2 rounded-lg text-md-body font-semibold transition-colors ${filters.status === status ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
          >
            {status}
          </button>
        ))}

        <div className="w-px h-6 bg-outline-variant/30 mx-2 hidden md:block"></div>

        <span className="text-md-label font-bold text-on-surface-variant uppercase px-2">
          Assignee
        </span>
        <select
          value={filters.agent_id}
          onChange={(e) => handleFilterChange("agent_id", e.target.value)}
          className="bg-surface-container-lowest text-primary rounded-lg text-md-body font-semibold shadow-sm border-none focus:ring-2 focus:ring-primary-fixed py-2 pl-4 pr-8 cursor-pointer"
        >
          <option value="All Assignees">All Assignees</option>
          {agents?.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Data List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="p-4 bg-error-container text-error rounded-lg">
          Failed to load fields.
        </div>
      ) : fields.length === 0 ? (
        <div className="p-12 text-center text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/20">
          No fields match your current filters.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-all group"
            >
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Core Info (Expanded to col-span-4 since image was removed) */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1">
                  <h3 className="text-md-headline font-bold text-primary truncate">
                    {field.name}
                  </h3>
                  <div className="flex items-center gap-2 text-md-body text-on-surface-variant capitalize">
                    <Leaf className="w-4 h-4" />
                    <span className="font-semibold">{field.crop_type}</span>
                  </div>
                </div>

                {/* Stats Column (Expanded to col-span-4) */}
                <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-md-label font-bold text-on-surface-variant uppercase mb-1">
                      Agent
                    </div>
                    <div className="text-md-body font-semibold text-on-surface truncate">
                      {field.agent?.name || "Unassigned"}
                    </div>
                  </div>
                  <div>
                    <div className="text-md-label font-bold text-on-surface-variant uppercase mb-1">
                      Planted
                    </div>
                    <div className="text-md-body font-semibold text-on-surface">
                      {new Date(field.planting_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Status Badges (Kept at col-span-2) */}
                <div className="col-span-12 md:col-span-2 flex flex-col items-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface rounded-full text-md-label font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {field.current_stage}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-md-label font-bold uppercase ${
                      field.status === "At Risk"
                        ? "bg-error-container text-error"
                        : field.status === "Completed"
                          ? "bg-surface-container text-on-surface-variant"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    {field.status}
                  </span>
                </div>

                {/* Actions: Always visible on mobile (opacity-100), hidden on desktop until hover (md:opacity-0 md:group-hover:opacity-100) */}
                <div className="col-span-12 md:col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                  <button
                    onClick={() => setDeletingField(field)}
                    className="p-2 text-error hover:bg-error-container/50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingField(field)}
                    className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  {/* Updated Details Button to be just an Icon */}
                  <button
                    onClick={() => setViewingField(field)}
                    className="px-4 py-2 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg text-md-body font-semibold transition-colors flex items-center gap-2"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" /> Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Invisible div for the Intersection Observer to target */}
          <div
            ref={loadMoreRef}
            className="h-10 w-full flex justify-center items-center"
          >
            {isFetchingNextPage && (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            )}
          </div>
        </div>
      )}

      <EditFieldModal
        isOpen={!!editingField}
        field={editingField}
        onClose={() => setEditingField(null)}
      />

      <FieldDetailsModal
        isOpen={!!viewingField}
        field={viewingField}
        onClose={() => setViewingField(null)}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingField}
        field={deletingField}
        onClose={() => setDeletingField(null)}
      />
    </div>
  );
};

export default FieldList;
