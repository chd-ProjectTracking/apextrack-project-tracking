import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { ProjectMilestone } from '../../types/project';
import { X, Calendar } from 'lucide-react';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({ isOpen, onClose, projectId }) => {
  const { addMilestone } = useProjectContext();

  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState<ProjectMilestone['phase']>('Superstructure');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [criticalPath, setCriticalPath] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMilestone(projectId, {
      title: title.trim(),
      phase,
      targetDate,
      criticalPath,
      progressPercentage: Number(progressPercentage),
      status: Number(progressPercentage) === 100 ? 'completed' : Number(progressPercentage) > 0 ? 'in_progress' : 'pending',
      assignedRole: 'project_manager',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Add Schedule Milestone</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Milestone Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Structural Steel Topping Out"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Pre-construction">Pre-construction</option>
                <option value="Procurement">Procurement</option>
                <option value="Substructure">Substructure</option>
                <option value="Superstructure">Superstructure</option>
                <option value="MEP & Systems">MEP & Systems</option>
                <option value="Commissioning">Commissioning</option>
                <option value="Handover">Handover</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Date</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Initial Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={(e) => setProgressPercentage(Number(e.target.value))}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criticalPath}
                  onChange={(e) => setCriticalPath(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-slate-700">Critical Path Task</span>
              </label>
            </div>
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
              className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs cursor-pointer"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
