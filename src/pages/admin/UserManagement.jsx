// src/pages/admin/UserManagement.jsx
import React, { useState } from "react";
import {
  useAllUsers,
  useUpdateAgentStatus,
} from "../../hooks/useUserManagement";
import AddUserModal from "../../components/admin/AddUserModal";
import {
  Search,
  Download,
  UserPlus,
  MoreVertical,
  Loader2,
  ShieldCheck,
  Tractor,
} from "lucide-react";

const UserManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Track which toggle is currently spinning
  const [togglingId, setTogglingId] = useState(null);

  const { data: agents, isLoading, isError } = useAllUsers();
  const { mutate: updateStatus } = useUpdateAgentStatus();

  const handleToggleStatus = (userId, currentStatus) => {
    setTogglingId(userId); // Lock the UI for this specific row

    updateStatus(
      { userId, is_active: !currentStatus },
      {
        // onSettled runs whether the API call succeeds or fails,
        // ensuring the toggle always unlocks!
        onSettled: () => setTogglingId(null),
      },
    );
  };

  // Basic client-side filtering for the search bar
  const filteredAgents =
    agents?.filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-2 font-display">
            User Management
          </h2>
          <p className="text-on-surface-variant text-base">
            Manage platform access, roles, and user status.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-low text-on-surface font-semibold py-2.5 px-5 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-on-primary font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Add New User
          </button>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary-fixed focus:outline-none transition-shadow text-on-surface"
          />
        </div>
        <div className="text-sm font-bold text-on-surface-variant bg-surface-container px-4 py-2 rounded-lg">
          Total Users: {agents?.length || 0}
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant w-1/3">
                  User
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Role
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Date Added
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Status
                </th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/10">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-error font-bold"
                  >
                    Failed to load users.
                  </td>
                </tr>
              ) : filteredAgents.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-on-surface-variant font-bold"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  const isToggling = togglingId === agent.id;

                  // 1. STRICT BOOLEAN PARSING: Forces 0, "0", false into a true JavaScript boolean
                  const isActive =
                    agent.is_active === true ||
                    agent.is_active === 1 ||
                    String(agent.is_active) === "1";

                  return (
                    <tr
                      key={agent.id}
                      className={`hover:bg-surface-container-high transition-colors group ${!isActive && !isToggling ? "opacity-60 hover:opacity-100" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 flex-shrink-0 flex items-center justify-center font-bold ${agent.role === "admin" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"}`}
                          >
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-on-surface text-sm">
                              {agent.name}
                            </div>
                            <div className="text-xs text-on-surface-variant font-medium mt-0.5">
                              {agent.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs font-bold border capitalize ${agent.role === "admin" ? "bg-secondary-container text-on-secondary-container border-secondary/20" : "bg-surface-container-low text-on-surface border-outline-variant/30"}`}
                        >
                          {agent.role === "admin" ? (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Tractor className="w-3.5 h-3.5" />
                          )}
                          {agent.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-sm font-bold text-on-surface-variant">
                        {new Date(agent.created_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <label
                          className={`relative inline-flex items-center ${isToggling ? "cursor-wait opacity-70" : "cursor-pointer"}`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={agent.is_active}
                            onChange={() =>
                              handleToggleStatus(agent.id, agent.is_active)
                            }
                            disabled={isToggling}
                          />

                          {/* FIX: Changed bg-error/80 to bg-error. 
      It is now a solid red when false, and peer-checked:bg-primary turns it green when true! */}
                          <div className="w-11 h-6 bg-error rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-transparent after:shadow-sm after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>

                          <span className="ml-3 text-sm font-bold w-20 flex items-center gap-1.5">
                            {isToggling ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin text-outline" />
                                <span className="text-outline">Saving</span>
                              </>
                            ) : (
                              <span
                                className={
                                  agent.is_active
                                    ? "text-primary"
                                    : "text-error"
                                }
                              >
                                {agent.is_active ? "Active" : "Inactive"}
                              </span>
                            )}
                          </span>
                        </label>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button className="text-outline hover:text-primary p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;
