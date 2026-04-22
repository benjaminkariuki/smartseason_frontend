// src/components/fields/EditFieldModal.jsx
import React, { useState, useEffect } from "react";
import {
  useUpdateField,
  useActiveAgents,
} from "../../hooks/useFieldManagement";
import { X, User, ChevronDown, Loader2, Calendar } from "lucide-react";

const EditFieldModal = ({ field, isOpen, onClose }) => {
  const { mutate: updateField, isPending } = useUpdateField();
  const { data: agents, isLoading: isLoadingAgents } = useActiveAgents();

  const [formData, setFormData] = useState({
    name: "",
    crop_type: "",
    planting_date: "",
    agent_id: "",
  });

  // When the modal opens or the selected field changes, populate the form
  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name,
        crop_type: field.crop_type,
        // Ensure date string is formatted correctly for the <input type="date">
        planting_date: field.planting_date.split("T")[0],
        agent_id: field.agent_id || "",
      });
    }
  }, [field]);

  if (!isOpen || !field) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      agent_id: formData.agent_id === "" ? null : formData.agent_id,
    };

    updateField(
      { id: field.id, data: payload },
      {
        onSuccess: () => {
          onClose(); // Close the modal upon successful update
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/30 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <h3 className="text-md-headline font-bold text-on-surface">
              Edit Field Details
            </h3>
            <p className="text-md-body text-on-surface-variant mt-1">
              Update agricultural parameters for{" "}
              <span className="text-primary font-semibold">{field.name}</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-outline hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
            <p className="text-sm font-bold text-primary">Saving changes...</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 py-6 flex-1 overflow-y-auto space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-md-label text-on-surface-variant ml-1">
              Field Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface text-md-body focus:ring-2 focus:ring-primary-fixed transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-md-label text-on-surface-variant ml-1">
                Crop Type
              </label>
              <div className="relative">
                <select
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface text-md-body focus:ring-2 focus:ring-primary-fixed appearance-none font-medium"
                >
                  <option value="wheat">Wheat</option>
                  <option value="corn">Corn</option>
                  <option value="soybeans">Soybeans</option>
                  <option value="alfalfa">Alfalfa</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-md-label text-on-surface-variant ml-1">
                Planting Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="planting_date"
                  value={formData.planting_date}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface text-md-body focus:ring-2 focus:ring-primary-fixed transition-all font-medium [&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-md-label text-on-surface-variant ml-1">
              Assigned Agent
            </label>
            <div className="relative">
              <select
                name="agent_id"
                value={formData.agent_id}
                onChange={handleChange}
                disabled={isLoadingAgents}
                className="w-full bg-surface-container-highest border-none rounded-xl pl-12 pr-4 py-3 text-on-surface text-md-body focus:ring-2 focus:ring-primary-fixed appearance-none font-medium disabled:opacity-50"
              >
                <option value="">
                  {isLoadingAgents ? "Loading..." : "Unassigned"}
                </option>
                {agents?.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant w-5 h-5" />
            </div>
            <p className="text-md-body text-on-surface-variant italic mt-1 ml-1">
              Agent receives automated alerts for this sector.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 bg-surface-container-low/50 flex justify-end gap-3 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl text-md-body font-bold text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-8 py-2.5 rounded-xl text-md-body font-bold bg-primary text-on-primary shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Field Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFieldModal;
