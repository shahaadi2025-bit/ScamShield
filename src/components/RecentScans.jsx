import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArchiveX
} from 'lucide-react';

export default function RecentScans({ 
  scans = [], 
  onSelectScan, 
  onDeleteScan, 
  onClearAll, 
  familyGuard 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter scans based on user search
  const filteredScans = scans.filter((scan) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      scan.text.toLowerCase().includes(q) ||
      scan.riskLevel.toLowerCase().includes(q) ||
      (scan.detectedTactics && scan.detectedTactics.some(t => t.toLowerCase().includes(q)))
    );
  });

  if (!scans || scans.length === 0) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">No Saved Scans Yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Whenever you analyze a message or screenshot, it will be safely archived here in your local browser history for review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-extrabold text-white tracking-tight ${familyGuard ? 'text-xl' : 'text-base sm:text-lg'}`}>
              Recent Scans History
            </h3>
            <p className="text-xs text-slate-400">
              Saved securely on this device ({scans.length} {scans.length === 1 ? 'record' : 'records'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-900/50 transition-colors whitespace-nowrap"
            title="Clear all saved history"
          >
            <ArchiveX className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Scans List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredScans.map((scan) => {
          const isDanger = scan.riskLevel === 'Critical Danger';
          const isSuspicious = scan.riskLevel === 'Suspicious';

          return (
            <div
              key={scan.id}
              className="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60 text-xs">
                  <span className="font-mono text-[11px] text-slate-500">
                    {scan.formattedTime || scan.timestamp}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    isDanger
                      ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                      : isSuspicious
                        ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                  }`}>
                    {scan.riskScore}/100 {scan.riskLevel}
                  </span>
                </div>

                {/* Message preview snippet */}
                <p className={`text-slate-300 line-clamp-3 leading-relaxed ${
                  familyGuard ? 'text-base font-medium' : 'text-xs'
                }`}>
                  {scan.text}
                </p>

                {/* Detected Tactics Preview */}
                {scan.detectedTactics && scan.detectedTactics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {scan.detectedTactics.slice(0, 2).map((tactic, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800"
                      >
                        {tactic}
                      </span>
                    ))}
                    {scan.detectedTactics.length > 2 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{scan.detectedTactics.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => onSelectScan(scan)}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-examine</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteScan(scan.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
