import React, { useState } from 'react';
import { Project } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Send, 
  UserCheck, 
  RotateCcw,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface OperationsReviewTabProps {
  project: Project;
}

export const OperationsReviewTab: React.FC<OperationsReviewTabProps> = ({ project }) => {
  const { currentRole, setCurrentRole, submitOperationsDecision, hasPermission } = useProjectContext();

  const [notes, setNotes] = useState(project.operationsReview.operationalNotes || '');
  const [checklist, setChecklist] = useState({
    procurementFeasibility: project.operationsReview.checklist.procurementFeasibility ?? true,
    siteReadiness: project.operationsReview.checklist.siteReadiness ?? true,
    resourceAllocationChecked: project.operationsReview.checklist.resourceAllocationChecked ?? false,
    complianceVerified: project.operationsReview.checklist.complianceVerified ?? false,
  });

  const isOpsRole = hasPermission('canApproveOpsReview') || currentRole === 'operations_manager';
  const isApproved = project.operationsReview.status === 'approved';
  const isPending = project.status === 'ops_review';

  const handleApprove = () => {
    if (!notes.trim()) {
      alert('Please enter your operational review evaluation notes before signing off.');
      return;
    }
    submitOperationsDecision(project.id, 'approved', notes, checklist);
  };

  const handleRequestRevision = () => {
    if (!notes.trim()) {
      alert('Please detail the required revisions or punchlist items.');
      return;
    }
    submitOperationsDecision(project.id, 'revision_required', notes, checklist);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Operations Manager Operational Review</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-functional operational validation prior to CEO executive sign-off and capital allocation.
          </p>
        </div>

        {!isOpsRole && (
          <button
            onClick={() => setCurrentRole('operations_manager')}
            className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors cursor-pointer"
          >
            Switch to Operations Manager Persona →
          </button>
        )}
      </div>

      {/* Status banner */}
      {isApproved ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900">Operations Review Signed Off & Approved</span>
              <p className="text-emerald-700 mt-0.5">
                Reviewed by {project.operationsReview.reviewedBy || 'Elena Vance'} on{' '}
                {formatDateTime(project.operationsReview.reviewedAt || '')}. Project forwarded to CEO for executive sign-off.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
            Ops Validated
          </span>
        </div>
      ) : project.status === 'ops_review' ? (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-purple-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-purple-900">Action Required: Operations Review Pending</span>
            <p className="text-purple-700 mt-0.5">
              Project Manager submitted this project for your operational sign-off. Review the checklist below and grant approval or request revisions.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
          <strong>Review Stage Status:</strong> {project.status.replace('_', ' ').toUpperCase()}.{' '}
          {project.operationsReview.operationalNotes ? `Latest note: "${project.operationsReview.operationalNotes}"` : 'Pending review submission.'}
        </div>
      )}

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Operational Audit Checklist */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            Operations Feasibility & Compliance Checklist
          </h3>
          <p className="text-xs text-slate-500">
            Verify key operational parameters before advancing the project to CEO executive approval.
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                disabled={!isOpsRole}
                checked={checklist.procurementFeasibility}
                onChange={(e) =>
                  setChecklist({ ...checklist, procurementFeasibility: e.target.checked })
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">
                  Procurement Feasibility & Lead Times
                </span>
                <span className="text-slate-500">
                  Confirmed material delivery schedules align with construction sequence.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                disabled={!isOpsRole}
                checked={checklist.siteReadiness}
                onChange={(e) =>
                  setChecklist({ ...checklist, siteReadiness: e.target.checked })
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">
                  Site Execution & Subcontractor Staffing
                </span>
                <span className="text-slate-500">
                  Adequate skilled manpower roster and heavy equipment mobilization confirmed on site.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                disabled={!isOpsRole}
                checked={checklist.resourceAllocationChecked}
                onChange={(e) =>
                  setChecklist({ ...checklist, resourceAllocationChecked: e.target.checked })
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">
                  Cross-Project Resource Conflicts
                </span>
                <span className="text-slate-500">
                  Verified no equipment or key specialist scheduling conflicts with parallel portfolio projects.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                disabled={!isOpsRole}
                checked={checklist.complianceVerified}
                onChange={(e) =>
                  setChecklist({ ...checklist, complianceVerified: e.target.checked })
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block">
                  Safety & Regulatory Compliance
                </span>
                <span className="text-slate-500">
                  Zero critical safety violations, valid municipal building permits, and insurance certificates verified.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right: Operational Assessment Form & Decision */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Operations Manager Review Evaluation & Comments
            </h3>
            <p className="text-xs text-slate-500">
              Document your review rationale, operational recommendations, or required revisions.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Operational Evaluation Notes
              </label>
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!isOpsRole}
                placeholder="Enter detailed operational evaluation, e.g., All subcontractor rosters verified; steel cost variance is manageable within contingency. Recommending for CEO sign-off..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-purple-500 focus:bg-white text-slate-900 leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {isOpsRole ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleApprove}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-600 rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Escalate to CEO</span>
                </button>

                <button
                  onClick={handleRequestRevision}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Revisions</span>
                </button>
              </div>
            ) : (
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
                You are viewing as <strong className="text-slate-800">{currentRole.replace('_', ' ')}</strong>. Switch to <strong>Operations Manager</strong> in the top bar to submit official approval or revision requests.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
