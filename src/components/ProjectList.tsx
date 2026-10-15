import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { Project, ProjectStatus } from '../types/project';
import { formatCurrency, formatDate, getStatusLabel } from '../utils/formatters';
import { 
  Building2, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  HardHat, 
  Camera, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

interface ProjectListProps {
  onSelectProject: (projectId: string) => void;
  onOpenNewProject: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject, onOpenNewProject }) => {
  const { projects } = useProjectContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // KPI Calculations
  const totalCapex = projects.reduce((acc, p) => acc + p.budgetAllocated, 0);
  const opsReviewCount = projects.filter((p) => p.status === 'ops_review').length;
  const ceoReviewCount = projects.filter((p) => p.status === 'ceo_review').length;
  const greenlitCount = projects.filter((p) => p.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Portfolio KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Portfolio Capex Budget</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(totalCapex)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {projects.length} active enterprise projects
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Ops Review Queue</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-purple-700">
            {opsReviewCount} Pending
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Awaiting Operations validation
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">CEO Sign-Off Queue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-700">
            {ceoReviewCount} Pending
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Awaiting executive capital release
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Approved & Greenlit</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-blue-700">
            {greenlitCount} Projects
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Executing under released capital
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code, project name, client, or UAE location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Segmented Control Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({projects.length})
              </button>
              <button
                onClick={() => setStatusFilter('ops_review')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'ops_review'
                    ? 'bg-white text-purple-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ops Review ({opsReviewCount})
              </button>
              <button
                onClick={() => setStatusFilter('ceo_review')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'ceo_review'
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CEO Sign-Off ({ceoReviewCount})
              </button>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Sectors</option>
              <option value="Residential">Residential Luxury</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>
        </div>

        {/* High-Density Project Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Code / Project</th>
                <th className="py-2.5 px-3 font-semibold">Sector & Location</th>
                <th className="py-2.5 px-3 font-semibold text-right">Capex Budget</th>
                <th className="py-2.5 px-3 font-semibold text-right">Procurement Variance</th>
                <th className="py-2.5 px-3 font-semibold">Progress</th>
                <th className="py-2.5 px-3 font-semibold">Workflow Review Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No projects found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const totalEst = project.procurement.items.reduce((acc, i) => acc + i.estimatedTotal, 0);
                  const totalAct = project.procurement.items.reduce((acc, i) => acc + i.actualTotal, 0);
                  const variance = totalAct - totalEst;

                  const isOpsPending = project.status === 'ops_review';
                  const isCeoPending = project.status === 'ceo_review';

                  return (
                    <tr
                      key={project.id}
                      onClick={() => onSelectProject(project.id)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3">
                        <div className="font-mono font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.code}
                        </div>
                        <div className="text-slate-800 font-medium truncate max-w-xs">
                          {project.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          Client: {project.client}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-700">{project.category}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                          {project.location}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatCurrency(project.budgetAllocated, project.currency)}
                      </td>

                      <td
                        className={`py-3 px-3 text-right font-mono tabular-nums font-semibold ${
                          variance > 0
                            ? 'text-rose-600'
                            : variance < 0
                            ? 'text-emerald-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {variance > 0 ? '+' : ''}
                        {formatCurrency(variance, project.currency)}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${project.overallProgress}%` }}
                            />
                          </div>
                          <span className="font-mono tabular-nums text-slate-700 text-[11px]">
                            {project.overallProgress}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            isCeoPending
                              ? 'text-emerald-700'
                              : isOpsPending
                              ? 'text-purple-700'
                              : project.status === 'approved'
                              ? 'text-blue-700'
                              : 'text-slate-600'
                          }`}
                        >
                          {isCeoPending && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {isOpsPending && <Clock className="w-3.5 h-3.5 text-purple-600" />}
                          {project.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                          <span>{getStatusLabel(project.status)}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
                          <span>Open Cockpit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
