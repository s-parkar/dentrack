'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { InventoryCategory, InventoryItem, InventoryUnit } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  Package, Plus, Minus, AlertTriangle, X, Search, ArrowUpRight, ArrowDownRight,
  Edit2, LayoutGrid, Table as TableIcon, Tag, MapPin, Calendar, Layers, Check, Trash2, Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_CATEGORIES: InventoryCategory[] = [
  'Anesthetics', 'Restorative', 'Endodontic', 'Surgical',
  'Orthodontic', 'Prosthetic', 'Sterilization', 'PPE',
  'Impression Materials', 'Cements', 'Whitening', 'Instruments', 'Consumables'
];

const UNITS: InventoryUnit[] = ['Box', 'Pack', 'Bottle', 'Tube', 'Piece', 'Cartridge', 'Vial', 'Set', 'Roll', 'Bag'];

// ============================================================
// NEW / EDIT ITEM MODAL WITH CUSTOM CATEGORY CREATION
// ============================================================
interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  editItem?: InventoryItem | null;
  categoriesList: string[];
  onAddCategory: (cat: string) => void;
}

function ItemModal({ open, onClose, editItem, categoriesList, onAddCategory }: ItemModalProps) {
  const { addInventoryItem, updateInventoryItem } = useApp();

  const isEdit = Boolean(editItem);

  const [form, setForm] = useState({
    name: editItem?.name ?? '',
    brand: editItem?.brand ?? '',
    category: editItem?.category ?? ('Restorative' as InventoryCategory),
    unit: editItem?.unit ?? ('Box' as InventoryUnit),
    quantityOnHand: editItem?.quantityOnHand !== undefined ? String(editItem.quantityOnHand) : '',
    minStockLevel: editItem?.minStockLevel !== undefined ? String(editItem.minStockLevel) : '5',
    reorderLevel: editItem?.reorderLevel !== undefined ? String(editItem.reorderLevel) : '10',
    unitCost: editItem?.unitCost !== undefined ? String(editItem.unitCost) : '',
    expiryDate: editItem?.expiryDate ?? '',
    location: editItem?.location ?? '',
    batchNumber: editItem?.batchNumber ?? '',
    notes: editItem?.notes ?? '',
  });

  const [isCustomCat, setIsCustomCat] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

  // Pre-populate fields when editItem changes or modal opens
  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name ?? '',
        brand: editItem.brand ?? '',
        category: editItem.category ?? ('Restorative' as InventoryCategory),
        unit: editItem.unit ?? ('Box' as InventoryUnit),
        quantityOnHand: editItem.quantityOnHand !== undefined ? String(editItem.quantityOnHand) : '',
        minStockLevel: editItem.minStockLevel !== undefined ? String(editItem.minStockLevel) : '5',
        reorderLevel: editItem.reorderLevel !== undefined ? String(editItem.reorderLevel) : '10',
        unitCost: editItem.unitCost !== undefined ? String(editItem.unitCost) : '',
        expiryDate: editItem.expiryDate ?? '',
        location: editItem.location ?? '',
        batchNumber: editItem.batchNumber ?? '',
        notes: editItem.notes ?? '',
      });
      setIsCustomCat(false);
    } else {
      setForm({
        name: '', brand: '', category: 'Restorative' as InventoryCategory,
        unit: 'Box' as InventoryUnit, quantityOnHand: '', minStockLevel: '5',
        reorderLevel: '10', unitCost: '', expiryDate: '', location: '', batchNumber: '', notes: '',
      });
      setIsCustomCat(false);
    }
  }, [editItem, open]);

  if (!open) return null;

  const handleSave = () => {
    if (!form.name || !form.brand || !form.quantityOnHand || !form.unitCost) return;

    let finalCategory = form.category;
    if (isCustomCat && customCatInput.trim()) {
      finalCategory = customCatInput.trim();
      onAddCategory(finalCategory);
    }

    if (isEdit && editItem) {
      updateInventoryItem(editItem.id, {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: finalCategory,
        unit: form.unit,
        quantityOnHand: Number(form.quantityOnHand),
        minStockLevel: Number(form.minStockLevel) || 5,
        reorderLevel: Number(form.reorderLevel) || 10,
        unitCost: Number(form.unitCost),
        expiryDate: form.expiryDate || undefined,
        location: form.location || undefined,
        batchNumber: form.batchNumber || undefined,
        notes: form.notes || undefined,
      });
    } else {
      addInventoryItem({
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: finalCategory,
        unit: form.unit,
        quantityOnHand: Number(form.quantityOnHand),
        minStockLevel: Number(form.minStockLevel) || 5,
        reorderLevel: Number(form.reorderLevel) || 10,
        unitCost: Number(form.unitCost),
        expiryDate: form.expiryDate || undefined,
        location: form.location || undefined,
        batchNumber: form.batchNumber || undefined,
        notes: form.notes || undefined,
      });
    }

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center border border-sky-100">
                <Package className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-[15px] font-semibold text-slate-900">
                {isEdit ? `Edit Stock Item — ${editItem?.name}` : 'Add Inventory Item'}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Item Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Composite Resin A2"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Brand / Manufacturer *</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. 3M / Kerr / Septodont"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Category Select & Add Custom Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-slate-700 block">Category</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCat(!isCustomCat)}
                    className="text-[10px] font-semibold text-sky-600 hover:text-sky-800"
                  >
                    {isCustomCat ? '← Select Standard' : '+ Add Custom Category'}
                  </button>
                </div>

                {isCustomCat ? (
                  <input
                    type="text"
                    value={customCatInput}
                    onChange={(e) => setCustomCatInput(e.target.value)}
                    placeholder="Enter new category name..."
                    className="w-full text-xs border border-sky-300 rounded-lg px-3 py-2 bg-sky-50/50 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                ) : (
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as InventoryCategory })}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-sky-400"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Packaging Unit</label>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value as InventoryUnit })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-sky-400"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Quantity on Hand *</label>
                <input
                  type="number"
                  value={form.quantityOnHand}
                  onChange={(e) => setForm({ ...form, quantityOnHand: e.target.value })}
                  placeholder="0"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Min Alert Stock</label>
                <input
                  type="number"
                  value={form.minStockLevel}
                  onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
                  placeholder="5"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Unit Cost (₹) *</label>
                <input
                  type="number"
                  value={form.unitCost}
                  onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
                  placeholder="0.00"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">Storage Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Cabinet B, Shelf 2"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-4 border-t border-slate-100 flex gap-3 shrink-0 bg-slate-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Inventory Item'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// BULK ADD INVENTORY MODAL
