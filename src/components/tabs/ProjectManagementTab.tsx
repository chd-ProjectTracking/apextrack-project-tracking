import React, { useState } from 'react';
import { Project, ProjectMilestone, ProjectRisk } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { formatDate } from '../../utils/formatters';
import { 
  Plus, 
  Calendar, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

interface ProjectManagementTabProps {
  project: Project;
  onOpenAddMilestoneModal: () => void;
  onOpenAddRiskModal: () => void;
  onOpenSubmitOpsReviewModal: () => void;
}

export const ProjectManagementTab: React.FC<ProjectManagementTabProps> = ({
  project,
  onOpenAddMilestoneModal,
  onOpenAddRiskModal,
  onOpenSubmitOpsReviewModal,
}) => {
  const { currentRole, updateMilestone, updateRisk, hasPermission } = useProjectContext();
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');

  const milestones = project.pmSchedule.milestones;
  const risks = project.pmSchedule.risks;

  const filteredMilestones = milestones.filter(
    (m) => selectedPhaseFilter === 'all' || m.phase === selectedPhaseFilter
  );

  const canEdit = hasPermission('canManageMilestones');
  const canSubmitOps = hasPermission('canSubmitOpsReview');
  const isReadyForOpsReview =
    project.status !== 'ops_review' &&
    project.status !== 'ceo_review' &&
    project.status !== 'approved';

  return (
    <div className="space-y-6">
      {/* Top Header & Stage Transition Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Project Management & Stage Governance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Master milestone schedule, critical path tracking, and risk mitigation register.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canEdit && (
            <>
              <button
                onClick={onOpenAddMilestoneModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
              <button
                onClick={onOpenAddRiskModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Risk</span>
              </button>
            </>
          )}

          {isReadyForOpsReview && (
            <button
              onClick={onOpenSubmitOpsReviewModal}
              disabled={!canSubmitOps}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs ${
                canSubmitOps
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
              title={!canSubmitOps ? 'Requires "canSubmitOpsReview" permission in Control Panel' : 'Submit package for review'}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Submit for Operations Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Workflow handoff prompt */}
      {project.status === 'ops_review' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <span className="font-semibold">Submitted for Operations Review:</span>{' '}
              Awaiting review and validation by Operations Manager Elena Vance.
            </div>
          </div>
          <span className="font-mono text-purple-700 uppercase font-semibold text-[11px]">
            In Ops Queue
          </span>
        </div>
      )}

      {/* Milestones Schedule */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Master Schedule Milestones</h3>
            <p className="text-xs text-slate-500">Track delivery phase deadlines and critical path dependencies.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Phase:</span>
            <select
              value={selectedPhaseFilter}
              onChange={(e) => setSelectedPhaseFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Phases</option>
              <option value="Pre-construction">Pre-construction</option>
              <option value="Procurement">Procurement</option>
              <option value="Substructure">Substructure</option>
              <option value="Superstructure">Superstructure</option>
              <option value="MEP & Systems">MEP & Systems</option>
              <option value="Commissioning">Commissioning</option>
              <option value="Handover">Handover</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Milestone Title / Phase</th>
                <th className="py-2.5 px-3 font-semibold">Target Deadline</th>
                <th className="py-2.5 px-3 font-semibold">Critical Path</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Progress</th>
                {canEdit && <th className="py-2.5 px-3 font-semibold text-right">Quick Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMilestones.map((m) => {
                return (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{m.title}</div>
                      <div className="text-slate-500 text-[11px]">{m.phase}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {formatDate(m.targetDate)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {m.criticalPath ? (
                        <span className="text-rose-700 font-semibold text-[11px]">
                          Critical Path
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold ${
                          m.status === 'completed'
                            ? 'text-emerald-700'
                            : m.status === 'in_progress'
                            ? 'text-blue-700'
                            : m.status === 'delayed'
                            ? 'text-rose-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {m.status === 'completed' && 'Completed'}
                        {m.status === 'in_progress' && 'In Progress'}
                        {m.status === 'delayed' && 'Delayed'}
                        {m.status === 'pending' && 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${m.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums text-slate-700 text-[11px]">
                          {m.progressPercentage}%
                        </span>
                      </div>
                    </td>
                    {canEdit && (
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {m.status !== 'completed' ? (
                          <button
                            onClick={() =>
                              updateMilestone(project.id, m.id, {
                                status: 'completed',
                                progressPercentage: 100,
                                actualDate: new Date().toISOString().split('T')[0],
                              })
                            }
                            className="px-2 py-1 text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-200 cursor-pointer"
                          >
                            Mark Complete
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateMilestone(project.id, m.id, {
                                status: 'in_progress',
                                progressPercentage: 80,
                              })
                            }
                            className="px-2 py-1 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 rounded border border-slate-200 cursor-pointer"
                          >
                            Re-open
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Register */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Project Risk Register
            </h3>
            <p className="text-xs text-slate-500">
              Active risks tracked for operations feasibility and executive awareness.
            </p>
          </div>
        </div>

        {risks.length === 0 ? (
          <div className="text-xs text-slate-400 py-4 text-center">
            No risks logged. Use "Log Risk" button to register potential project hazards.
          </div>
        ) : (
          <div className="space-y-3">
            {risks.map((risk) => {
              return (
                <div
                  key={risk.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-[11px] ${
                          risk.severity === 'Critical' || risk.severity === 'High'
                            ? 'text-rose-700'
                            : risk.severity === 'Medium'
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        [{risk.severity} Severity]
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-slate-700">{risk.category}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">Owner: {risk.owner}</span>
                    </div>

                    <p className="font-medium text-slate-900">{risk.description}</p>
                    <p className="text-slate-600 mt-1">
                      <strong className="text-slate-700">Mitigation:</strong> {risk.mitigationPlan}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-semibold text-xs ${
                        risk.status === 'Mitigated' || risk.status === 'Closed'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {risk.status}
                    </span>
                    {canEdit && (
                      <button
                        onClick={() =>
                          updateRisk(project.id, risk.id, {
                            status: risk.status === 'Open' ? 'Mitigated' : 'Open',
                          })
                        }
                        className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
