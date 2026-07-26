'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { Invoice, TreatmentPackage } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import InvoiceModal from '@/components/billing/InvoiceModal';
import { CreditCard, Package, Check, Printer, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BillingPage() {
  const { invoices, packages, patients, appointments } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'packages'>('invoices');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const patient = patients.find((p) => p.id === inv.patientId);
    if (search && !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) && !patient?.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter((i) => i.paid).reduce((sum, inv) => sum + inv.total, 0);

  return (
    <AppShell
      title="Billing & Financials"
      subtitle={`Automated Billing, Tax Calculations & Treatment Packages · Billed: ₹${totalBilled.toLocaleString('en-IN')} · Paid: ₹${totalPaid.toLocaleString('en-IN')}`}
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('invoices')}
            className={cn('pb-3 text-[13px] font-semibold border-b-2 transition-colors', activeTab === 'invoices' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700')}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={cn('pb-3 text-[13px] font-semibold border-b-2 transition-colors', activeTab === 'packages' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700')}
          >
            Treatment Packages ({packages.length})
          </button>
        </div>

        {activeTab === 'invoices' ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices by INV-number or patient name..." className="w-full text-[13px] border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-[13px] min-w-[750px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Invoice No.', 'Date', 'Patient', 'Payment Method', 'Subtotal', 'Tax (18%)', 'Total Amount', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] text-slate-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInvoices.length === 0 ? (
                    <tr><td colSpan={9} className="py-12 text-center text-slate-400">No invoices found</td></tr>
                  ) : filteredInvoices.map((inv) => {
                    const patient = patients.find((p) => p.id === inv.patientId);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-[12px] text-sky-600 font-medium">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(inv.createdAt)}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{patient?.name ?? '—'}</td>
                        <td className="px-4 py-3"><span className="badge bg-slate-100 border-slate-200 text-slate-700">{inv.paymentMethod}</span></td>
                        <td className="px-4 py-3 text-slate-600">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-slate-500">₹{inv.taxAmount.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">₹{inv.total.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className={cn('badge', inv.paid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700')}>
                            {inv.paid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelectedInvoice(inv)} className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-800 font-medium">
                            <Printer className="w-3.5 h-3.5" /> View / Print
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900">{pkg.name}</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">{pkg.description}</p>
                  </div>
                  <span className="badge bg-green-50 border-green-200 text-green-700 font-medium">Active Package</span>
                </div>

                <div className="space-y-1 bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Included Procedures</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pkg.procedures.map((p) => (
                      <span key={p} className="badge bg-white border-slate-200 text-slate-700 text-[11px]">
                        <Check className="w-3 h-3 text-green-600" /> {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[12px] text-slate-400 line-through mr-2">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[18px] font-bold text-slate-900">₹{pkg.packagePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Valid for {pkg.validityDays} days</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceModal
          open={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          appointment={appointments.find((a) => a.id === selectedInvoice.appointmentId) ?? {
            id: selectedInvoice.appointmentId,
            patientId: selectedInvoice.patientId,
            chair: 'Chair A',
            doctorName: 'Dr. Sneha Rao',
            procedure: 'Consultation',
            date: new Date().toISOString().split('T')[0],
            startTime: '10:00',
            durationMinutes: 30,
            status: 'Completed',
            notes: '',
          }}
        />
      )}
    </AppShell>
  );
}
