import React, { useState } from "react";
import { useAddAgent } from "../../hooks/useUserManagement";
import {
  X,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";

const AddUserModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { mutate: addAgent, isPending } = useAddAgent();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    addAgent(formData, {
      onSuccess: () => {
        setFormData({ name: "", email: "", password: "" });
        onClose();
      },
      onError: (err) => {
        setError(err.response?.data?.message || "Failed to create user.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-surface-container-lowest border-b border-outline-variant/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary tracking-tight font-headline">
            Add New Field Agent
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-error-container text-error text-sm font-bold rounded-lg border border-error/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary-fixed"
                placeholder="e.g. David Chen"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-surface-container-highest border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary-fixed"
                placeholder="david@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Initial Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-16 py-3 bg-surface-container-highest border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary-fixed"
                placeholder="Minimum 8 characters"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="p-1 rounded-md text-on-surface-variant hover:text-on-surface"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        formData.password || "",
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch (e) {
                      // ignore
                    }
                  }}
                  className="p-1 rounded-md text-on-surface-variant hover:text-on-surface"
                  aria-label="Copy password"
                >
                  <Copy className="w-5 h-5" />
                </button>
                {copied && (
                  <span className="ml-1 text-xs text-primary font-bold">
                    Copied
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/20 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
