import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Award, 
  Sparkles, 
  Shuffle, 
  ExternalLink 
} from 'lucide-react';
import { KNOWLEDGE_BASE } from '../services/ragEngine';

export default function DailySecurityInsight({ familyGuard = false }) {
  // Compute initial daily tip index based on date
  const getDayIndex = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dayOfYear % KNOWLEDGE_BASE.length;
  };

  const [currentIndex, setCurrentIndex] = useState(getDayIndex());
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentTip = KNOWLEDGE_BASE[currentIndex] || KNOWLEDGE_BASE[0];

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setCurrentIndex((prev) => (prev + 1) % KNOWLEDGE_BASE.length);
  };

  const handlePrev = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setCurrentIndex((prev) => (prev - 1 + KNOWLEDGE_BASE.length) % KNOWLEDGE_BASE.length);
  };

  const handleShuffle = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * KNOWLEDGE_BASE.length);
    } while (nextIdx === currentIndex && KNOWLEDGE_BASE.length > 1);
    setCurrentIndex(nextIdx);
  };

  const handleCopy = async () => {
    const textToCopy = `🛡️ Daily Cyber Security Insight (${currentTip.source}):\n\n📌 ${currentTip.title}\n\n${currentTip.content}\n\nOfficial Citation: ${currentTip.citation}\nReport cyber fraud on Helpline 1930 or cybercrime.gov.in`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `🛡️ Security Tip: ${currentTip.title}`,
      text: `Important Cyber Safety Advisory from ${currentTip.source}:\n\n${currentTip.content}\n\nCitation: ${currentTip.citation}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();

      const text = `Daily Cyber Security Insight. ${currentTip.title}. Source: ${currentTip.source}. Directive: ${currentTip.content}. Advisory reference: ${currentTip.citation}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = familyGuard ? 0.88 : 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-xl backdrop-blur-xl text-slate-100 overflow-hidden">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Lightbulb className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">
                Daily Security Insight
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                RAG Sourced
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tip {currentIndex + 1} of {KNOWLEDGE_BASE.length} · Sourced from official Indian cyber manuals
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Readout */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`p-2 rounded-xl text-xs font-bold transition-all border ${
              isPlayingAudio
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title={isPlayingAudio ? 'Stop audio' : 'Listen to tip audio'}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Shuffle Tip */}
          <button
            type="button"
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Random security tip"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous / Next buttons */}
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Previous tip"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Next tip"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tip Body */}
      <div className="relative z-10 py-5 space-y-3.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-amber-300 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            {currentTip.category}
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Citation: <strong className="text-slate-300">{currentTip.citation}</strong>
          </span>
        </div>

        <h3 className={`font-black text-white tracking-tight ${
          familyGuard ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
        }`}>
          {currentTip.title}
        </h3>

        {/* Fact-Checked Directive Quote */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-slate-300 text-xs sm:text-sm leading-relaxed border-l-4 border-l-amber-500">
          <p className="italic">
            "{currentTip.content}"
          </p>
        </div>
      </div>

      {/* Card Footer: Authority Seal & Sharing Actions */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Verified Authority: <strong className="text-slate-200">{currentTip.source}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors font-bold text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Tip</span>
              </>
            )}
          </button>

          {/* Share with Family Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-950" />
            <span>Share with Family</span>
          </button>
        </div>
      </div>
    </div>
  );
}
