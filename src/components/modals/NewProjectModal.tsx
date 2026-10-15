import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { Project } from '../../types/project';
import { X, Building2 } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProjectContext();

  const [code, setCode] = useState(`PRJ-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<Project['category']>('Commercial');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('2027-06-30');
  const [budget, setBudget] = useState(12000000);
  const [currency, setCurrency] = useState('USD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !client.trim()) {
      alert('Please enter a project name and client.');
      return;
    }

    createProject({
      code,
      name: name.trim(),
      client: client.trim(),
      location: location.trim() || 'Central Region',
      category,
      description: description.trim() || 'Enterprise capital construction and engineering project.',
      startDate,
      targetCompletionDate: targetDate,
      budgetAllocated: Number(budget) || 1000000,
      currency,
      status: 'data_entry',
      overallProgress: 0,
      assignedTeam: {
        procurementLead: 'Ayesha Khan',
        siteSupervisor: 'Marco Rossi',
        projectManager: 'David Chen, PMP',
        operationsManager: 'Elena Vance',
        ceoReviewer: 'Robert Sterling',
      },
      procurement: {
        items: [],
        notes: 'Initial procurement baseline initialized.',
        lastUpdated: startDate,
      },
      siteSupervision: {
        dailyLogs: [],
        currentPhysicalProgress: 0,
        safetyIncidentsYTD: 0,
        lastUpdated: startDate,
      },
      pmSchedule: {
        milestones: [
          {
            id: 'ms-init-1',
            title: 'Initial Mobilization & Site Layout',
            phase: 'Pre-construction',
            targetDate: startDate,
            status: 'in_progress',
            progressPercentage: 20,
            assignedRole: 'site_supervisor',
            criticalPath: true,
          },
        ],
        risks: [],
        criticalPathNotes: 'Establishing procurement lead times for long-lead critical items.',
        lastUpdated: startDate,
      },
      operationsReview: {
        status: 'pending',
        checklist: {
          procurementFeasibility: false,
          siteReadiness: false,
          resourceAllocationChecked: false,
          complianceVerified: false,
        },
        operationalNotes: 'Awaiting team data input before operations sign-off.',
      },
      ceoReview: {
        status: 'pending',
        budgetReleased: false,
        executiveDirectives: 'Awaiting Operations review validation.',
        roiProjectedMarginPct: 18.0,
      },
      media: {
        photos: [],
        videoWalkthroughs: [],
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Initialize New Project</h3>
              <p className="text-xs text-slate-500">Create project record for team data entry and review workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Commercial">Commercial</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Industrial">Industrial</option>
                <option value="Residential">Residential</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Bay Horizon Logistics Center"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Client Organization</label>
              <input
                type="text"
                required
                placeholder="e.g. Pacific Logistics REIT"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Site Location</label>
              <input
                type="text"
                placeholder="e.g. Sector 8 Industrial Zone"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Capex Budget</label>
              <input
                type="number"
                min="0"
                step="50000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Handover</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Scope Description</label>
            <textarea
              rows={3}
              placeholder="Detailed description of works, milestones, and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
