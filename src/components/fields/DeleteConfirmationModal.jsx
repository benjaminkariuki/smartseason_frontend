// src/components/fields/DeleteConfirmationModal.jsx
import React from "react";
import { useDeleteField } from "../../hooks/useFieldsList";
import { AlertTriangle, Loader2 } from "lucide-react";

const DeleteConfirmationModal = ({ field, isOpen, onClose }) => {
  const { mutate: deleteField, isPending } = useDeleteField();

  if (!isOpen || !field) return null;

  const handleDelete = () => {
    deleteField(field.id, {
      onSuccess: () => {
        onClose(); // Close modal instantly when deletion is complete
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-inverse-surface/10 backdrop-blur-sm">
      {/* Modal Card */}
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-xl overflow-hidden relative">
        {/* Loading State Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-error mb-2" />
            <p className="text-md-body font-bold text-error">
              Deleting field...
            </p>
          </div>
        )}

        {/* Modal Header / Icon */}
        <div className="bg-error-container/20 p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-error-container flex items-center justify-center rounded-full mb-6">
            <AlertTriangle className="text-error w-8 h-8" />
          </div>
          <h2 className="text-md-headline font-extrabold text-on-surface font-headline">
            Delete Field?
          </h2>
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-4 text-center">
          <p className="text-md-body text-on-surface-variant leading-relaxed">
            Are you sure you want to delete this field? This action cannot be
            undone. All historical data, harvest logs, and soil mapping
            associated with{" "}
            <span className="font-bold text-on-surface">{field.name}</span> will
            be permanently removed.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-6 py-4 bg-surface-container-high text-on-surface-variant font-bold text-md-body rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95 duration-150 order-2 sm:order-1 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 px-6 py-4 bg-error text-on-error font-bold text-md-body rounded-xl hover:opacity-90 transition-all shadow-sm active:scale-95 duration-150 order-1 sm:order-2 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
