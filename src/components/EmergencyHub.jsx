import React, { useState } from 'react';
import { 
  PhoneCall, 
  ExternalLink, 
  Share2, 
  Check, 
  AlertOctagon, 
  Clock, 
  ShieldAlert, 
  Landmark
} from 'lucide-react';

export default function EmergencyHub({ result, familyGuard }) {
  const [copiedShare, setCopiedShare] = useState(false);

  // Share threat alert with family via Web Share API or Clipboard
  const handleShare = async () => {
    const threatScore = result ? result.riskScore : 'High';
    const threatLevel = result ? result.riskLevel : 'Suspicious';
    const explanation = result ? result.simpleExplanation : 'Potential cyber scam detected.';

    const shareTitle = '⚠️ Urgent Scam Alert - ScamShield';
    const shareText = `⚠️ Scam Alert for Family & Friends:\nI just checked a suspicious message using ScamShield. It was flagged as [${threatLevel} - ${threatScore}/100 Danger].\n\nReason: ${explanation}\n\nImportant: Do not share OTP/PIN, and dial 1930 immediately if money was transferred.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl border border-rose-900/50 p-6 sm:p-8 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/30 to-amber-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
            <ShieldAlert className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                National Cyber Crime Protocol
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-mono font-bold">
                24x7 Active
              </span>
            </div>
            <h3 className={`font-black tracking-tight text-white ${familyGuard ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              Government Cyber Fraud Emergency Hub
            </h3>
          </div>
        </div>

        {/* Share Warning Button */}
        <button
          type="button"
          onClick={handleShare}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all shadow-md ${
            copiedShare
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700'
          } ${familyGuard ? 'text-base sm:text-lg py-3.5 px-6' : 'text-xs sm:text-sm'}`}
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied Warning Alert!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Share Warning with Family</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Emergency Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1930 Helpline Button */}
        <a
          href="tel:1930"
          className={`group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-xl shadow-rose-950/60 transition-all ${
            familyGuard ? 'p-6 ring-4 ring-rose-400/40' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-rose-200 block">
                Toll-Free National Helpline
              </span>
              <span className={`font-black tracking-tight block ${familyGuard ? 'text-3xl' : 'text-2xl'}`}>
                Dial 1930
              </span>
              <span className="text-xs text-rose-100">
                Direct Indian Cyber Crime Coordination Centre (I4C)
              </span>
            </div>
          </div>
          <span className="text-xs font-bold bg-white/20 px-3.5 py-1.5 rounded-xl whitespace-nowrap">
            Call 1930
          </span>
        </a>

        {/* Cybercrime.gov.in Portal */}
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-white border border-slate-700/80 transition-all shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ExternalLink className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block">
                Official Cyber Crime Portal
              </span>
              <span className={`font-black tracking-tight block text-amber-300 ${familyGuard ? 'text-2xl' : 'text-xl'}`}>
                cybercrime.gov.in
              </span>
              <span className="text-xs text-slate-400">
                Register cyber complaint & trace FIR status
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-300 border border-slate-700 px-3.5 py-1.5 rounded-xl whitespace-nowrap group-hover:border-amber-400 transition-colors">
            Visit Portal
          </span>
        </a>
      </div>

      {/* Golden Hour Rule & Key Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>The "Golden Hour" Protocol</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Report fraudulent transactions to 1930 within <strong className="text-white">2 hours</strong>. Law enforcement can freeze beneficiary bank accounts before the money is withdrawn at ATMs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <Landmark className="w-4 h-4" />
            <span>Instant Banking Freeze</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Immediately call your bank's toll-free number or open your netbanking app to lock debit/credit cards and disable UPI transfers if you entered an MPIN.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <AlertOctagon className="w-4 h-4" />
            <span>Chakshu Portal (DoT)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Report suspicious SMS senders, fraudulent calls, and WhatsApp extortion numbers on the Department of Telecommunications' Chakshu facility at sancharsaathi.gov.in.
          </p>
        </div>
      </div>
    </div>
  );
}
