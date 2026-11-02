import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Radio, 
  Scan, 
  Layers, 
  Eye, 
  Maximize2, 
  Info,
  Database,
  Lock,
  PhoneCall
} from 'lucide-react';

const NODES = [
  {
    id: 'core',
    title: 'I4C Quantum Core',
    category: 'Neural Threat Analysis',
    status: 'ONLINE',
    x: 50, // % from left
    y: 50, // % from top
    metric: '96% Match Accuracy',
    desc: 'Processes queries through 6 official Indian Cybercrime Coordination Centre (I4C) vector indices.'
  },
  {
    id: 'apk',
    title: 'APK Decompiler Sentinel',
    category: 'Malware & RAT Detection',
    status: 'ACTIVE',
    x: 80,
    y: 28,
    metric: 'Zero-Day Signature Match',
    desc: 'Audits unverified .apk links for SMS read permissions and AnyDesk screen-sharing exploits.'
  },
  {
    id: 'upi',
    title: 'NPCI UPI Gateway Shield',
    category: 'Payment Protection',
    status: 'ARMED',
    x: 22,
    y: 65,
    metric: 'MPIN Harvesting Guard',
    desc: 'Detects spoofed collect requests and QR deception based on NPCI Circular 118/2024.'
  },
  {
    id: 'radar',
    title: 'VoIP Digital Arrest Scanner',
    category: 'Extortion Filter',
    status: 'SCANNING',
    x: 72,
    y: 72,
    metric: 'VoIP Intercept Shield',
    desc: 'Flags fake police video interrogations and fraudulent judicial summons in real time.'
  },
  {
    id: 'telemetry',
    title: '1930 Emergency Uplink',
    category: 'National Cyber Crime Portal',
    status: 'CONNECTED',
    x: 28,
    y: 24,
    metric: 'Golden Hour Gateway',
    desc: 'Direct dispatch channel to law enforcement for rapid interbank account freezing.'
  }
];

export default function CyberCoreVisualizer({ 
  isAnalyzing = false, 
  riskLevel = 'Safe', 
  riskScore = 0,
  familyGuard = false 
}) {
  const [activeNode, setActiveNode] = useState(NODES[0]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  // Smooth 3D perspective mouse tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Number((y * -14).toFixed(2)),
      y: Number((x * 14).toFixed(2))
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const isDanger = riskLevel === 'Critical Danger';
  const isSuspicious = riskLevel === 'Suspicious';

  // State color mapping
  const glowColor = isAnalyzing 
    ? 'rgba(245, 158, 11, 0.7)' // Amber pulse
    : isDanger 
      ? 'rgba(244, 63, 94, 0.85)' // Alert Crimson
      : isSuspicious 
        ? 'rgba(245, 158, 11, 0.65)' 
        : 'rgba(6, 182, 212, 0.65)'; // Cyan blue

  return (
    <div className={`relative rounded-3xl border border-cyan-900/40 bg-slate-950/90 shadow-2xl backdrop-blur-xl overflow-hidden transition-all ${
      expanded ? 'col-span-full' : ''
    }`}>
      {/* Top Cyber Command Bar */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between gap-4 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
            <Cpu className="w-4 h-4 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-300 font-mono">
                Cyber Defense Neural Core
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                isDanger
                  ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                  : isAnalyzing
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700 animate-pulse'
                    : 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
              }`}>
                {isAnalyzing ? 'DEEP SCAN IN PROGRESS' : isDanger ? 'THREAT CONTAINMENT' : 'REAL-TIME SENTINEL ACTIVE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Dynamic Neural Circuitry // I4C Grounded Telemetry Matrix
            </p>
          </div>
        </div>

        {/* Telemetry quick stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span className="text-slate-500">LATENCY:</span>
            <span className="text-cyan-400 font-bold">12ms</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span className="text-slate-500">VECTORS:</span>
            <span className="text-amber-400 font-bold">6 INDEXED</span>
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={expanded ? 'Minimize view' : 'Expand full visualizer'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Circuit Display Canvas */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-[380px] sm:min-h-[480px] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none cursor-crosshair"
        style={{ perspective: '1100px' }}
      >
        {/* Dynamic High-Tech Motherboard Image Container with 3D Tilt */}
        <div 
          className="relative max-w-[340px] sm:max-w-[420px] w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
            boxShadow: `0 0 50px ${glowColor}, 0 20px 40px rgba(0,0,0,0.8)`
          }}
        >
          {/* Base Cybernetic Circuit Image */}
          <img
            src="/assets/aistudio/image_802fcaa8.png"
            alt="ScamShield Cyber Defense Motherboard Core"
            className={`w-full h-auto object-cover transition-all duration-700 ${
              isDanger 
                ? 'hue-rotate-[290deg] saturate-150 brightness-110' 
                : isAnalyzing 
                  ? 'hue-rotate-[45deg] saturate-125' 
                  : 'saturate-125'
            }`}
          />

          {/* Sweeping Laser Scanline */}
          <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] animate-cyber-scan pointer-events-none" />

          {/* Holographic Radar Sweep Ring centered at processor core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyan-400/30 pointer-events-none">
            <div className="w-full h-full rounded-full border-t-2 border-cyan-300 animate-radar-sweep opacity-75" />
          </div>

          {/* Central Pulsing Quantum Processor Core Overlay */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center pointer-events-none">
            <div className={`w-16 h-16 rounded-full border-2 ${
              isDanger ? 'border-rose-500' : 'border-cyan-400'
            } animate-pulse-core`} />
          </div>

          {/* Dynamic Interactive Hotspot Nodes */}
          {NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveNode(node)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                {/* Ping wave */}
                <span className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                  isSelected ? 'bg-amber-400' : 'bg-cyan-400'
                }`} />

                {/* Core Node Marker */}
                <div className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center shadow-md transition-all ${
                  isSelected 
                    ? 'bg-amber-400 border-white scale-125 shadow-amber-400/80' 
                    : 'bg-slate-950 border-cyan-400 group-hover:scale-125 group-hover:border-white shadow-cyan-400/50'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-cyan-300'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating Active Node Telemetry Card Overlay */}
        {activeNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-xs z-30 p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase">
                  {activeNode.category}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {activeNode.status}
              </span>
            </div>

            <h4 className="text-sm font-black text-white font-sans">
              {activeNode.title}
            </h4>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeNode.desc}
            </p>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">TELEMETRY:</span>
              <span className="text-amber-400 font-bold">{activeNode.metric}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live System Integrity Footer */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            GROUNDING: I4C / NPCI ONLINE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">ENCRYPTION: AES-GCM-256</span>
        </div>

        <span className="text-[11px] text-cyan-400/80">
          * Interactive HUD: Move pointer to tilt circuit matrix. Click glowing nodes to inspect subsystem telemetry.
        </span>
      </div>
    </div>
  );
}
