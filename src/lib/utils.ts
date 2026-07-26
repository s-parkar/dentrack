import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AppointmentStatus, ToothCondition } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-sky-50 text-sky-700 border-sky-200',
  'In-Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
  'No-Show': 'bg-rose-50 text-rose-700 border-rose-200',
};

export const STATUS_DOT: Record<AppointmentStatus, string> = {
  Scheduled: 'bg-sky-500',
  'In-Progress': 'bg-amber-500',
  Completed: 'bg-green-500',
  Cancelled: 'bg-slate-400',
  'No-Show': 'bg-rose-500',
};

export const TOOTH_CONDITION_CONFIG: Record<
  ToothCondition,
  { bg: string; border: string; label: string; dot: string }
> = {
  healthy: { bg: 'bg-white', border: 'border-slate-300', label: 'Healthy', dot: 'bg-slate-400' },
  cavity: { bg: 'bg-rose-50', border: 'border-rose-300 text-rose-700', label: 'Cavity', dot: 'bg-rose-500' },
  crown: { bg: 'bg-slate-100', border: 'border-slate-400 text-slate-700', label: 'Crown', dot: 'bg-slate-600' },
  missing: { bg: 'bg-slate-50', border: 'border-slate-200 text-slate-400', label: 'Missing', dot: 'bg-slate-300' },
  rct: { bg: 'bg-emerald-50', border: 'border-emerald-300 text-emerald-700', label: 'Root Canal (RCT)', dot: 'bg-emerald-500' },
  implant: { bg: 'bg-purple-50', border: 'border-purple-300 text-purple-700', label: 'Implant', dot: 'bg-purple-500' },
  bridge: { bg: 'bg-indigo-50', border: 'border-indigo-300 text-indigo-700', label: 'Bridge', dot: 'bg-indigo-500' },
  veneer: { bg: 'bg-sky-50', border: 'border-sky-300 text-sky-700', label: 'Veneer', dot: 'bg-sky-500' },
  fracture: { bg: 'bg-amber-50', border: 'border-amber-300 text-amber-700', label: 'Fracture', dot: 'bg-amber-500' },
};

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
