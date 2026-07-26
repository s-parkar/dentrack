'use client';

import AppShell from '@/components/layout/AppShell';
import { useApp } from '@/lib/store';
import { BarChart3, TrendingUp, Users, Calendar, CreditCard, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { invoices, appointments, patients, clinicalRecords } = useApp();

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paid ? inv.total : 0), 0);
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
  const activePatients = patients.length;

  // Procedure frequency breakdown
  const procedureCounts: Record<string, number> = {};
  appointments.forEach((a) => {
    procedureCounts[a.procedure] = (procedureCounts[a.procedure] || 0) + 1;
  });

  const topProcedures = Object.entries(procedureCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxProcCount = topProcedures.length > 0 ? topProcedures[0][1] : 1;

  // Monthly Revenue Mock / Calculation
  const monthlyRevenue: { month: string; revenue: number }[] = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 68000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 75000 },
    { month: 'Jun', revenue: 89000 },
    { month: 'Jul', revenue: totalRevenue > 95000 ? totalRevenue : 95000 },
  ];

  const maxRev = Math.max(...monthlyRevenue.map((m: { month: string; revenue: number }) => m.revenue));

  return (
    <AppShell
      title="Analytics & Practice BI"
      subtitle="Operational Performance, Revenue Intelligence & Procedure Breakdown"
    >
      <div className="space-y-6">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Total Revenue</p>
              <p className="text-[20px] font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Appointments</p>
              <p className="text-[20px] font-bold text-slate-900">{completedAppointments} / {totalAppointments}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Registered Patients</p>
              <p className="text-[20px] font-bold text-slate-900">{activePatients}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Avg Revenue / Patient</p>
              <p className="text-[20px] font-bold text-slate-900">
                ₹{activePatients ? Math.round(totalRevenue / activePatients).toLocaleString('en-IN') : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-5 gap-5">
          {/* Revenue Trend SVG Bar Chart */}
          <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold text-slate-900">Monthly Revenue Overview</p>
                <p className="text-[11px] text-slate-500">Collected payments across recent months</p>
              </div>
              <span className="badge bg-green-50 border-green-200 text-green-700">+18% YoY Growth</span>
            </div>

            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 pb-2">
              {monthlyRevenue.map((item) => {
                const heightPct = Math.round((item.revenue / maxRev) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(item.revenue / 1000).toFixed(0)}k
                    </div>
                    <div
                      className="w-full bg-sky-500 hover:bg-sky-600 rounded-t-md transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[11px] font-medium text-slate-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Procedure Breakdown */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <p className="text-[14px] font-semibold text-slate-900">Top Dental Procedures</p>
              <p className="text-[11px] text-slate-500">Most frequent treatments performed</p>
            </div>

            <div className="space-y-3">
              {topProcedures.map(([proc, count]) => {
                const pct = Math.round((count / maxProcCount) * 100);
                return (
                  <div key={proc} className="space-y-1">
                    <div className="flex justify-between text-[12px]">
                      <span className="font-medium text-slate-800">{proc}</span>
                      <span className="text-slate-500 font-semibold">{count} visits</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
