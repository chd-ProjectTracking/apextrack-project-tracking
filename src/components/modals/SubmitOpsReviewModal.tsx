import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { X, FileCheck2, Send } from 'lucide-react';

interface SubmitOpsReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export const SubmitOpsReviewModal: React.FC<SubmitOpsReviewModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}) => {
  const { submitForOpsReview } = useProjectContext();
  const [notes, setNotes] = useState(
    'Procurement baseline locked and site execution phase logs verified. Requesting formal Operations Review and sign-off.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    submitForOpsReview(projectId, notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Submit for Operations Review</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <p className="text-slate-600">
            You are submitting project <strong>{projectName}</strong> to Operations Manager Elena Vance for operational validation.
          </p>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Project Manager Submission Summary & Notes
            </label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail key procurement milestones met, subcontractor safety performance, and any variance justifications..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Operations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
