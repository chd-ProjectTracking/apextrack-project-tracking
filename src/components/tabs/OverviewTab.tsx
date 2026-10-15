import React from 'react';
import { Project } from '../../types/project';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HardHat, 
  Users,
  Shield,
  FileCheck
} from 'lucide-react';

interface OverviewTabProps {
  project: Project;
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ project, onNavigateTab }) => {
  const totalProcurementEstimated = project.procurement.items.reduce((acc, i) => acc + i.estimatedTotal, 0);
  const totalProcurementActual = project.procurement.items.reduce((acc, i) => acc + i.actualTotal, 0);
  const totalProcurementVariance = totalProcurementActual - totalProcurementEstimated;

  const totalMilestones = project.pmSchedule.milestones.length;
  const completedMilestones = project.pmSchedule.milestones.filter((m) => m.status === 'completed').length;
  const openRisks = project.pmSchedule.risks.filter((r) => r.status === 'Open').length;

  const latestLog = project.siteSupervision.dailyLogs[0];

  // Stage progress definition
  const steps = [
    {
      id: 'procurement',
      title: 'Procurement Estimation',
      desc: `${project.procurement.items.length} items estimated`,
      isDone: project.procurement.items.length > 0,
      isActive: project.status === 'data_entry',
    },
    {
      id: 'site',
      title: 'Site Supervision',
      desc: `${project.siteSupervision.dailyLogs.length} logs · ${project.siteSupervision.currentPhysicalProgress}% physical`,
      isDone: project.siteSupervision.dailyLogs.length > 0,
      isActive: project.status === 'site_active',
    },
    {
      id: 'pm',
      title: 'Project Management',
      desc: `${completedMilestones}/${totalMilestones} milestones complete`,
      isDone: completedMilestones > 0,
      isActive: project.status === 'site_active' || project.status === 'ops_review',
    },
    {
      id: 'operations',
      title: 'Operations Review',
      desc: project.operationsReview.status === 'approved' 
        ? 'Signed off by Ops' 
        : project.status === 'ops_review' 
        ? 'Review in progress' 
        : 'Pending PM submission',
      isDone: project.operationsReview.status === 'approved',
      isActive: project.status === 'ops_review',
    },
    {
      id: 'ceo',
      title: 'CEO Sign-Off',
      desc: project.ceoReview.status === 'approved'
        ? 'Executive Greenlight'
        : project.status === 'ceo_review'
        ? 'Executive review pending'
        : 'Pending Ops approval',
      isDone: project.ceoReview.status === 'approved',
      isActive: project.status === 'ceo_review',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4-Column Key Performance Indicator Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Allocated Budget</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(project.budgetAllocated, project.currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>Committed:</span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {formatCurrency(totalProcurementActual, project.currency)}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Procurement Variance</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div
            className={`text-xl font-bold font-mono tabular-nums ${
              totalProcurementVariance > 0
                ? 'text-rose-600'
                : totalProcurementVariance < 0
                ? 'text-emerald-600'
                : 'text-slate-900'
            }`}
          >
            {totalProcurementVariance > 0 ? '+' : ''}
            {formatCurrency(totalProcurementVariance, project.currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {totalProcurementVariance > 0 ? 'Over estimated baseline' : 'Under budget / Savings'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Overall Progress</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {project.overallProgress}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${project.overallProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Safety & Risk Posture</span>
            <Shield className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {project.siteSupervision.safetyIncidentsYTD} Incidents
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Open Risks:</span>
            <span className={`font-mono tabular-nums font-semibold ${openRisks > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {openRisks} active
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Tier Review Lifecycle Tracker */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Multi-Tier Delivery & Review Pipeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks the required handoff from data authors (Procurement, Site, PM) to executive reviewers (Operations, CEO).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Current Stage: <strong className="text-slate-800 uppercase">{project.status.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((st, idx) => {
            return (
              <div
                key={st.id}
                onClick={() => onNavigateTab(st.id)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  st.isActive
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                    : st.isDone
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-slate-50/40 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-500">
                    0{idx + 1}. Stage
                  </span>
                  {st.isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : st.isActive ? (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-900 truncate">{st.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-tight line-clamp-2">{st.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Grid: Project Specs & Live Snapshots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Scope & Latest Operations / CEO Directives */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Project Scope & Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">{project.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block mb-0.5">Client</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {project.client}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Location</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {project.location}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Schedule Target</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(project.startDate)} – {formatDate(project.targetCompletionDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Executive Directives Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-600" />
                Review & Sign-Off Directives
              </h3>
              <button
                onClick={() => onNavigateTab('comments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                View Discussion Thread →
              </button>
            </div>

            {/* Operations Manager State */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Operations Manager Assessment</span>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    project.operationsReview.status === 'approved'
                      ? 'text-emerald-700'
                      : project.operationsReview.status === 'revision_required'
                      ? 'text-rose-700'
                      : 'text-amber-700'
                  }`}
                >
                  {project.operationsReview.status === 'approved'
                    ? 'VERIFIED & APPROVED'
                    : project.operationsReview.status === 'revision_required'
                    ? 'REVISIONS PUNCHLIST REQUIRED'
                    : 'AWAITING OPS REVIEW'}
                </span>
              </div>
              <p className="text-xs text-slate-600 italic">
                "{project.operationsReview.operationalNotes || 'No operational comments entered yet.'}"
              </p>
            </div>

            {/* CEO Review State */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">CEO Executive Decision</span>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    project.ceoReview.status === 'approved'
                      ? 'text-emerald-700'
                      : project.ceoReview.status === 'revision_required'
                      ? 'text-rose-700'
                      : 'text-slate-500'
                  }`}
                >
                  {project.ceoReview.status === 'approved'
                    ? 'GREENLIT & BUDGET RELEASED'
                    : project.ceoReview.status === 'on_hold'
                    ? 'PROJECT ON HOLD'
                    : 'AWAITING CEO SIGN-OFF'}
                </span>
              </div>
              <p className="text-xs text-slate-600 italic">
                "{project.ceoReview.executiveDirectives || 'Awaiting executive decision and directives.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 col: Team Matrix & Latest Site Pulse */}
        <div className="space-y-6">
          {/* Team Roles Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              Assigned Project Leadership
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Procurement Lead</span>
                <span className="font-semibold text-slate-800">{project.assignedTeam.procurementLead}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Site Supervisor</span>
                <span className="font-semibold text-slate-800">{project.assignedTeam.siteSupervisor}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Project Manager</span>
                <span className="font-semibold text-slate-800">{project.assignedTeam.projectManager}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Operations Reviewer</span>
                <span className="font-semibold text-slate-800">{project.assignedTeam.operationsManager}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">CEO Sign-off</span>
                <span className="font-semibold text-slate-800">{project.assignedTeam.ceoReviewer}</span>
              </div>
            </div>
          </div>

          {/* Latest Daily Site Log Snapshot */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-600" />
                Latest Site Log
              </h3>
              {latestLog && (
                <span className="text-[11px] font-mono text-slate-500">{formatDate(latestLog.logDate)}</span>
              )}
            </div>

            {latestLog ? (
              <div className="space-y-2 text-xs">
                <p className="text-slate-700 line-clamp-3">{latestLog.workCompleted}</p>
                <div className="flex items-center gap-2 text-slate-500 pt-2 border-t border-slate-100">
                  <span>Shift: {latestLog.shift}</span>
                  <span>·</span>
                  <span>
                    Labor:{' '}
                    {latestLog.labor.skilled +
                      latestLog.labor.unskilled +
                      latestLog.labor.supervisors +
                      latestLog.labor.subcontractors}{' '}
                    on-site
                  </span>
                </div>
                <button
                  onClick={() => onNavigateTab('site')}
                  className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                >
                  View All Site Logs →
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3 text-center">
                No site logs submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
