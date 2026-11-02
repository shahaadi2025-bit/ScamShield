import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  CheckCircle2, 
  Link2, 
  Phone, 
  Download, 
  ShieldCheck, 
  Info,
  FileDown,
  BellRing,
  Check,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import RiskMeter from './RiskMeter';
import { exportAnalysisAsPDF } from '../services/pdfExporter';

export default function ResultsView({ result, rawMessage = '', familyGuard }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [expandedVectorIndex, setExpandedVectorIndex] = useState(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!result) return null;

  const {
    riskScore = 0,
    riskLevel = 'Safe',
    detectedTactics = [],
    simpleExplanation = '',
    actionSteps = [],
    entities = { urls: [], phones: [], upis: [], apks: [] },
    matchedRules = [],
    retrievedVectors = [],
    factCheckedGrounding = null
  } = result;

  const handleToggleSpeech = () => {
    if (!speechSupported) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();

      const speechText = `ScamShield Grounded Threat Assessment. Danger level: ${riskLevel}. Threat score: ${riskScore} out of 100. ${simpleExplanation}. Immediate instructions: ${actionSteps.join('. ')}. Helpline 1930 is active for assistance.`;

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = familyGuard ? 0.88 : 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      exportAnalysisAsPDF(result, rawMessage);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3500);
    } catch (err) {
      console.error('Error generating PDF evidence summary:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const isDanger = riskLevel === 'Critical Danger';
  const isSuspicious = riskLevel === 'Suspicious';

  return (
    <div className="space-y-6">
      {/* Background Notification Alert Bar for Critical Danger */}
      {isDanger && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border border-rose-800/80 flex items-center justify-between gap-3 text-xs text-rose-200 shadow-lg">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
            <span>
              <strong className="text-white">Critical Threat Alert Triggered:</strong> Active background browser notification sent to warn you even if you minimize this tab.
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700 font-bold">
            1930 PRIORITY
          </span>
        </div>
      )}

      {/* Top Split: Risk Meter & Senior Citizen Voice Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Risk Gauge */}
        <div className="lg:col-span-5 flex flex-col">
          <RiskMeter 
            score={riskScore} 
            level={riskLevel} 
            familyGuard={familyGuard} 
            grounding={factCheckedGrounding}
          />
        </div>

        {/* Right Column: Senior Explanation Box with Audio Readout & PDF Export */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl shadow-black/20">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${
                  isDanger ? 'bg-rose-500' : isSuspicious ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <h3 className={`font-extrabold text-white tracking-tight ${familyGuard ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
                  Family & Senior Safety Summary
                </h3>
              </div>

              {/* Action Buttons: Audio Readout & PDF Export */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all shadow-md ${
                    pdfDownloaded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-400/50'
                  } ${familyGuard ? 'text-sm sm:text-base py-2.5 px-4' : 'text-xs'}`}
                  title="Export official PDF Evidence Summary for police or records"
                >
                  {pdfDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Evidence Downloaded</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Export PDF Evidence</span>
                    </>
                  )}
                </button>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleToggleSpeech}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all shadow-md ${
                      isPlayingAudio
                        ? 'bg-rose-600 text-white animate-pulse shadow-rose-950/60'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                    } ${familyGuard ? 'text-sm sm:text-base py-2.5 px-4' : 'text-xs'}`}
                    title="Listen in voice readout"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>🔊 Listen in Audio</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Explanation card */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isDanger 
                ? 'bg-rose-950/30 border-rose-800/80 text-rose-100'
                : isSuspicious
                  ? 'bg-amber-950/30 border-amber-800/80 text-amber-100'
                  : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-100'
            }`}>
              <p className={`font-semibold leading-relaxed ${
                familyGuard ? 'text-xl sm:text-2xl font-bold leading-normal' : 'text-sm sm:text-base'
              }`}>
                {simpleExplanation}
              </p>
            </div>
          </div>

          {/* Quick takeaway tip */}
          <div className="mt-5 pt-3 border-t border-slate-800/90 flex items-center justify-between gap-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Verified via National Cybercrime Advisories. Real law enforcement never interrogates or arrests via video calls.
              </span>
            </div>
            <button
              type="button"
              onClick={handleExportPDF}
              className="text-[11px] font-semibold text-amber-400 hover:underline shrink-0"
            >
              Save PDF Evidence →
            </button>
          </div>
        </div>
      </div>

      {/* RAG VECTOR KNOWLEDGE: FACT-CHECKED GROUNDING SECTION */}
      {factCheckedGrounding && (
        <div className="bg-slate-900/90 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                    Fact-Checked Grounding
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                    Verified Source
                  </span>
                </div>
                <h3 className={`font-bold text-white ${familyGuard ? 'text-lg sm:text-xl' : 'text-base'}`}>
                  {factCheckedGrounding.source}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-slate-400">
                Citation: <strong className="text-amber-300">{factCheckedGrounding.citation}</strong>
              </span>
              <span className="font-mono text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                {factCheckedGrounding.relevancePercentage || 96}% Vector Match
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Official Advisory Directive:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-500/80 pl-3">
              "{factCheckedGrounding.content}"
            </p>
          </div>

          {/* Top-3 Retrieved Threat Vectors Drawer */}
          {retrievedVectors.length > 1 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 block mb-2">
                Top Retrieved Threat Vectors from Vector Store ({retrievedVectors.length}):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {retrievedVectors.map((vector, i) => (
                  <div
                    key={vector.id}
                    onClick={() => setExpandedVectorIndex(expandedVectorIndex === i ? null : i)}
                    className="p-3 rounded-xl bg-slate-950/50 hover:bg-slate-950 border border-slate-800/70 hover:border-amber-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-amber-400">{vector.citation}</span>
                      <span className="text-[10px] font-mono text-slate-500">{vector.relevancePercentage || 90}% Match</span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold line-clamp-1">
                      {vector.title}
                    </p>
                    {expandedVectorIndex === i && (
                      <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800 leading-normal">
                        {vector.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detected Tactics & Red Flags */}
      <div className="bg-slate-900/90 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h3 className={`font-extrabold text-white tracking-tight ${familyGuard ? 'text-xl' : 'text-base sm:text-lg'}`}>
              Detected Deception Tactics & Red Flags
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {detectedTactics.length} {detectedTactics.length === 1 ? 'indicator' : 'indicators'} detected
          </span>
        </div>

        {detectedTactics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detectedTactics.map((tactic, idx) => {
              const matched = matchedRules.find(r => r.tactic === tactic);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border bg-slate-950/50 border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-3.5"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <h4 className={`font-bold text-white ${familyGuard ? 'text-lg' : 'text-sm'}`}>
                      {tactic}
                    </h4>
                    <p className={`mt-1 text-slate-400 ${familyGuard ? 'text-base font-medium' : 'text-xs'}`}>
                      {matched?.explanation || 'Coercive social engineering tactic intended to trigger panic or compliance.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/60 text-emerald-300 text-sm font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>No deceptive threat triggers or malicious coercion tactics detected in this text.</span>
          </div>
        )}

        {/* Extracted Artifacts */}
        {(entities.urls.length > 0 || entities.phones.length > 0 || entities.apks.length > 0) && (
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Identified Scam Contact Points & Files:
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {entities.apks.map((apk, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 text-rose-200 font-mono font-bold border border-rose-800"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>MALICIOUS FILE: {apk}</span>
                </span>
              ))}

              {entities.urls.map((url, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-mono border border-slate-700"
                >
                  <Link2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[260px]">{url}</span>
                </span>
              ))}

              {entities.phones.map((phone, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-mono border border-slate-700"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{phone}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Immediate Action Steps */}
      <div className="bg-slate-900/90 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className={`font-extrabold text-white tracking-tight ${familyGuard ? 'text-xl' : 'text-base sm:text-lg'}`}>
              Immediate Action Checklist
            </h3>
          </div>
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF Checklist</span>
          </button>
        </div>

        <div className="space-y-3">
          {actionSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl flex items-start gap-3.5 border bg-slate-950/60 border-slate-800"
            >
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className={`font-semibold text-slate-200 ${
                familyGuard ? 'text-lg leading-relaxed font-bold' : 'text-sm'
              }`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
