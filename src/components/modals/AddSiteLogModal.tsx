import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { SiteDailyLog } from '../../types/project';
import { X, HardHat } from 'lucide-react';

interface AddSiteLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentProgress: number;
}

export const AddSiteLogModal: React.FC<AddSiteLogModalProps> = ({
  isOpen,
  onClose,
  projectId,
  currentProgress,
}) => {
  const { addSiteDailyLog } = useProjectContext();

  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState<SiteDailyLog['shift']>('Day');
  const [weather, setWeather] = useState<SiteDailyLog['weather']>('Clear');
  const [skilled, setSkilled] = useState<number>(30);
  const [unskilled, setUnskilled] = useState<number>(20);
  const [supervisors, setSupervisors] = useState<number>(4);
  const [subcontractors, setSubcontractors] = useState<number>(15);
  const [equipmentText, setEquipmentText] = useState('Tower Crane, Caterpillar 330 Excavator');
  const [workCompleted, setWorkCompleted] = useState('');
  const [workPlannedTomorrow, setWorkPlannedTomorrow] = useState('');
  const [safetyIncidents, setSafetyIncidents] = useState<number>(0);
  const [safetyNotes, setSafetyNotes] = useState('Daily morning toolbox briefing completed on PPE and fall arrest gear.');
  const [delaysOrBlockers, setDelaysOrBlockers] = useState('');
  const [progressLogged, setProgressLogged] = useState<number>(currentProgress || 45);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workCompleted.trim()) {
      alert('Please specify the construction work completed today.');
      return;
    }

    const equipmentActive = equipmentText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    addSiteDailyLog(projectId, {
      logDate,
      shift,
      weather,
      labor: {
        skilled: Number(skilled),
        unskilled: Number(unskilled),
        supervisors: Number(supervisors),
        subcontractors: Number(subcontractors),
      },
      equipmentActive,
      workCompleted: workCompleted.trim(),
      workPlannedTomorrow: workPlannedTomorrow.trim() || 'Continue according to weekly schedule.',
      safetyIncidents: Number(safetyIncidents),
      safetyNotes: safetyNotes.trim(),
      delaysOrBlockers: delaysOrBlockers.trim() || undefined,
      progressPercentageLogged: Number(progressLogged),
      photosCount: 4,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Submit Daily Site Construction Log</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                required
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Day">Day Shift</option>
                <option value="Night">Night Shift</option>
                <option value="Full 24h">Full 24h</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Weather</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Clear">Clear</option>
                <option value="Rain">Rain</option>
                <option value="High Wind">High Wind</option>
                <option value="Extreme Heat">Extreme Heat</option>
                <option value="Dust Storm">Dust Storm</option>
              </select>
            </div>
          </div>

          {/* Labor Breakdown */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wide">
              Manpower Attendance (Headcount)
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-slate-500 block text-[10px]">Skilled</label>
                <input
                  type="number"
                  min="0"
                  value={skilled}
                  onChange={(e) => setSkilled(Number(e.target.value))}
                  className="w-full font-mono p-1.5 bg-white border border-slate-200 rounded text-center"
                />
              </div>
              <div>
                <label className="text-slate-500 block text-[10px]">General / Unskilled</label>
                <input
                  type="number"
                  min="0"
                  value={unskilled}
                  onChange={(e) => setUnskilled(Number(e.target.value))}
                  className="w-full font-mono p-1.5 bg-white border border-slate-200 rounded text-center"
                />
              </div>
              <div>
                <label className="text-slate-500 block text-[10px]">Supervisors</label>
                <input
                  type="number"
                  min="0"
                  value={supervisors}
                  onChange={(e) => setSupervisors(Number(e.target.value))}
                  className="w-full font-mono p-1.5 bg-white border border-slate-200 rounded text-center"
                />
              </div>
              <div>
                <label className="text-slate-500 block text-[10px]">Subcontractors</label>
                <input
                  type="number"
                  min="0"
                  value={subcontractors}
                  onChange={(e) => setSubcontractors(Number(e.target.value))}
                  className="w-full font-mono p-1.5 bg-white border border-slate-200 rounded text-center"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Active Plant & Heavy Machinery (comma-separated)
            </label>
            <input
              type="text"
              value={equipmentText}
              onChange={(e) => setEquipmentText(e.target.value)}
              placeholder="e.g. Tower Crane 1, Bobcat Loader, Concrete Pump"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Work Completed Today</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Completed rebar installation for Grid C-F slab. Installed 180m conduit on 3rd floor."
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Work Planned Tomorrow</label>
            <textarea
              rows={2}
              placeholder="e.g. Pouring 300m³ concrete slab at 06:00. Pre-pour QA check."
              value={workPlannedTomorrow}
              onChange={(e) => setWorkPlannedTomorrow(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Safety Incidents</label>
              <input
                type="number"
                min="0"
                value={safetyIncidents}
                onChange={(e) => setSafetyIncidents(Number(e.target.value))}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Physical Completion (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressLogged}
                onChange={(e) => setProgressLogged(Number(e.target.value))}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Safety Briefing & Notes</label>
            <input
              type="text"
              value={safetyNotes}
              onChange={(e) => setSafetyNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Blockers / Delays (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Material shipment delayed by 2 hours; crane wind hold"
              value={delaysOrBlockers}
              onChange={(e) => setDelaysOrBlockers(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
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
              className="px-4 py-1.5 font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-xs cursor-pointer"
            >
              Submit Daily Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
