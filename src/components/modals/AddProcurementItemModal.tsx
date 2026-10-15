import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { ProcurementItem } from '../../types/project';
import { X, PackageCheck } from 'lucide-react';

interface AddProcurementItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const AddProcurementItemModal: React.FC<AddProcurementItemModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const { addProcurementItem } = useProjectContext();

  const [itemCode, setItemCode] = useState(`MAT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProcurementItem['category']>('Structural');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState('Metric Tons');
  const [estimatedUnitCost, setEstimatedUnitCost] = useState<number>(1200);
  const [actualUnitCost, setActualUnitCost] = useState<number>(1250);
  const [supplier, setSupplier] = useState('');
  const [poNumber, setPoNumber] = useState(`PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [orderStatus, setOrderStatus] = useState<ProcurementItem['orderStatus']>('PO Issued');
  const [requiredOnSiteDate, setRequiredOnSiteDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const estimatedTotal = quantity * estimatedUnitCost;
  const actualTotal = quantity * actualUnitCost;
  const variance = actualTotal - estimatedTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !supplier.trim()) {
      alert('Please fill out the item description and supplier name.');
      return;
    }

    addProcurementItem(projectId, {
      itemCode,
      description: description.trim(),
      category,
      quantity: Number(quantity),
      unit,
      estimatedUnitCost: Number(estimatedUnitCost),
      actualUnitCost: Number(actualUnitCost),
      supplier: supplier.trim(),
      poNumber: poNumber.trim(),
      orderStatus,
      requiredOnSiteDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Add Procurement Estimation (BoQ)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Item Code</label>
              <input
                type="text"
                required
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Structural">Structural</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Finishes">Finishes</option>
                <option value="Heavy Equipment">Heavy Equipment</option>
                <option value="Site Services">Site Services</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Item Description / Spec</label>
            <input
              type="text"
              required
              placeholder="e.g. Reinforced Concrete Rebar Grade 60 (#8 bars)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unit of Measure</label>
              <input
                type="text"
                required
                placeholder="e.g. Metric Tons, Sq Meters, Units"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estimated Unit Cost ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={estimatedUnitCost}
                onChange={(e) => setEstimatedUnitCost(Number(e.target.value))}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Actual / Contract Unit Cost ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={actualUnitCost}
                onChange={(e) => setActualUnitCost(Number(e.target.value))}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          {/* Live Variance Calculation */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Estimated: ${estimatedTotal.toLocaleString()}</span>
              <span className="font-semibold text-slate-900 block">Actual: ${actualTotal.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Variance</span>
              <span
                className={`font-mono font-bold ${
                  variance > 0 ? 'text-rose-600' : variance < 0 ? 'text-emerald-600' : 'text-slate-700'
                }`}
              >
                {variance > 0 ? '+' : ''}${variance.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Supplier / Fabricator</label>
              <input
                type="text"
                required
                placeholder="e.g. ArcelorMittal Steel Co"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">PO Number</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Order Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white cursor-pointer"
              >
                <option value="Draft">Draft</option>
                <option value="RFQPending">RFQ Pending</option>
                <option value="PO Issued">PO Issued</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Inspected">Inspected</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Required On-Site Date</label>
              <input
                type="date"
                required
                value={requiredOnSiteDate}
                onChange={(e) => setRequiredOnSiteDate(e.target.value)}
                className="w-full font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
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
              className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs cursor-pointer"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
