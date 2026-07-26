'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { Appointment, Invoice, InvoiceItem, PaymentMethod } from '@/lib/types';
import { PROCEDURE_PRICES } from '@/lib/mockData';
import { formatCurrency, generateId } from '@/lib/utils';
import { X, Printer, Plus, Trash2, Receipt, Check } from 'lucide-react';

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
}

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Card', 'Cash', 'Insurance'];

export default function InvoiceModal({ open, onClose, appointment }: InvoiceModalProps) {
  const { patients, getInvoice, addInvoice, updateInvoice } = useApp();
  const patient = patients.find((p) => p.id === appointment.patientId);
  const printRef = useRef<HTMLDivElement>(null);

  const existing = appointment.invoiceId ? getInvoice(appointment.invoiceId) : null;

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: generateId('item'),
      description: appointment.procedure,
      quantity: 1,
      unitPrice: PROCEDURE_PRICES[appointment.procedure] ?? 1000,
    },
  ]);
  const [discount, setDiscount] = useState(0);
  const [taxPercent] = useState(18);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      setItems(existing.items);
      setDiscount(existing.discountPercent);
      setPaymentMethod(existing.paymentMethod);
      setSaved(existing.paid);
    }
  }, [existing]);

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const discountAmt = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmt;
  const taxAmt = (afterDiscount * taxPercent) / 100;
  const total = afterDiscount + taxAmt;

  const addItem = () => {
    setItems([...items, { id: generateId('item'), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((i) => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleSave = () => {
    const invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'> = {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      items,
      discountPercent: discount,
      taxPercent,
      paymentMethod,
      createdAt: new Date().toISOString(),
      subtotal,
      discountAmount: discountAmt,
      taxAmount: taxAmt,
      total,
      paid: true,
    };

    if (existing) {
      updateInvoice(existing.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    setSaved(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!open) return null;

  const invoiceNumber = existing?.id ?? `INV-${Date.now()}`;
  const invoiceDate = existing?.createdAt ?? new Date().toISOString();

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-40 no-print" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={printRef}
          className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl pointer-events-auto flex flex-col max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 no-print">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-slate-900">Invoice & Billing</p>
                <p className="text-[11px] text-slate-500">{patient?.name} · {appointment.procedure}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Invoice Header (print-visible) */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">DenTrack Clinic</h2>
                <p className="text-[12px] text-slate-500">123 Dental Plaza, Mumbai, MH 400001</p>
                <p className="text-[12px] text-slate-500">GST: 27XXXXX1234X1Z5</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-slate-700">INVOICE</p>
                <p className="text-[11px] text-slate-500 font-mono">{invoiceNumber.toUpperCase()}</p>
                <p className="text-[11px] text-slate-500">
                  {new Date(invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Patient info */}
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Patient</p>
                <p className="text-[13px] font-semibold text-slate-900">{patient?.name}</p>
                <p className="text-[11px] text-slate-500">{patient?.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Appointment</p>
                <p className="text-[13px] font-medium text-slate-900">{appointment.procedure}</p>
                <p className="text-[11px] text-slate-500">{appointment.chair} · {appointment.doctorName}</p>
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-semibold text-slate-700">Line Items</p>
                <button
                  onClick={addItem}
                  className="no-print flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Item
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Description</th>
                      <th className="text-center px-3 py-2.5 text-slate-500 font-medium w-16">Qty</th>
                      <th className="text-right px-3 py-2.5 text-slate-500 font-medium w-24">Rate (₹)</th>
                      <th className="text-right px-4 py-2.5 text-slate-500 font-medium w-24">Amount</th>
                      <th className="w-8 no-print" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full text-[12px] text-slate-900 bg-transparent focus:outline-none focus:bg-slate-50 rounded px-1 -mx-1"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-12 text-center text-[12px] text-slate-900 border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:border-sky-400"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={item.unitPrice}
                            min={0}
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="w-20 text-right text-[12px] text-slate-900 border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:border-sky-400"
                          />
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-slate-900">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                        <td className="pr-2 no-print">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-8 text-[12px]">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900 font-medium w-24 text-right">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <span className="text-slate-500">Discount</span>
                <div className="flex items-center gap-1 no-print">
                  <input
                    type="number"
                    value={discount}
                    min={0}
                    max={100}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-14 text-right text-[12px] border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:border-sky-400"
                  />
                  <span className="text-slate-400">%</span>
                </div>
                <span className="text-rose-600 w-24 text-right font-medium">
                  -{formatCurrency(discountAmt)}
                </span>
              </div>
              <div className="flex items-center gap-8 text-[12px]">
                <span className="text-slate-500">GST ({taxPercent}%)</span>
                <span className="text-slate-900 font-medium w-24 text-right">{formatCurrency(taxAmt)}</span>
              </div>
              <div className="flex items-center gap-8 text-[13px] font-bold pt-1.5 border-t border-slate-200">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900 w-24 text-right text-[15px]">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="no-print">
              <p className="text-[12px] font-medium text-slate-700 mb-2">Payment Method</p>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`px-4 py-2 rounded-lg text-[12px] border font-medium transition-all ${
                      paymentMethod === m
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-[13px] font-medium no-print">
                <Check className="w-4 h-4" />
                Invoice saved & marked as paid
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-[13px] font-medium transition-colors"
            >
              {saved ? '✓ Saved & Paid' : 'Complete & Bill'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
