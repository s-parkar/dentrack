'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { InventoryCategory, InventoryItem, InventoryUnit } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Package, Plus, AlertTriangle, X, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES: InventoryCategory[] = [
  'Anesthetics', 'Restorative', 'Endodontic', 'Surgical',
  'Orthodontic', 'Prosthetic', 'Sterilization', 'PPE',
  'Impression Materials', 'Cements', 'Whitening', 'Instruments', 'Consumables'
];

const UNITS: InventoryUnit[] = ['Box', 'Pack', 'Bottle', 'Tube', 'Piece', 'Cartridge', 'Vial', 'Set', 'Roll', 'Bag'];

function NewItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addInventoryItem } = useApp();
  const [form, setForm] = useState({
    name: '', brand: '', category: 'Restorative' as InventoryCategory,
    unit: 'Box' as InventoryUnit, quantityOnHand: '', minStockLevel: '5',
    reorderLevel: '10', unitCost: '', expiryDate: '', location: '', batchNumber: '', notes: '',
  });

  const handleSave = () => {
    if (!form.name || !form.brand || !form.quantityOnHand || !form.unitCost) return;
    addInventoryItem({
      name: form.name, brand: form.brand, category: form.category,
      unit: form.unit, quantityOnHand: Number(form.quantityOnHand),
      minStockLevel: Number(form.minStockLevel) || 5,
      reorderLevel: Number(form.reorderLevel) || 10,
      unitCost: Number(form.unitCost),
      expiryDate: form.expiryDate || undefined,
      location: form.location || undefined,
      batchNumber: form.batchNumber || undefined,
      notes: form.notes || undefined,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-[15px] font-semibold text-slate-900">Add Inventory Item</p>
            </div>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Item Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Composite Resin A2" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Brand / Manufacturer *</label>
                <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. 3M / Kerr" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as InventoryCategory })} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Packaging Unit</label>
                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value as InventoryUnit })} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100">
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Quantity on Hand *</label>
                <input type="number" value={form.quantityOnHand} onChange={(e) => setForm({ ...form, quantityOnHand: e.target.value })} placeholder="0" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Min Alert Stock</label>
                <input type="number" value={form.minStockLevel} onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })} placeholder="5" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Unit Cost (₹) *</label>
                <input type="number" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} placeholder="0.00" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Storage Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Cabinet B, Shelf 2" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>
          </div>
          <div className="px-5 py-4 border-t border-slate-100 flex gap-3 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium">Add Item</button>
          </div>
        </div>
      </div>
    </>
  );
}

function StockAdjustModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const { addStockMovement } = useApp();
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const handleSave = () => {
    if (!qty || Number(qty) <= 0) return;
    addStockMovement({
      itemId: item.id,
      type,
      quantity: Number(qty),
      reason: reason || (type === 'IN' ? 'Stock Restock' : 'Clinical Consumption'),
      date: new Date().toISOString(),
      performedBy: 'Dr. Sneha Rao',
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="text-[14px] font-semibold text-slate-900">Adjust Stock — {item.name}</p>
              <p className="text-[11px] text-slate-500">Current Stock: {item.quantityOnHand} {item.unit}s</p>
            </div>
            <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setType('IN')} className={cn('py-2 rounded-lg text-[12px] font-medium border flex items-center justify-center gap-1.5 transition-colors', type === 'IN' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600')}>
              <ArrowDownRight className="w-4 h-4 text-green-600" /> Restock (+IN)
            </button>
            <button onClick={() => setType('OUT')} className={cn('py-2 rounded-lg text-[12px] font-medium border flex items-center justify-center gap-1.5 transition-colors', type === 'OUT' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-600')}>
              <ArrowUpRight className="w-4 h-4 text-rose-600" /> Consume (-OUT)
            </button>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">Quantity ({item.unit}s)</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">Reason / Note</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder={type === 'IN' ? 'New shipment from vendor' : 'Procedure usage / Expiry'} className="w-full text-[12px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-100" />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-sky-600 text-white text-[12px] font-medium hover:bg-sky-700">Save Adjustment</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function InventoryPage() {
  const { inventory, getLowStockItems } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);

  const lowStock = getLowStockItems();

  const filtered = inventory.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = inventory.reduce((sum, item) => sum + item.quantityOnHand * item.unitCost, 0);

  return (
    <AppShell
      title="Inventory Management"
      subtitle={`Dental Supply Chain · ${inventory.length} SKUs tracked · Total Stock Value: ₹${totalValue.toLocaleString('en-IN')}`}
      actions={
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-[13px] font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />Add Item
        </button>
      }
    >
      <div className="space-y-4">
        {/* Low Stock Warning Banner */}
        {lowStock.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-rose-900">{lowStock.length} Items Below Minimum Stock Level</p>
                <p className="text-[11px] text-rose-700">{lowStock.map((i) => i.name).join(', ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search supplies by name or brand..." className="w-full text-[13px] border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="text-[13px] border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Item Name', 'Brand', 'Category', 'Stock Level', 'Unit Cost', 'Total Value', 'Location', 'Expiry', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400">No inventory items found</td></tr>
              ) : filtered.map((item) => {
                const isLow = item.quantityOnHand <= item.minStockLevel;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {item.name}
                      {isLow && <span className="ml-2 badge bg-rose-50 border-rose-200 text-rose-700 text-[10px]">Low Stock</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.brand}</td>
                    <td className="px-4 py-3"><span className="badge bg-slate-100 border-slate-200 text-slate-700">{item.category}</span></td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', isLow ? 'text-rose-600' : 'text-slate-900')}>
                        {item.quantityOnHand}
                      </span>
                      <span className="text-slate-500 text-[11px]"> {item.unit}s</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">₹{item.unitCost.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">₹{(item.quantityOnHand * item.unitCost).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">{item.location || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">{item.expiryDate ? formatDate(item.expiryDate) : '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setAdjustingItem(item)} className="text-[12px] font-medium text-sky-600 hover:text-sky-800">
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewItemModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {adjustingItem && <StockAdjustModal item={adjustingItem} onClose={() => setAdjustingItem(null)} />}
    </AppShell>
  );
}
