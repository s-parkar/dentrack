'use client';

import { useState, useRef, useEffect } from 'react';
import { ToothState, ToothCondition } from '@/lib/types';
import { cn } from '@/lib/utils';
import { X, Check } from 'lucide-react';

// FDI tooth layout
// Upper: 18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
// Lower: 48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
const UPPER_LEFT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_RIGHT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_LEFT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_RIGHT = [31, 32, 33, 34, 35, 36, 37, 38];

const CONDITIONS: { value: ToothCondition; label: string; color: string; border: string }[] = [
  { value: 'healthy', label: 'Healthy', color: '#FFFFFF', border: '#CBD5E1' },
  { value: 'cavity', label: 'Cavity/Caries', color: '#FFE4E6', border: '#E11D48' },
  { value: 'crown', label: 'Crown/Restoration', color: '#E2E8F0', border: '#475569' },
  { value: 'missing', label: 'Missing/Extracted', color: '#F1F5F9', border: '#94A3B8' },
  { value: 'rct', label: 'Root Canal (RCT)', color: '#D1FAE5', border: '#059669' },
  { value: 'implant', label: 'Implant', color: '#F3E8FF', border: '#7C3AED' },
  { value: 'bridge', label: 'Bridge', color: '#E0E7FF', border: '#4F46E5' },
  { value: 'veneer', label: 'Veneer', color: '#E0F2FE', border: '#0284C7' },
  { value: 'fracture', label: 'Fracture', color: '#FEF3C7', border: '#D97706' },
];

const CONDITION_STYLES: Record<ToothCondition, { fill: string; stroke: string; label: string }> = {
  healthy: { fill: '#FFFFFF', stroke: '#CBD5E1', label: 'Healthy' },
  cavity: { fill: '#FFE4E6', stroke: '#E11D48', label: 'Cavity / Caries' },
  crown: { fill: '#E2E8F0', stroke: '#475569', label: 'Crown' },
  missing: { fill: '#F1F5F9', stroke: '#94A3B8', label: 'Missing' },
  rct: { fill: '#D1FAE5', stroke: '#059669', label: 'Root Canal (RCT)' },
  implant: { fill: '#F3E8FF', stroke: '#7C3AED', label: 'Implant' },
  bridge: { fill: '#E0E7FF', stroke: '#4F46E5', label: 'Bridge' },
  veneer: { fill: '#E0F2FE', stroke: '#0284C7', label: 'Veneer' },
  fracture: { fill: '#FEF3C7', stroke: '#D97706', label: 'Fracture' },
};

const FILL: Record<ToothCondition, string> = {
  healthy: '#FFFFFF',
  cavity: '#FFE4E6',
  crown: '#E2E8F0',
  missing: '#F1F5F9',
  rct: '#D1FAE5',
  implant: '#F3E8FF',
  bridge: '#E0E7FF',
  veneer: '#E0F2FE',
  fracture: '#FEF3C7',
};

const STROKE: Record<ToothCondition, string> = {
  healthy: '#CBD5E1',
  cavity: '#E11D48',
  crown: '#475569',
  missing: '#94A3B8',
  rct: '#059669',
  implant: '#7C3AED',
  bridge: '#4F46E5',
  veneer: '#0284C7',
  fracture: '#D97706',
};

const TOOTH_W = 28;
const TOOTH_H = 34;
const GAP = 4;

interface PopoverState {
  toothId: number;
  x: number;
  y: number;
}

interface OdontogramProps {
  teeth: ToothState[];
  onUpdate: (teeth: ToothState[]) => void;
  readOnly?: boolean;
}