// ============================================================
interface BulkRow {
  name: string;
  brand: string;
  category: string;
  unit: InventoryUnit;
  quantityOnHand: string;
  minStockLevel: string;
  unitCost: string;
  location: string;
}

const EMPTY_ROW = (): BulkRow => ({
  name: '',
  brand: '',
  category: 'Restorative',
  unit: 'Box',
  quantityOnHand: '',
  minStockLevel: '5',
  unitCost: '',
  location: '',
});

function BulkAddModal({
  open,
  onClose,
  categoriesList,
}: {
  open: boolean;
  onClose: () => void;
  categoriesList: string[];
}) {
  const { addInventoryItem } = useApp();
  const [rows, setRows] = useState<BulkRow[]>([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);

  if (!open) return null;

  const updateRow = (index: number, field: keyof BulkRow, val: string) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, EMPTY_ROW()]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    const validRows = rows.filter((r) => r.name.trim() && r.brand.trim() && r.quantityOnHand && r.unitCost);
    if (validRows.length === 0) return;

    validRows.forEach((r) => {
      addInventoryItem({
        name: r.name.trim(),
        brand: r.brand.trim(),
        category: r.category || 'Restorative',
        unit: r.unit,
        quantityOnHand: Number(r.quantityOnHand),
        minStockLevel: Number(r.minStockLevel) || 5,
        reorderLevel: 10,
        unitCost: Number(r.unitCost),
        location: r.location.trim() || undefined,
      });
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-200">
                <Upload className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Bulk Add Inventory Supplies</h2>
                <p className="text-xs text-slate-500">Quickly type and import multiple stock items at once</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs min-w-[900px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="text-left px-3 py-2.5 w-[20%]">Item Name *</th>
                    <th className="text-left px-3 py-2.5 w-[15%]">Brand *</th>
                    <th className="text-left px-3 py-2.5 w-[15%]">Category</th>
                    <th className="text-left px-3 py-2.5 w-[10%]">Unit</th>
                    <th className="text-left px-3 py-2.5 w-[10%]">Qty *</th>
                    <th className="text-left px-3 py-2.5 w-[10%]">Min Alert</th>
                    <th className="text-left px-3 py-2.5 w-[10%]">Unit Cost (₹) *</th>
                    <th className="text-left px-3 py-2.5 w-[10%]">Location</th>
                    <th className="text-center px-2 py-2.5 w-[5%]">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateRow(idx, 'name', e.target.value)}
                          placeholder="e.g. Lidocaine 2%"
                          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.brand}
                          onChange={(e) => updateRow(idx, 'brand', e.target.value)}
                          placeholder="e.g. Septodont"
                          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={row.category}
                          onChange={(e) => updateRow(idx, 'category', e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                        >
                          {categoriesList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={row.unit}
                          onChange={(e) => updateRow(idx, 'unit', e.target.value as InventoryUnit)}
                          className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.quantityOnHand}
                          onChange={(e) => updateRow(idx, 'quantityOnHand', e.target.value)}
                          placeholder="10"
                          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.minStockLevel}
                          onChange={(e) => updateRow(idx, 'minStockLevel', e.target.value)}
                          placeholder="5"
                          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.unitCost}
                          onChange={(e) => updateRow(idx, 'unitCost', e.target.value)}
                          placeholder="450"
                          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.location}
                          onChange={(e) => updateRow(idx, 'location', e.target.value)}
                          placeholder="Cabinet A"
                          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removeRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addRow}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50/50 hover:bg-sky-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Item Row</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 rounded-b-2xl">
            <span className="text-xs text-slate-500">
              Valid items with Name, Brand, Quantity &amp; Unit Cost will be imported.
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                Import All Valid Items ({rows.filter((r) => r.name.trim() && r.quantityOnHand).length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// BATCH STOCK ADJUSTMENT MODAL (+ / - MULTIPLE ITEMS AT ONCE)
// ============================================================
interface BatchAdjustModalProps {
  open: boolean;
  onClose: () => void;
  inventoryList: InventoryItem[];
}

function BatchStockAdjustModal({ open, onClose, inventoryList }: BatchAdjustModalProps) {
  const { addStockMovement } = useApp();
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [filterSearch, setFilterSearch] = useState('');
  const [reason, setReason] = useState('');
  const [qtyChanges, setQtyChanges] = useState<Record<string, number>>({});

  if (!open) return null;

  const handleQtyChange = (itemId: string, val: number) => {
    setQtyChanges((prev) => ({
      ...prev,
      [itemId]: Math.max(0, val),
    }));
  };

  const filteredItems = inventoryList.filter(
    (i) =>
      i.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
      i.brand.toLowerCase().includes(filterSearch.toLowerCase()) ||
      i.category.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const modifiedCount = Object.values(qtyChanges).filter((v) => v > 0).length;

  const handleSaveBatch = () => {
    if (modifiedCount === 0) return;

    Object.entries(qtyChanges).forEach(([itemId, qty]) => {
      if (qty > 0) {
        addStockMovement({
          itemId,
          type,
          quantity: qty,
          reason: reason.trim() || (type === 'IN' ? 'Batch Stock Restock' : 'Batch Clinical Usage'),
          date: new Date().toISOString(),
          performedBy: 'Attending Staff',
        });
      }
    });

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        <div
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-200">
                <Layers className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Batch Stock Adjustment (+ / -)</h2>
                <p className="text-xs text-slate-500">Restock or consume multiple stock items simultaneously</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode & Reason Bar */}
          <div className="p-4 sm:px-6 border-b border-slate-100 bg-white space-y-3 shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Type Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setType('IN')}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                    type === 'IN'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Restock (+IN)</span>
                </button>
                <button
                  onClick={() => setType('OUT')}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                    type === 'OUT'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Consume (-OUT)</span>
                </button>
              </div>

              {/* Search & Reason */}
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Filter stock items..."
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-sky-400 flex-1"
                />
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={type === 'IN' ? 'Reason e.g. Shipment Invoice #881' : 'Reason e.g. Surgery Kit Usage'}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:bg-white focus:border-sky-400 flex-1"
                />
              </div>
            </div>
          </div>

          {/* Items List Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="text-left px-4 py-2.5">Item Name</th>
                    <th className="text-left px-4 py-2.5">Category</th>
                    <th className="text-center px-4 py-2.5">Current Stock</th>
                    <th className="text-center px-4 py-2.5">Adjustment Quantity</th>
                    <th className="text-right px-4 py-2.5">New Stock Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => {
                    const adj = qtyChanges[item.id] || 0;
                    const newStock = type === 'IN' ? item.quantityOnHand + adj : Math.max(0, item.quantityOnHand - adj);
                    const isModified = adj > 0;

                    return (
                      <tr key={item.id} className={cn('transition-colors', isModified ? 'bg-sky-50/40' : 'hover:bg-slate-50/50')}>
                        <td className="px-4 py-2.5">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.brand}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center font-semibold text-slate-700">
                          {item.quantityOnHand} {item.unit}s
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleQtyChange(item.id, Math.max(0, adj - 1))}
                              className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={adj || ''}
                              onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                              placeholder="0"
                              className="w-16 text-center text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-sky-400"
                            />
                            <button
                              onClick={() => handleQtyChange(item.id, adj + 1)}
                              className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleQtyChange(item.id, adj + 10)}
                              className="text-[10px] font-bold px-1.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 ml-1"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-slate-900">
                          <span className={cn(isModified ? (type === 'IN' ? 'text-emerald-600' : 'text-rose-600') : '')}>
                            {newStock} {item.unit}s
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 rounded-b-2xl">
            <span className="text-xs text-slate-500">
              {modifiedCount} item{modifiedCount !== 1 ? 's' : ''} set for batch {type === 'IN' ? 'restock (+)' : 'consumption (-)'}.
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBatch}
                disabled={modifiedCount === 0}
                className={cn(
                  'flex items-center gap-1.5 px-5 py-2 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-40',
                  type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                )}
              >
                <Check className="w-4 h-4" />
                Apply Batch {type === 'IN' ? 'Restock (+)' : 'Consume (-)'} ({modifiedCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MAIN INVENTORY PAGE WITH CARDS & STEPPER CONTROLS
// ============================================================
export default function InventoryPage() {
  const { inventory, addStockMovement, getLowStockItems } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [batchAdjustOpen, setBatchAdjustOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Construct dynamic category list
  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...inventory.map((i) => i.category), ...customCategories])
  );

  const handleAddCategory = (cat: string) => {
    if (!allCategories.includes(cat)) {
      setCustomCategories((prev) => [...prev, cat]);
    }
  };

  // Quick 1-click Plus / Minus Stepper
  const handleQuickStep = (item: InventoryItem, delta: number) => {
    if (delta < 0 && item.quantityOnHand <= 0) return;
    addStockMovement({
      itemId: item.id,
      type: delta > 0 ? 'IN' : 'OUT',
      quantity: Math.abs(delta),
      reason: delta > 0 ? 'Quick Restock (+1)' : 'Quick Clinical Usage (-1)',
      date: new Date().toISOString(),
      performedBy: 'Attending Staff',
    });
  };

  const lowStock = getLowStockItems();

  const filtered = inventory.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (
      search &&
      !item.name.toLowerCase().includes(search.toLowerCase()) &&
      !item.brand.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalValue = inventory.reduce((sum, item) => sum + item.quantityOnHand * item.unitCost, 0);

  return (
    <AppShell
      title="Inventory Management"
      subtitle={`Dental Supply Chain · ${inventory.length} SKUs tracked · Total Value: ₹${totalValue.toLocaleString('en-IN')}`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBatchAdjustOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Batch Stock (+ / -)</span>
          </button>

          <button
            onClick={() => setBulkModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Bulk Add Items</span>
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Low Stock Warning Banner */}
        {lowStock.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-900">
                  {lowStock.length} Supply Item{lowStock.length !== 1 ? 's' : ''} Below Minimum Stock Alert Level
                </p>
                <p className="text-[11px] text-rose-700 font-medium">
                  {lowStock.map((i) => `${i.name} (${i.quantityOnHand} ${i.unit}s left)`).join(' · ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory by item name or brand..."
                className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:border-sky-400 shadow-2xs"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:border-sky-400 shadow-2xs"
            >
              <option value="">All Categories ({allCategories.length})</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Cards vs Table Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'cards'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'table'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* CARDS VIEW LAYOUT */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No inventory supplies found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or click &quot;Add Item&quot; to register stock.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isLow = item.quantityOnHand <= item.minStockLevel;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'bg-white rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden',
                      isLow ? 'border-rose-300 ring-1 ring-rose-200/50' : 'border-slate-200 hover:border-sky-300'
                    )}
                  >
                    {/* Top Content Body */}
                    <div className="p-4 space-y-3">
                      {/* Top Row: Category & Edit Button */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 truncate">
                          <Tag className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.category}</span>
                        </span>

                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-sky-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit Stock Info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>

                      {/* Item Name & Brand */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.brand}</p>
                      </div>

                      {/* Stock Details Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Unit Cost</p>
                          <p className="font-bold text-slate-800 mt-0.5">₹{item.unitCost}</p>
                        </div>
                        <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Total Value</p>
                          <p className="font-bold text-slate-900 mt-0.5">₹{(item.quantityOnHand * item.unitCost).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Location</p>
                          <p className="font-medium text-slate-700 mt-0.5 truncate">{item.location || '—'}</p>
                        </div>
                        <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Expiry / Min</p>
                          <p className="font-medium text-slate-700 mt-0.5 truncate">
                            {item.expiryDate ? formatDate(item.expiryDate) : `Min ${item.minStockLevel}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Footer Row: Quantity & Plus/Minus Stepper */}
                    <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className={cn('text-xl font-extrabold', isLow ? 'text-rose-600' : 'text-slate-900')}>
                            {item.quantityOnHand}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{item.unit}s</span>
                          {isLow && (
                            <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                              Low
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper Control Buttons (- / +) */}
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                        <button
                          onClick={() => handleQuickStep(item, -1)}
                          disabled={item.quantityOnHand <= 0}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 disabled:opacity-30 text-rose-700 flex items-center justify-center font-extrabold text-base transition-colors"
                          title="Quick Consume (-1)"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-800 px-1 select-none">
                          {item.quantityOnHand}
                        </span>
                        <button
                          onClick={() => handleQuickStep(item, 1)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-base transition-colors"
                          title="Quick Restock (+1)"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* TABLE VIEW LAYOUT */
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-xs min-w-[850px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="text-left px-4 py-3">Item Name</th>
                  <th className="text-left px-4 py-3">Brand</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-center px-4 py-3">Quick Stock (- / +)</th>
                  <th className="text-left px-4 py-3">Unit Cost</th>
                  <th className="text-left px-4 py-3">Total Value</th>
                  <th className="text-left px-4 py-3">Location</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">No inventory supplies found</td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const isLow = item.quantityOnHand <= item.minStockLevel;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {item.name}
                          {isLow && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700">
                              Low Stock
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.brand}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 border border-slate-200 text-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleQuickStep(item, -1)}
                              disabled={item.quantityOnHand <= 0}
                              className="w-6 h-6 rounded bg-rose-50 hover:bg-rose-100 disabled:opacity-30 text-rose-700 font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className={cn('font-bold text-xs min-w-[30px] text-center', isLow ? 'text-rose-600' : 'text-slate-900')}>
                              {item.quantityOnHand} {item.unit}s
                            </span>
                            <button
                              onClick={() => handleQuickStep(item, 1)}
                              className="w-6 h-6 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">₹{item.unitCost}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">₹{(item.quantityOnHand * item.unitCost).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-slate-500">{item.location || '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setModalOpen(true);
                            }}
                            className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        editItem={editingItem}
        categoriesList={allCategories}
        onAddCategory={handleAddCategory}
      />

      <BulkAddModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        categoriesList={allCategories}
      />

      <BatchStockAdjustModal
        open={batchAdjustOpen}
        onClose={() => setBatchAdjustOpen(false)}
        inventoryList={inventory}
      />
    </AppShell>
  );
}
