import React, { useState } from 'react';
import { Project, SiteDailyLog } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { formatDate } from '../../utils/formatters';
import { 
  Plus, 
  HardHat, 
  ShieldCheck, 
  CloudSun, 
  Users, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { forecastSiteRisksAI } from '../../services/aiService';

interface SiteSupervisionTabProps {
  project: Project;
  onOpenAddLogModal: () => void;
}

export const SiteSupervisionTab: React.FC<SiteSupervisionTabProps> = ({
  project,
  onOpenAddLogModal,
}) => {
  const { currentRole, hasPermission } = useProjectContext();
  const [filterShift, setFilterShift] = useState<string>('all');

  // AI Forecast state
  const [isAiForecastOpen, setIsAiForecastOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiForecastText, setAiForecastText] = useState<string | null>(null);

  const handleRunAiForecast = async () => {
    setIsAiForecastOpen(true);
    if (aiForecastText) return;
    setIsAiLoading(true);
    try {
      const res = await forecastSiteRisksAI(project);
      setAiForecastText(res);
    } finally {
      setIsAiLoading(false);
    }
  };

  const logs = project.siteSupervision.dailyLogs;
  const filteredLogs = logs.filter((log) => {
    return filterShift === 'all' || log.shift === filterShift;
  });

  const latestLog = logs[0];
  const canAddLog = hasPermission('canAddSiteLogs');

  const totalPersonnelLatest = latestLog
    ? latestLog.labor.skilled +
      latestLog.labor.unskilled +
      latestLog.labor.supervisors +
      latestLog.labor.subcontractors
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Site Supervision & Field Execution Logs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily physical progress, labor attendance roster, heavy plant machinery, and safety inspections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiForecast}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E8E2D8] rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B6F4E]" />
            <span>AI Hazard Forecast</span>
            {isAiForecastOpen ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>

          <button
            onClick={onOpenAddLogModal}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs ${
              canAddLog
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!canAddLog}
            title={!canAddLog ? 'Only Site Supervisor or PM can submit daily site logs' : 'Log Daily Progress'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Daily Site Log</span>
          </button>
        </div>
      </div>

      {/* AI Site Forecast Drawer */}
      {isAiForecastOpen && (
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl p-5 space-y-3 relative overflow-hidden text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B6F4E]" />
              <span className="font-bold text-slate-900">
                AI Site Execution & Safety Hazard Forecast (Tariq Mansoor)
              </span>
            </div>
            <button
              onClick={() => setIsAiForecastOpen(false)}
              className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer font-medium"
            >
              Close
            </button>
          </div>

          {isAiLoading ? (
            <div className="flex items-center gap-2 py-4 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-[#8B6F4E]" />
              <span>Analyzing shift trade density, evening humidity levels, and crane access...</span>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E2D8] rounded-lg p-4 font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
              {aiForecastText}
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Physical Progress</span>
            <HardHat className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {project.siteSupervision.currentPhysicalProgress}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Verified on-site</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Manpower Today</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {totalPersonnelLatest} Workers
          </div>
          {latestLog ? (
            <span className="text-[11px] text-slate-400 mt-1 block">
              {latestLog.labor.skilled} skilled · {latestLog.labor.subcontractors} subs
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 mt-1 block">No log today</span>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Safety Incidents (YTD)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {project.siteSupervision.safetyIncidentsYTD}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            {project.siteSupervision.safetyIncidentsYTD === 0
              ? 'Zero lost-time injuries streak'
              : 'Safety review required'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Latest Shift Weather</span>
            <CloudSun className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-base font-bold text-slate-900">
            {latestLog?.weather || 'N/A'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {latestLog ? `Shift: ${latestLog.shift}` : 'Awaiting entry'}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          Daily Log History ({filteredLogs.length})
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Filter Shift:</span>
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Shifts</option>
            <option value="Day">Day Shift</option>
            <option value="Night">Night Shift</option>
            <option value="Full 24h">Full 24h</option>
          </select>
        </div>
      </div>

      {/* Log Entries List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <HardHat className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No Daily Site Logs Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Site Supervisor Marco Rossi can submit the first daily construction record with manpower, equipment, and tasks completed.
            </p>
            {canAddLog && (
              <button
                onClick={onOpenAddLogModal}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Log First Entry
              </button>
            )}
          </div>
        ) : (
          filteredLogs.map((log) => {
            const totalLabor =
              log.labor.skilled +
              log.labor.unskilled +
              log.labor.supervisors +
              log.labor.subcontractors;

            return (
              <div
                key={log.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{formatDate(log.logDate)}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-600">{log.shift} Shift</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-500">{log.weather}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Logged by <span className="font-medium text-slate-700">{log.supervisorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono tabular-nums text-slate-700">
                      Progress at log: <strong>{log.progressPercentageLogged}%</strong>
                    </span>
                    {log.verifiedByPm && (
                      <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PM Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Completed and Planned Tasks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">Tasks Completed Today</span>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {log.workCompleted}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">Planned For Tomorrow</span>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {log.workPlannedTomorrow}
                    </p>
                  </div>
                </div>

                {/* Labor and Equipment Breakdown */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-4 text-slate-600">
                    <span className="font-medium text-slate-800">Manpower ({totalLabor}):</span>
                    <span>{log.labor.skilled} skilled</span>
                    <span>{log.labor.unskilled} general</span>
                    <span>{log.labor.subcontractors} sub-trades</span>
                    <span>{log.labor.supervisors} lead</span>
                  </div>

                  {log.equipmentActive && log.equipmentActive.length > 0 && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-xs">{log.equipmentActive.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Safety notes or blockers */}
                {(log.safetyNotes || log.delaysOrBlockers) && (
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-2.5 text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      {log.safetyNotes && <p><strong>Safety / Briefing:</strong> {log.safetyNotes}</p>}
                      {log.delaysOrBlockers && <p className="mt-0.5"><strong>Blockers / Weather Delay:</strong> {log.delaysOrBlockers}</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