function ToothShape({
  tooth,
  x,
  y,
  onClick,
}: {
  tooth: ToothState;
  x: number;
  y: number;
  onClick: (e: React.MouseEvent, id: number) => void;
}) {
  const fill = FILL[tooth.condition];
  const stroke = STROKE[tooth.condition];
  const isMissing = tooth.condition === 'missing';

  return (
    <g
      className="tooth-cell"
      style={{ transformOrigin: `${x + TOOTH_W / 2}px ${y + TOOTH_H / 2}px` }}
      onClick={(e) => onClick(e, tooth.id)}
    >
      <rect
        x={x}
        y={y}
        width={TOOTH_W}
        height={TOOTH_H}
        rx={5}
        ry={5}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
        opacity={isMissing ? 0.5 : 1}
      />
      {/* Inner surface lines for molars/premolars */}
      {!isMissing && (
        <>
          <line x1={x + 7} y1={y + 8} x2={x + TOOTH_W - 7} y2={y + 8} stroke={stroke} strokeWidth={0.5} opacity={0.4} />
          <line x1={x + 7} y1={y + TOOTH_H - 8} x2={x + TOOTH_W - 7} y2={y + TOOTH_H - 8} stroke={stroke} strokeWidth={0.5} opacity={0.4} />
        </>
      )}
      {/* Missing strikethrough */}
      {isMissing && (
        <>
          <line x1={x + 4} y1={y + 4} x2={x + TOOTH_W - 4} y2={y + TOOTH_H - 4} stroke="#94A3B8" strokeWidth={1.5} />
          <line x1={x + TOOTH_W - 4} y1={y + 4} x2={x + 4} y2={y + TOOTH_H - 4} stroke="#94A3B8" strokeWidth={1.5} />
        </>
      )}
      {/* RCT dot */}
      {tooth.condition === 'rct' && (
        <circle cx={x + TOOTH_W / 2} cy={y + TOOTH_H / 2} r={4} fill="#059669" opacity={0.7} />
      )}
      {/* Crown hash */}
      {tooth.condition === 'crown' && (
        <rect x={x + 5} y={y + 5} width={TOOTH_W - 10} height={TOOTH_H - 10} rx={2} fill="none" stroke="#475569" strokeWidth={0.75} strokeDasharray="2,2" />
      )}
      {/* Tooth number */}
      <text
        x={x + TOOTH_W / 2}
        y={y + TOOTH_H + 12}
        textAnchor="middle"
        fontSize={9}
        fill="#94A3B8"
        fontFamily="Inter, sans-serif"
      >
        {tooth.id}
      </text>
    </g>
  );
}

