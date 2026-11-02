import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Award } from 'lucide-react';

export default function RiskMeter({ score = 0, level = 'Safe', familyGuard = false, grounding = null }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorTheme = {
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-800/60',
    ring: 'stroke-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: ShieldCheck,
    label: 'SAFE TRANSACTION'
  };

  if (level === 'Critical Danger') {
    colorTheme = {
      text: 'text-rose-400',
      bg: 'bg-rose-950/20',
      border: 'border-rose-800/60',
      ring: 'stroke-rose-500',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: ShieldAlert,
      label: 'CRITICAL THREAT'
    };
  } else if (level === 'Suspicious') {
    colorTheme = {
      text: 'text-amber-400',
      bg: 'bg-amber-950/20',
      border: 'border-amber-800/60',
      ring: 'stroke-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
      label: 'SUSPICIOUS SIGNAL'
    };
  }

  const StatusIcon = colorTheme.icon;

  const radius = 85;
  const halfCircumference = Math.PI * radius;
  const strokeDashoffset = halfCircumference - (halfCircumference * normalizedScore) / 100;
  const needleRotation = -90 + (normalizedScore / 100) * 180;

  return (
    <div className={`h-full flex flex-col items-center justify-between p-6 sm:p-7 rounded-3xl border backdrop-blur-md shadow-xl transition-all ${colorTheme.bg} ${colorTheme.border}`}>
      {/* Top Header Label */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-5 h-5 ${colorTheme.text} stroke-[2.3]`} />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
            RAG Scam Score Meter
          </span>
        </div>
        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${colorTheme.badge}`}>
          {level}
        </span>
      </div>

      {/* SVG Semi-Circle Dial */}
      <div className="relative w-full max-w-[260px] pt-4 flex flex-col items-center">
        <div className="w-64 h-36 relative overflow-hidden flex items-end justify-center">
          <svg
            viewBox="0 0 240 135"
            className="w-full h-full transform transition-all duration-700"
          >
            <defs>
              <linearGradient id="royalGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Background Track Arc */}
            <path
              d="M 35 115 A 85 85 0 0 1 205 115"
              fill="none"
              stroke="#1e293b"
              strokeWidth="18"
              strokeLinecap="round"
            />

            {/* Active Gradient Arc */}
            <path
              d="M 35 115 A 85 85 0 0 1 205 115"
              fill="none"
              stroke="url(#royalGaugeGradient)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={halfCircumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />

            {/* Pivot Accent Circle */}
            <circle cx="120" cy="115" r="9" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
            <circle cx="120" cy="115" r="4" fill="#f59e0b" />

            {/* Animated Needle */}
            <g
              transform={`rotate(${needleRotation} 120 115)`}
              className="transition-transform duration-1000 ease-out"
            >
              <line
                x1="120"
                y1="115"
                x2="120"
                y2="40"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="40" r="4.5" fill="#f43f5e" />
            </g>
          </svg>
        </div>

        {/* Digital Score Readout */}
        <div className="mt-2 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className={`font-black tracking-tight tabular-nums text-white ${
              familyGuard ? 'text-5xl' : 'text-4xl'
            }`}>
              {normalizedScore}
            </span>
            <span className="text-base font-bold text-slate-400">%</span>
          </div>

          <div className="mt-1">
            <span className={`inline-block font-extrabold uppercase tracking-wide px-3.5 py-1 rounded-xl border ${colorTheme.badge} ${
              familyGuard ? 'text-sm' : 'text-xs'
            }`}>
              {colorTheme.label}
            </span>
          </div>

          {/* Fact-Checked Grounding Citation Badge */}
          {grounding && (
            <div className="mt-2.5 flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[210px] font-mono font-bold">
                Grounding: {grounding.citation}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Meter Scale Legend */}
      <div className="w-full flex items-center justify-between pt-4 mt-2 border-t border-slate-800/80 text-[11px] font-bold">
        <span className="text-emerald-400">0% Safe</span>
        <span className="text-amber-400">50% Caution</span>
        <span className="text-rose-400">100% Critical</span>
      </div>
    </div>
  );
}
