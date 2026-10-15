import React, { useState } from 'react';
import { Project, ProcurementItem } from '../../types/project';
import { useProjectContext } from '../../context/ProjectContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  TrendingDown, 
  TrendingUp, 
  PackageCheck, 
  AlertCircle,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { auditProcurementAI } from '../../services/aiService';

interface ProcurementTabProps {
  project: Project;
  onOpenAddItemModal: () => void;
  onEditItem?: (item: ProcurementItem) => void;
}

export const ProcurementTab: React.FC<ProcurementTabProps> = ({
  project,
  onOpenAddItemModal,
  onEditItem,
}) => {
  const { currentRole, deleteProcurementItem, hasPermission } = useProjectContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // AI Audit State
  const [isAiAuditOpen, setIsAiAuditOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState<string | null>(null);

  const handleRunAiAudit = async () => {
    setIsAiAuditOpen(true);
    if (aiAuditReport) return;
    setIsAiLoading(true);
    try {
      const res = await auditProcurementAI(project);
      setAiAuditReport(res);
    } finally {
      setIsAiLoading(false);
    }
  };

  const items = project.procurement.items;

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesQuery =
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.orderStatus === statusFilter;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  const totalEstimated = items.reduce((sum, item) => sum + item.estimatedTotal, 0);
  const totalActual = items.reduce((sum, item) => sum + item.actualTotal, 0);
  const totalVariance = totalActual - totalEstimated;
  const variancePct = totalEstimated > 0 ? (totalVariance / totalEstimated) * 100 : 0;

  const canAdd = hasPermission('canAddProcurement');
  const canDelete = hasPermission('canDeleteProcurement');

  return (
    <div className="space-y-6">
      {/* Top Controls: Procurement Summary & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Procurement & Cost Estimation Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bill of Quantities (BoQ), vendor quotes, estimated baseline vs committed contract costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E8E2D8] rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B6F4E]" />
            <span>AI Value Audit</span>
            {isAiAuditOpen ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>

          <button
            onClick={onOpenAddItemModal}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs ${
              canAdd
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!canAdd}
            title={!canAdd ? 'Requires "canAddProcurement" permission in Control Panel' : 'Add BoQ Item'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add BoQ Item</span>
          </button>
        </div>
      </div>

      {/* AI Value Engineering Drawer */}
      {isAiAuditOpen && (
        <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl p-5 space-y-3 relative overflow-hidden text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B6F4E]" />
              <span className="font-bold text-slate-900">
                AI Value Engineering & Margin Audit Report
              </span>
            </div>
            <button
              onClick={() => setIsAiAuditOpen(false)}
              className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer font-medium"
            >
              Close
            </button>
          </div>

          {isAiLoading ? (
            <div className="flex items-center gap-2 py-4 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-[#8B6F4E]" />
              <span>Analyzing BoQ cost deviations, freight timelines, and quarry allocations...</span>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E2D8] rounded-lg p-4 font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
              {aiAuditReport}
            </div>
          )}
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total Estimated Baseline</span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(totalEstimated, project.currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across {items.length} line items</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Actual Committed Cost</span>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {formatCurrency(totalActual, project.currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Based on signed POs & invoices</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">Procurement Cost Variance</span>
          <div
            className={`text-xl font-bold font-mono tabular-nums flex items-center gap-1.5 ${
              totalVariance > 0
                ? 'text-rose-600'
                : totalVariance < 0
                ? 'text-emerald-600'
                : 'text-slate-900'
            }`}
          >
            {totalVariance > 0 ? (
              <TrendingUp className="w-4 h-4 text-rose-500" />
            ) : totalVariance < 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            ) : null}
            <span>
              {totalVariance > 0 ? '+' : ''}
              {formatCurrency(totalVariance, project.currency)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {totalVariance > 0
              ? `Cost overrun of ${variancePct.toFixed(1)}%`
              : totalVariance < 0
              ? `Savings of ${Math.abs(variancePct).toFixed(1)}%`
              : 'Exact match with baseline'}
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
              placeholder="Search by item code, description, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Structural">Structural</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Finishes">Finishes</option>
              <option value="Heavy Equipment">Heavy Equipment</option>
              <option value="Site Services">Site Services</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Order Statuses</option>
              <option value="Draft">Draft</option>
              <option value="RFQPending">RFQ Pending</option>
              <option value="PO Issued">PO Issued</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Inspected">Inspected</option>
            </select>
          </div>
        </div>

        {/* High Density BoQ Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">Code / Description</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold text-right">Qty / Unit</th>
                <th className="py-2.5 px-3 font-semibold text-right">Est. Unit</th>
                <th className="py-2.5 px-3 font-semibold text-right">Act. Unit</th>
                <th className="py-2.5 px-3 font-semibold text-right">Est. Total</th>
                <th className="py-2.5 px-3 font-semibold text-right">Act. Total</th>
                <th className="py-2.5 px-3 font-semibold text-right">Variance</th>
                <th className="py-2.5 px-3 font-semibold">Status / Supplier</th>
                <th className="py-2.5 px-3 font-semibold">Required Date</th>
                {canDelete && <th className="py-2.5 px-3 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No procurement items found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-mono font-semibold text-slate-900">{item.itemCode}</div>
                        <div className="text-slate-600 truncate max-w-xs">{item.description}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800">
                        {item.quantity.toLocaleString()} <span className="text-slate-400 text-[10px]">{item.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        ${item.estimatedUnitCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 font-medium">
                        ${item.actualUnitCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        ${item.estimatedTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 font-semibold">
                        ${item.actualTotal.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono tabular-nums font-semibold ${
                          item.variance > 0
                            ? 'text-rose-600'
                            : item.variance < 0
                            ? 'text-emerald-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.variance > 0 ? '+' : ''}${item.variance.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{item.orderStatus}</div>
                        <div className="text-slate-500 text-[11px] truncate max-w-[140px]">{item.supplier}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-600">
                        {formatDate(item.requiredOnSiteDate)}
                      </td>
                      {canDelete && (
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => deleteProcurementItem(project.id, item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
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
