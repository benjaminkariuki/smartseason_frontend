// src/pages/admin/AddField.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useActiveAgents,
  useCreateField,
} from "../../hooks/useFieldManagement";
import { ChevronDown, Calendar, UserPlus, Milestone } from "lucide-react";

const AddField = () => {
  const navigate = useNavigate();
  const { data: agents, isLoading: isLoadingAgents } = useActiveAgents();
  const { mutate: createField, isPending, isError, error } = useCreateField();

  // Form State updated with the new 'stage' property
  const [formData, setFormData] = useState({
    name: "",
    crop_type: "",
    planting_date: "",
    current_stage: "preparation", // Default to the newly created status
    agent_id: "",
  });

  // Inline notification shown at top of the card (success / error)
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: string }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      agent_id: formData.agent_id === "" ? null : formData.agent_id,
    };

    // Use mutation callbacks to show inline notifications instead of navigating
    createField(payload, {
      onSuccess: (data) => {
        // Reset form and show success message
        setFormData({
          name: "",
          crop_type: "",
          planting_date: "",
          current_stage: "preparation",
          agent_id: "",
        });
        setNotification({
          type: "success",
          message: `Field "${data?.name || payload.name}" added successfully.`,
        });
        // clear after a few seconds
        setTimeout(() => setNotification(null), 4000);
      },
      onError: (err) => {
        setNotification({
          type: "error",
          message:
            err?.response?.data?.message ||
            "Failed to create field. Please try again.",
        });
        setTimeout(() => setNotification(null), 6000);
      },
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center relative min-h-[calc(100vh-80px)]">
      <div className="relative z-10 w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-sm p-8 md:p-10 flex flex-col gap-8 border border-outline-variant/20">
        <div className="text-center">
          <h2 className="text-md-large-title text-on-surface mb-2">
            Register New Field
          </h2>
          <p className="text-md-body text-on-surface-variant">
            Define parameters for tracking crop lifecycle and assigning field
            operations.
          </p>
        </div>

        {/* Notification banner (success / error) shown after submission */}
        {notification ? (
          <div
            className={`mb-4 p-3 rounded-lg text-md-body font-medium text-center ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-error-container text-on-error-container border border-error/20"}`}
          >
            {notification.message}
          </div>
        ) : isError ? (
          <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg text-md-body font-medium border border-error/20">
            {error?.response?.data?.message ||
              "Failed to create field. Please try again."}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Field Name */}
          <div className="flex flex-col gap-2">
            <label className="text-md-label text-on-surface" htmlFor="name">
              Field Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-surface-container-highest text-on-surface rounded-md px-4 py-3 border-none focus:ring-2 focus:ring-primary-fixed outline-none transition-shadow placeholder:text-on-surface-variant/50"
              placeholder="e.g., North Acre Parcel"
            />
          </div>

          {/* Layout Row 1: Crop & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                className="text-md-label text-on-surface"
                htmlFor="crop_type"
              >
                Crop Type
              </label>
              <div className="relative">
                <select
                  id="crop_type"
                  name="crop_type"
                  required
                  value={formData.crop_type}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest text-on-surface rounded-md pl-4 pr-10 py-3 border-none focus:ring-2 focus:ring-primary-fixed outline-none appearance-none transition-shadow"
                >
                  <option disabled value="">
                    Select primary crop...
                  </option>
                  <option value="wheat">Wheat</option>
                  <option value="corn">Corn</option>
                  <option value="soybeans">Soybeans</option>
                  <option value="alfalfa">Alfalfa</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-md-label text-on-surface"
                htmlFor="planting_date"
              >
                Estimated Planting Date
              </label>
              <div className="relative">
                <input
                  id="planting_date"
                  name="planting_date"
                  type="date"
                  required
                  value={formData.planting_date}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest text-on-surface rounded-md px-4 py-3 border-none focus:ring-2 focus:ring-primary-fixed outline-none transition-shadow [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Layout Row 2: Stage & Agent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Stage */}
            <div className="flex flex-col gap-2">
              <label className="text-md-label text-on-surface" htmlFor="current_stage">
                Current Stage
              </label>
              <div className="relative">
                <select
                  id="current_stage"
                  name="current_stage"
                  required
                  value={formData.current_stage}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest text-on-surface rounded-md pl-12 pr-10 py-3 border-none focus:ring-2 focus:ring-primary-fixed outline-none appearance-none transition-shadow"
                >
                  <option value="preparation">
                    Preparation (Newly Created)
                  </option>
                  <option value="planted">Planted</option>
                  <option value="growing">Growing</option>
                  <option value="ready">Ready</option>
                  <option value="harvested">Harvested</option>
                </select>
                <Milestone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Assign Agent */}
            <div className="flex flex-col gap-2">
              <label
                className="text-md-label text-on-surface"
                htmlFor="agent_id"
              >
                Assign Field Agent
              </label>
              <div className="relative">
                <select
                  id="agent_id"
                  name="agent_id"
                  value={formData.agent_id}
                  onChange={handleChange}
                  disabled={isLoadingAgents}
                  className="w-full bg-surface-container-highest text-on-surface rounded-md pl-12 pr-10 py-3 border-none focus:ring-2 focus:ring-primary-fixed outline-none appearance-none transition-shadow disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingAgents ? "Loading agents..." : "Leave unassigned"}
                  </option>
                  {agents?.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 md:gap-4 mt-8 pt-6 border-t border-surface-container-high">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="w-full md:w-auto text-on-surface font-medium px-6 py-3 rounded-lg border border-outline hover:bg-surface-container-highest transition-colors text-md-body"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`w-full md:w-auto bg-primary text-on-primary font-medium px-6 py-3 rounded-lg transition-opacity text-md-body shadow-sm flex justify-center items-center gap-2 ${isPending ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-on-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating</span>
                </div>
              ) : (
                "Create Field"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddField;
