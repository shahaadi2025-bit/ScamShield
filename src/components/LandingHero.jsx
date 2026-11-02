import React, { useState, useRef } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ArrowRight, 
  PhoneCall, 
  FileText, 
  FileDown, 
  Mic, 
  CheckCircle2, 
  Radio, 
  Database,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import SpiralFunnel from './SpiralFunnel';
import DailySecurityInsight from './DailySecurityInsight';

const NODES = [
  {
    id: 'core',
    title: 'I4C Quantum Core',
    category: 'Neural Threat Analysis',
    status: 'ONLINE',
    x: 50,
    y: 50,
    metric: '96% Match Accuracy',
    desc: 'Processes messages through 6 official Indian Cybercrime Coordination Centre (I4C) vector indices.'
  },
  {
    id: 'apk',
    title: 'APK Decompiler Sentinel',
    category: 'Malware & RAT Detection',
    status: 'ACTIVE',
    x: 80,
    y: 28,
    metric: 'Zero-Day Signature Match',
    desc: 'Audits unverified .apk links for SMS read permissions and AnyDesk remote access exploits.'
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

export default function LandingHero({ onLaunchScanner, onSelectSample }) {
  const [activeNode, setActiveNode] = useState(NODES[0]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Smooth 3D tilt tracking for the cyber core image
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

  return (
    <div className="space-y-16 py-6 sm:py-12">
      {/* Hero Opening Split: Headline & Dynamic Cyber Core Motherboard */}
      <section className="relative rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Ambient SpiralFunnel Vortex in background */}
        <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none">
          <SpiralFunnel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Column: Opening Copy & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-inner">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>National Cyber Threat Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Scam<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">Shield</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-slate-300 font-extrabold mt-2">
                Real-Time Fraud & Extortion Message Detector
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl">
              Defend your family against coercive <strong>"Digital Arrest"</strong> threats, fake UPI bank freezes, power disconnection panic, and malicious APK downloads. Powered by client-side OCR, voice dictation, and official Indian Cybercrime Coordination Centre (I4C) vector manuals.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onLaunchScanner}
                className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-rose-950/50 hover:shadow-rose-900/70 active:scale-[0.98] transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.4]" />
                <span>Launch Cyber Scanner</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href="tel:1930"
                className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-800/60 font-bold text-sm transition-all shadow-md"
              >
                <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Cyber Helpline 1930</span>
              </a>
            </div>

            {/* Quick Test Badges */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Test Verified Threat Scenarios:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onSelectSample('arrest')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400/50 transition-colors"
                >
                  🚨 Digital Arrest
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample('upi')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400/50 transition-colors"
                >
                  💸 UPI Bank Freeze
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample('electricity')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400/50 transition-colors"
                >
                  ⚡ Power Cutoff
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample('safe')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-400/50 transition-colors"
                >
                  ✅ Legitimate Bank SMS
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Fluid Cyber Core Motherboard Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[340px] sm:max-w-[380px] select-none cursor-crosshair"
              style={{ perspective: '1100px' }}
            >
              {/* Outer Cyber Glow Frame */}
              <div 
                className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out border border-cyan-500/30 bg-slate-950"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
                  boxShadow: '0 0 55px rgba(6, 182, 212, 0.4), 0 25px 50px rgba(0,0,0,0.9)'
                }}
              >
                {/* Image Asset */}
                <img
                  src="/assets/aistudio/image_802fcaa8.png"
                  alt="ScamShield Cyber Defense Motherboard Core"
                  className="w-full h-auto object-cover saturate-125"
                />

                {/* Sweeping Laser Scanline */}
                <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] animate-cyber-scan pointer-events-none" />

                {/* Rotating Radar Sweep Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-cyan-400/30 pointer-events-none">
                  <div className="w-full h-full rounded-full border-t-2 border-cyan-300 animate-radar-sweep opacity-75" />
                </div>

                {/* Central Pulsing Quantum Processor Ring */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-400 animate-pulse-core" />
                </div>

                {/* Interactive Hotspot Nodes */}
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
                      <span className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                        isSelected ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />
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
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-left">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[11px] font-mono">
                    <span className="font-bold text-cyan-300 uppercase">{activeNode.category}</span>
                    <span className="font-bold text-emerald-400">{activeNode.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans">{activeNode.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">{activeNode.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cyber Defense Real-Time Telemetry Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Target Prevention</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-sans tabular-nums">₹1,750+ Cr</p>
          <span className="text-[11px] text-slate-500 block">Reported cyber losses in India</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">National Helpline</span>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 font-sans tabular-nums">1930</p>
          <span className="text-[11px] text-slate-500 block">24x7 I4C direct interbank freeze</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Grounded Vectors</span>
          <p className="text-2xl sm:text-3xl font-black text-cyan-400 font-sans tabular-nums">6 Manuals</p>
          <span className="text-[11px] text-slate-500 block">I4C, NPCI & CERT-In indexed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg space-y-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Audit Latency</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans tabular-nums">&lt; 15ms</p>
          <span className="text-[11px] text-slate-500 block">On-device neural inference</span>
        </div>
      </section>

      {/* Rotating Daily Threat Prevention Tip Sourced from RAG Vector Knowledge Base */}
      <section aria-label="Daily Cyber Threat Insight" className="text-left">
        <DailySecurityInsight />
      </section>

      {/* Core Defense Pillars Showcase */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Comprehensive Cyber Defense Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Engineered to safeguard citizens and senior family members before financial loss occurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Fact-Checked RAG Grounding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every message is matched against official I4C Digital Arrest advisories and NPCI directives, citing exact government manual clauses with zero hallucination.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Background Minimized Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              HTML5 Notification API and dual-tone emergency audio chimes warn users immediately when Critical Danger is detected, even if the browser tab is minimized.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileDown className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">PDF Forensic Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly export formal Cyber Incident Evidence Reports formatted for filing online complaints on cybercrime.gov.in, police FIRs, or bank fraud disputes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
