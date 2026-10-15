import React, { useState } from 'react';
import { Project } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  Award, 
  CheckCircle2, 
  AlertOctagon, 
  RotateCcw, 
  DollarSign, 
  ShieldCheck, 
  FileSignature, 
  TrendingUp, 
  Clock,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateExecutiveBriefAI, draftExecutiveDirectiveAI } from '../../services/aiService';

interface CeoReviewTabProps {
  project: Project;
}

export const CeoReviewTab: React.FC<CeoReviewTabProps> = ({ project }) => {
  const { currentRole, setCurrentRole, submitCeoDecision, hasPermission } = useProjectContext();

  const [directives, setDirectives] = useState(project.ceoReview.executiveDirectives || '');
  const [releaseBudget, setReleaseBudget] = useState(project.ceoReview.budgetReleased || false);

  // AI states
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [briefingText, setBriefingText] = useState<string | null>(null);
  const [isDraftingAi, setIsDraftingAi] = useState(false);

  const handleFetchBriefing = async () => {
    setIsBriefingOpen(true);
    if (briefingText) return;
    setIsBriefingLoading(true);
    try {
      const res = await generateExecutiveBriefAI(project);
      setBriefingText(res);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const handleQuickDraftDirective = async (decision: 'approve' | 'revision' | 'hold') => {
    setIsDraftingAi(true);
    try {
      const text = await draftExecutiveDirectiveAI(
        project.name,
        'ceo',
        decision,
        `Stage evaluation for ${project.name}. Maintain luxury standards for The Design Address.`
      );
      setDirectives(text);
      if (decision === 'approve') setReleaseBudget(true);
    } finally {
      setIsDraftingAi(false);
    }
  };

  const isCeo = hasPermission('canGrantCeoSignOff') || currentRole === 'ceo';
  const isApproved = project.ceoReview.status === 'approved';
  const isPendingCeo = project.status === 'ceo_review';

  const totalCommitted = project.procurement.items.reduce((acc, i) => acc + i.actualTotal, 0);
  const totalEstimated = project.procurement.items.reduce((acc, i) => acc + i.estimatedTotal, 0);
  const variance = totalCommitted - totalEstimated;

  const handleApprove = () => {
    if (!directives.trim()) {
      alert('Please enter your executive sign-off directives before granting CEO approval.');
      return;
    }
    submitCeoDecision(project.id, 'approved', directives, releaseBudget);
  };

  const handleRequestRevision = () => {
    if (!directives.trim()) {
      alert('Please explain what revisions are required by executive leadership.');
      return;
    }
    submitCeoDecision(project.id, 'revision_required', directives, false);
  };

  const handleHold = () => {
    if (!directives.trim()) {
      alert('Please explain the rationale for placing the project on hold.');
      return;
    }
    submitCeoDecision(project.id, 'on_hold', directives, false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Chief Executive Officer (CEO) Review & Sign-Off</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Final executive governance, strategic ROI evaluation, capital drawdown approval, and binding directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFetchBriefing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E8E2D8] rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B6F4E]" />
            <span>AI Boardroom Brief</span>
            {isBriefingOpen ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>

          {!isCeo && (
            <button
              onClick={() => setCurrentRole('ceo')}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              Switch to CEO Persona (Rana Al Kassim) →
            </button>
          )}
        </div>
      </div>

      {/* AI Boardroom Briefing Drawer */}
      {isBriefingOpen && (
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl p-5 space-y-3 relative overflow-hidden text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B6F4E]" />
              <span className="font-bold text-slate-900">
                AI Boardroom Executive Briefing (Rana Al Kassim & Elena Vance)
              </span>
            </div>
            <button
              onClick={() => setIsBriefingOpen(false)}
              className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer font-medium"
            >
              Close
            </button>
          </div>

          {isBriefingLoading ? (
            <div className="flex items-center gap-2 py-4 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-[#8B6F4E]" />
              <span>Synthesizing Capex variances, site milestones, and operations checklist...</span>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E2D8] rounded-lg p-4 font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
              {briefingText}
            </div>
          )}
        </div>
      )}

      {/* Financial Health Strip for CEO */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total Authorized Capex</span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(project.budgetAllocated, project.currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Master approved baseline</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Contractually Committed</span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(totalCommitted, project.currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {((totalCommitted / (project.budgetAllocated || 1)) * 100).toFixed(1)}% of Capex
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Procurement Net Variance</span>
          <div
            className={`text-xl font-bold font-mono tabular-nums ${
              variance > 0 ? 'text-rose-600' : variance < 0 ? 'text-emerald-600' : 'text-slate-900'
            }`}
          >
            {variance > 0 ? '+' : ''}
            {formatCurrency(variance, project.currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {variance > 0 ? 'Unfavorable variance' : 'Favorable savings'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Projected Margin (ROI)</span>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600">
            {project.ceoReview.roiProjectedMarginPct.toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Target hurdle: 15.0%</span>
        </div>
      </div>

      {/* Official Sign-off Certificate if Approved */}
      {isApproved && (
        <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Official Executive Sign-Off
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500">
                    {formatDateTime(project.ceoReview.reviewedAt || '')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Project Greenlit & Budget Released
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Authorized by <strong className="text-slate-800">{project.ceoReview.reviewedBy || 'Robert Sterling'}</strong>, Chief Executive Officer.
                </p>
                <div className="pt-2 text-xs text-slate-800 italic bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                  "{project.ceoReview.executiveDirectives}"
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                Capital Drawdown Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Review Action Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <FileSignature className="w-4 h-4 text-emerald-600" />
          Executive Decision & Strategic Directives
        </h3>
        <p className="text-xs text-slate-500">
          The CEO reviews consolidated procurement estimations, daily site records, and the Operations Manager sign-off prior to releasing capital.
        </p>

        {/* Input box for CEO comments & directives */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Executive Directives & CEO Review Comments
            </label>

            {isCeo && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">AI Auto-Draft:</span>
                <button
                  type="button"
                  disabled={isDraftingAi}
                  onClick={() => handleQuickDraftDirective('approve')}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded cursor-pointer transition-colors"
                >
                  Greenlight
                </button>
                <button
                  type="button"
                  disabled={isDraftingAi}
                  onClick={() => handleQuickDraftDirective('revision')}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded cursor-pointer transition-colors"
                >
                  Revisions
                </button>
                <button
                  type="button"
                  disabled={isDraftingAi}
                  onClick={() => handleQuickDraftDirective('hold')}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 rounded cursor-pointer transition-colors"
                >
                  Hold
                </button>
              </div>
            )}
          </div>

          <textarea
            rows={4}
            value={directives}
            onChange={(e) => setDirectives(e.target.value)}
            disabled={!isCeo || isDraftingAi}
            placeholder="Enter CEO directives, e.g., Greenlight granted. Maintain strict monitoring on marble delivery dates; approved for initial capital drawdown..."
            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-900 leading-relaxed"
          />
          {isDraftingAi && (
            <div className="text-[11px] text-[#8B6F4E] flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Drafting authoritative executive directive with Gemini AI...</span>
            </div>
          )}
        </div>

        {/* Capital Release Checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              disabled={!isCeo}
              checked={releaseBudget}
              onChange={(e) => setReleaseBudget(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-900 block">
                Authorize Capital Release & Drawdown ($
                {project.budgetAllocated.toLocaleString()})
              </span>
              <span className="text-slate-500">
                Authorizes finance to issue purchase orders and release subcontractor milestone payments.
              </span>
            </div>
          </label>
        </div>

        {/* Executive Action Buttons */}
        <div className="pt-3 border-t border-slate-100">
          {isCeo ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleApprove}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Grant CEO Greenlight & Authorize</span>
              </button>

              <button
                onClick={handleRequestRevision}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Request Revision</span>
              </button>

              <button
                onClick={handleHold}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition-colors"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Place on Executive Hold</span>
              </button>
            </div>
          ) : (
            <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
              You are viewing as <strong className="text-slate-800">{currentRole.replace('_', ' ')}</strong>. Switch to <strong>Chief Executive Officer (CEO)</strong> in the top bar to authorize budget release and grant executive sign-off.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