export default function Odontogram({ teeth, onUpdate, readOnly = false }: OdontogramProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [noteText, setNoteText] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getToothState = (id: number): ToothState =>
    teeth.find((t) => t.id === id) ?? { id, condition: 'healthy', notes: '' };

  const handleToothClick = (e: React.MouseEvent, id: number) => {
    if (readOnly) return;
    e.stopPropagation();
    const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!rect || !containerRect) return;
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;
    const tooth = getToothState(id);
    setNoteText(tooth.notes);
    setPopover({ toothId: id, x: clickX, y: clickY });
  };

  const applyCondition = (condition: ToothCondition) => {
    if (!popover) return;
    const updated = teeth.map((t) =>
      t.id === popover.toothId ? { ...t, condition, notes: noteText } : t
    );
    onUpdate(updated);
    setPopover(null);
  };

  const closePopover = () => setPopover(null);

  // Dismiss on outside click
  useEffect(() => {
    const handler = () => setPopover(null);
    if (popover) {
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }
  }, [popover]);

  // Build rows
  const upperRow = [...UPPER_LEFT, ...UPPER_RIGHT];
  const lowerRow = [...LOWER_LEFT, ...LOWER_RIGHT];
  const totalWidth = 16 * (TOOTH_W + GAP) - GAP + 40; // 16 teeth + padding
  const svgWidth = totalWidth;
  const svgHeight = 2 * TOOTH_H + 60 + 20; // 2 rows + labels + gap

  const startX = 20;
  const upperY = 16;
  const lowerY = upperY + TOOTH_H + 32;

  return (
    <div ref={containerRef} className="relative select-none">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {CONDITIONS.map((c) => (
          <div key={c.value} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded"
              style={{ background: c.color, border: `1.5px solid ${c.border}` }}
            />
            <span className="text-[11px] text-slate-500">{c.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block"
        >
          {/* Upper row label */}
          <text x={startX} y={upperY - 4} fontSize={9} fill="#94A3B8" fontFamily="Inter, sans-serif">
            Upper (Maxillary)
          </text>

          {/* Center divider */}
          <line
            x1={startX + 8 * (TOOTH_W + GAP) - GAP / 2 - 2}
            y1={upperY - 2}
            x2={startX + 8 * (TOOTH_W + GAP) - GAP / 2 - 2}
            y2={upperY + TOOTH_H + 2}
            stroke="#E2E8F0"
            strokeWidth={1.5}
            strokeDasharray="3,2"
          />

          {/* Upper teeth */}
          {upperRow.map((id, i) => (
            <ToothShape
              key={id}
              tooth={getToothState(id)}
              x={startX + i * (TOOTH_W + GAP)}
              y={upperY}
              onClick={handleToothClick}
            />
          ))}

          {/* Mid gum line */}
          <line
            x1={startX}
            y1={upperY + TOOTH_H + 18}
            x2={startX + 16 * (TOOTH_W + GAP) - GAP}
            y2={upperY + TOOTH_H + 18}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
          <text x={startX} y={upperY + TOOTH_H + 28} fontSize={8} fill="#CBD5E1" fontFamily="Inter, sans-serif">
            ← Right · · · · · · · · · Left →
          </text>

          {/* Lower row label */}
          <text x={startX} y={lowerY - 4} fontSize={9} fill="#94A3B8" fontFamily="Inter, sans-serif">
            Lower (Mandibular)
          </text>

          {/* Lower teeth */}
          {lowerRow.map((id, i) => (
            <ToothShape
              key={id}
              tooth={getToothState(id)}
              x={startX + i * (TOOTH_W + GAP)}
              y={lowerY}
              onClick={handleToothClick}
            />
          ))}

          {/* Center divider lower */}
          <line
            x1={startX + 8 * (TOOTH_W + GAP) - GAP / 2 - 2}
            y1={lowerY - 2}
            x2={startX + 8 * (TOOTH_W + GAP) - GAP / 2 - 2}
            y2={lowerY + TOOTH_H + 2}
            stroke="#E2E8F0"
            strokeWidth={1.5}
            strokeDasharray="3,2"
          />
        </svg>
      </div>

      {/* Popover */}
      {popover && (
        <div
          className="absolute z-50 bg-white rounded-xl border border-slate-200 shadow-lg w-56 p-3"
          style={{
            left: Math.min(popover.x, (containerRef.current?.clientWidth ?? 500) - 224),
            top: popover.y + 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-slate-700">
              Tooth #{popover.toothId}
            </p>
            <button
              onClick={closePopover}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 mb-3">
            {CONDITIONS.map((c) => {
              const current = getToothState(popover.toothId).condition;
              const isSelected = current === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => applyCondition(c.value)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12px] transition-colors text-left',
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  <div
                    className="w-3.5 h-3.5 rounded shrink-0"
                    style={{ background: c.color, border: `1.5px solid ${c.border}` }}
                  />
                  {c.label}
                  {isSelected && <Check className="w-3 h-3 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Notes */}
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add notes..."
            rows={2}
            className="w-full text-[11px] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
          <button
            onClick={() => {
              const current = getToothState(popover.toothId);
              applyCondition(current.condition);
            }}
            className="mt-2 w-full bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-medium py-1.5 rounded-lg transition-colors"
          >
            Save Notes
          </button>
        </div>
      )}

      {!readOnly && (
        <p className="text-[11px] text-slate-400 mt-3">
          Click any tooth to apply a condition or add clinical notes.
        </p>
      )}
    </div>
  );
}
