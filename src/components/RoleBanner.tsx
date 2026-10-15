import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { SYSTEM_USERS } from '../data/initialData';
import { UserRole } from '../types/project';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface RoleBannerProps {
  onOpenProcurementModal?: () => void;
  onOpenSiteLogModal?: () => void;
  onOpenOpsReviewModal?: () => void;
  onSwitchTab?: (tab: string) => void;
}

export const RoleBanner: React.FC<RoleBannerProps> = ({
  onOpenProcurementModal,
  onOpenSiteLogModal,
  onOpenOpsReviewModal,
  onSwitchTab,
}) => {
  const { currentRole, activeProject, setCurrentRole } = useProjectContext();
  const user = SYSTEM_USERS[currentRole];

  if (!activeProject) return null;

  const isOpsReviewPending = activeProject.status === 'ops_review';
  const isCeoReviewPending = activeProject.status === 'ceo_review';

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm mb-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
              Current Session: {user.role.replace('_', ' ')}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-300 font-medium">{user.name}</span>
          </div>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {currentRole === 'procurement' &&
              'Responsible for Bill of Quantities (BoQ) estimates, vendor purchase orders, material variance tracking, and required-on-site delivery dates.'}
            {currentRole === 'site_supervisor' &&
              'Responsible for daily site construction logs, manpower tracking (skilled/unskilled/subs), active heavy machinery, and field safety incident reports.'}
            {currentRole === 'project_manager' &&
              'Responsible for master scheduling, milestone critical paths, risk mitigation register, and submitting consolidated data packages to Operations.'}
            {currentRole === 'operations_manager' &&
              'Responsible for operational feasibility review, resource conflict checks, logistics verification, and official sign-off or punchlist revision requests.'}
            {currentRole === 'ceo' &&
              'Executive authority for portfolio Capex allocation, projected margin sign-off, capital drawdown release, and strategic executive directives.'}
          </p>
        </div>

        {/* Dynamic Action Callouts based on Project State and Role */}
        <div className="flex items-center gap-2 shrink-0">
          {currentRole === 'procurement' && onOpenProcurementModal && (
            <button
              onClick={onOpenProcurementModal}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              + Add Procurement Item
            </button>
          )}

          {currentRole === 'site_supervisor' && onOpenSiteLogModal && (
            <button
              onClick={onOpenSiteLogModal}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              + Log Daily Site Progress
            </button>
          )}

          {currentRole === 'project_manager' && !isOpsReviewPending && !isCeoReviewPending && activeProject.status !== 'approved' && onOpenOpsReviewModal && (
            <button
              onClick={onOpenOpsReviewModal}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Submit for Ops Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentRole === 'operations_manager' && isOpsReviewPending && onSwitchTab && (
            <button
              onClick={() => onSwitchTab('operations')}
              className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 animate-pulse"
            >
              <AlertCircle className="w-3.5 h-3.5 text-purple-200" />
              <span>Review & Sign Off Now</span>
            </button>
          )}

          {currentRole === 'ceo' && isCeoReviewPending && onSwitchTab && (
            <button
              onClick={() => onSwitchTab('ceo')}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Executive Sign-Off Room</span>
            </button>
          )}

          {/* Quick role toggle hint if role is not the one needed for pending action */}
          {isOpsReviewPending && currentRole !== 'operations_manager' && (
            <button
              onClick={() => {
                setCurrentRole('operations_manager');
                if (onSwitchTab) onSwitchTab('operations');
              }}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg border border-purple-500/30 cursor-pointer"
            >
              Switch to Ops Manager →
            </button>
          )}

          {isCeoReviewPending && currentRole !== 'ceo' && (
            <button
              onClick={() => {
                setCurrentRole('ceo');
                if (onSwitchTab) onSwitchTab('ceo');
              }}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg border border-emerald-500/30 cursor-pointer"
            >
              Switch to CEO →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
