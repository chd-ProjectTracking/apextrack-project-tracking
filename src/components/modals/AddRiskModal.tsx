import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { ProjectRisk } from '../../types/project';
import { X, ShieldAlert } from 'lucide-react';

interface AddRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const AddRiskModal: React.FC<AddRiskModalProps> = ({ isOpen, onClose, projectId }) => {
  const { addRisk, currentRole } = useProjectContext();

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectRisk['category']>('Site Execution');
  const [severity, setSeverity] = useState<ProjectRisk['severity']>('Medium');
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [owner, setOwner] = useState('Tariq Mansoor');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !mitigationPlan.trim()) return;

    addRisk(projectId, {
      description: description.trim(),
      category,
      severity,
      mitigationPlan: mitigationPlan.trim(),
      owner: owner.trim(),
      status: 'Open',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Log Project Risk</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Risk Description</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Italian marble slab delivery facing customs inspection backlog at Jebel Ali..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Procurement & Supply Chain">Procurement & Supply Chain</option>
                <option value="Site Execution">Site Execution</option>
                <option value="Financial & Budget">Financial & Budget</option>
                <option value="Weather & Environmental">Weather & Environmental</option>
                <option value="Regulatory">Regulatory & Municipal</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Risk Owner</label>
            <input
              type="text"
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mitigation Plan</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Pre-cleared import documents through Dubai Customs fast-track broker..."
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
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
              className="px-4 py-1.5 font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-xs cursor-pointer"
            >
              Log Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
