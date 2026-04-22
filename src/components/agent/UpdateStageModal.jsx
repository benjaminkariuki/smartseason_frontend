// src/components/agent/UpdateStageModal.jsx
import React, { useState, useEffect } from "react";
import { useUpdateFieldStage } from "../../hooks/useAgentDashboard";
import { X, Loader2, CheckCircle2, Circle } from "lucide-react";

const UpdateStageModal = ({ field, isOpen, onClose }) => {
  const [selectedStage, setSelectedStage] = useState("");
  const [notes, setNotes] = useState("");
  const { mutate: updateStage, isPending } = useUpdateFieldStage();

  // Reset state when modal opens for a new field
  useEffect(() => {
    if (field) {
      setSelectedStage(field.current_stage || "");
      setNotes("");
    }
  }, [field, isOpen]);

  if (!isOpen || !field) return null;

  const handleUpdate = () => {
    updateStage(
      { id: field.id, stage: selectedStage, notes: notes },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  // Helper array to render the radio cards cleanly
  const stages = [
    {
      id: "preparation",
      label: "Preparation",
      desc: "Pre-planting soil work.",
    },
    { id: "planted", label: "Planted", desc: "Seeds sown, pre-emergence." },
    { id: "growing", label: "Growing", desc: "Active vegetative development." },
    { id: "ready", label: "Ready", desc: "Optimal state for harvest." },
    {
      id: "harvested",
      label: "Harvested",
      desc: "Post-harvest, resting phase.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-surface-container-high/80 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-outline-variant/20 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 pb-4 bg-surface sticky top-0 z-10">
          <div>
            <h2 className="text-md-headline font-bold text-on-surface tracking-tight font-headline">
              Update Stage: {field.name}
            </h2>
            <p className="text-md-body text-on-surface-variant mt-1 font-medium">
              Record current growth phase and observations.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-fixed disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 md:p-8 pt-0 space-y-8 overflow-y-auto">
          {/* Stage Selection Grid */}
          <fieldset>
            <legend className="text-md-label font-bold text-on-surface tracking-wide uppercase mb-4">
              Stage Selection
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stages.map((stage) => {
                const isSelected = selectedStage === stage.id;
                return (
                  <label
                    key={stage.id}
                    className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm transition-all duration-200
                                            ${
                                              isSelected
                                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary"
                                                : "border-outline-variant/20 bg-surface-container-lowest hover:bg-surface-container-low"
                                            }`}
                  >
                    <input
                      type="radio"
                      name="field-stage"
                      value={stage.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <p
                          className={`text-md-headline font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}
                        >
                          {stage.label}
                        </p>
                        <div className="text-md-body text-on-surface-variant mt-0.5 font-medium">
                          {stage.desc}
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="text-primary w-5 h-5 fill-primary/20" />
                      ) : (
                        <Circle className="text-outline-variant w-5 h-5" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Note Field */}
          <div>
            <label
              className="block text-md-label font-bold text-on-surface tracking-wide uppercase mb-2"
              htmlFor="observations"
            >
              Observations / Notes (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="observations"
                name="observations"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any notable conditions, pest sightings, or weather impacts..."
                className="block w-full rounded-xl border-0 bg-surface-container-highest py-3 px-4 text-on-surface shadow-sm ring-1 ring-inset ring-outline-variant/30 focus:ring-2 focus:ring-inset focus:ring-primary-fixed sm:text-sm transition-all placeholder:text-outline-variant/70 font-medium resize-none"
              ></textarea>
            </div>
            <p className="mt-2 text-md-label font-medium text-on-surface-variant">
              These notes will be appended to the field's seasonal history log.
            </p>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="bg-surface-container-low px-6 py-4 md:px-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-lg px-6 py-3 text-md-body font-bold text-on-surface-variant bg-transparent hover:bg-surface-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-outline transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={
              isPending ||
              (selectedStage === field.current_stage && notes.trim() === "")
            } // Disable if nothing changed
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg px-8 py-3 text-md-body font-bold text-on-primary bg-primary shadow-sm hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-fixed transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStageModal;
