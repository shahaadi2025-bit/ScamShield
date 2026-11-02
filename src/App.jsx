import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingHero from './components/LandingHero';
import InputPanel from './components/InputPanel';
import ResultsView from './components/ResultsView';
import EmergencyHub from './components/EmergencyHub';
import RecentScans from './components/RecentScans';
import DailySecurityInsight from './components/DailySecurityInsight';
import Galaxy from './components/Galaxy';
import { analyzeFraudMessage } from './services/analyzer';
import { storageService } from './services/storage';
import { notificationService } from './services/notifications';
import { ShieldCheck, ShieldAlert, Zap, Lock, BellRing, ArrowLeft, ArrowRight } from 'lucide-react';

// Pre-defined quick scenario templates for landing page launch
const SCENARIO_TEXTS = {
  arrest: 'URGENT NOTICE: CBI Officer Cyber Crime Cell Delhi. A narcotics consignment sent under your Aadhaar has been intercepted at Mumbai Airport. A non-bailable arrest warrant is issued by Supreme Court. Join Skype interrogation immediately to avoid digital arrest. Call Officer Sharma: +91 9823145670.',
  upi: 'Dear Customer, your SBI YONO account will be permanently BLOCKED tonight within 2 hours due to pending KYC verification. Update your PAN card immediately by downloading the official support app: http://bit.ly/sbi-kyc-update.apk',
  electricity: 'Dear Consumer, your electricity power will be cut tonight at 9:30 PM from electricity power office because your previous month bill was unpaid. Immediately call our electricity official Mr. Verma at 9876543210.',
  safe: 'Dear Customer, INR 2,500.00 credited to your A/C XX4821 on 01-Nov-2026 by UPI Ref No 430612984512. Available Bal: INR 18,450.00. Bank NEVER asks for OTP or PIN. Never share confidential details with anyone.'
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'scanner'
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [familyGuard, setFamilyGuard] = useState(false);
  const [scansHistory, setScansHistory] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Initialize scans from local storage & notification state
  useEffect(() => {
    const saved = storageService.getScans();
    if (saved && saved.length > 0) {
      setScansHistory(saved);
      setAnalysisResult(saved[0]);
      setInputText(saved[0].text);
    } else {
      const initialText = SCENARIO_TEXTS.arrest;
      setInputText(initialText);
      const initialResult = analyzeFraudMessage(initialText);
      setAnalysisResult(initialResult);
      const updated = storageService.saveScan({
        text: initialText,
        ...initialResult
      });
      setScansHistory(updated);
    }

    if (notificationService.isSupported()) {
      setNotificationPermission(notificationService.getPermission());
    }
  }, []);

  // Handle analyzing current message using RAG pipeline
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(async () => {
      let result = null;
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText })
        });
        if (response.ok) {
          result = await response.json();
        }
      } catch {
        // Fallback to client-side RAG Vector Engine
      }

      if (!result) {
        result = analyzeFraudMessage(inputText);
      }

      setAnalysisResult(result);
      setIsAnalyzing(false);

      // Trigger high-priority browser notification and emergency audio chime on Critical Danger
      // This will immediately pop up even if the tab is minimized or in the background!
      if (result.riskLevel === 'Critical Danger') {
        notificationService.sendCriticalAlert(result, inputText);
      }

      const updatedHistory = storageService.saveScan({
        text: inputText,
        ...result
      });
      setScansHistory(updatedHistory);

      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  };

  // Launch scanner directly with a specific scenario from the landing page
  const handleSelectSampleFromLanding = (type) => {
    const text = SCENARIO_TEXTS[type] || SCENARIO_TEXTS.arrest;
    setInputText(text);
    const result = analyzeFraudMessage(text);
    setAnalysisResult(result);
    setCurrentView('scanner');

    if (result.riskLevel === 'Critical Danger') {
      notificationService.sendCriticalAlert(result, text);
    }
  };

  const handleSelectScan = (scanItem) => {
    setInputText(scanItem.text);
    const result = analyzeFraudMessage(scanItem.text);
    setAnalysisResult(result);
    setCurrentView('scanner');

    const resultsElement = document.getElementById('results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeleteScan = (id) => {
    const updated = storageService.deleteScan(id);
    setScansHistory(updated);
  };

  const handleClearAllScans = () => {
    if (window.confirm('Are you sure you want to clear your local scan history?')) {
      const empty = storageService.clearAll();
      setScansHistory(empty);
    }
  };

  return (
    <div className={`min-h-screen bg-[#070b14] text-slate-100 transition-colors flex flex-col selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden ${
      familyGuard ? 'family-guard-active font-medium' : ''
    }`}>
      {/* Full-screen Interactive Galaxy Background from React Bits */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <Galaxy
          density={0.65}
          glowIntensity={0.3}
          flareIntensity={0.7}
          starSpeed={0.25}
          starColors={['#f59e0b', '#fbbf24', '#f43f5e', '#818cf8']}
          mouseRepulsion
          clickWarp
          transparent
        />
      </div>

      {/* Royal Header with View Navigation & Notification Status */}
      <Header 
        familyGuard={familyGuard} 
        setFamilyGuard={setFamilyGuard} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        {/* VIEW 1: OPENING LANDING PAGE (Featuring Dynamic Fluid Cyber Motherboard Image) */}
        {currentView === 'landing' ? (
          <LandingHero
            onLaunchScanner={() => setCurrentView('scanner')}
            onSelectSample={handleSelectSampleFromLanding}
          />
        ) : (
          /* VIEW 2: CLEAN, FOCUSED LIVE SCANNER DASHBOARD (Image moved out to opening page) */
          <div className="space-y-8 animate-fadeIn">
            {/* Top Workspace Breadcrumb & Return CTA */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Opening Portal</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-400">
                  LIVE SENTINEL WORKSPACE
                </span>
              </div>
            </div>

            {/* Notification Permission Banner if not yet allowed */}
            {notificationPermission === 'default' && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      Enable Minimized Background Threat Alerts
                    </span>
                    <span className="text-amber-300/90">
                      Allow browser notifications to stay alerted of Critical Danger scams even when this tab is minimized.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const res = await notificationService.requestPermission();
                    setNotificationPermission(res);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold whitespace-nowrap shadow-sm self-start sm:self-center"
                >
                  Enable Alerts Now
                </button>
              </div>
            )}

            {/* Daily Security Insight Card (Rotating Indian Cyber Threat Prevention Tips from RAG Knowledge Base) */}
            <section aria-label="Daily Cyber Security Insight">
              <DailySecurityInsight familyGuard={familyGuard} />
            </section>

            {/* Input Interface: Text Paste / Voice Dictation / Screenshot OCR */}
            <section aria-label="Fraud Input Panel">
              <InputPanel
                inputText={inputText}
                setInputText={setInputText}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                familyGuard={familyGuard}
              />
            </section>

            {/* Results & Threat Analysis Section (PDF Export, Audio Readout, and RAG Grounding) */}
            {analysisResult && (
              <section id="results-section" aria-label="Threat Analysis Results" className="scroll-mt-24">
                <ResultsView 
                  result={analysisResult} 
                  rawMessage={inputText}
                  familyGuard={familyGuard} 
                />
              </section>
            )}

            {/* Indian Cyber Fraud Emergency Hub (1930 Helpline) */}
            <section aria-label="Cyber Fraud Emergency Hub">
              <EmergencyHub result={analysisResult} familyGuard={familyGuard} />
            </section>

            {/* Recent Scans Persistent History */}
            <section aria-label="Recent Scans History">
              <RecentScans
                scans={scansHistory}
                onSelectScan={handleSelectScan}
                onDeleteScan={handleDeleteScan}
                onClearAll={handleClearAllScans}
                familyGuard={familyGuard}
              />
            </section>
          </div>
        )}
      </main>

      {/* Royal Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>ScamShield · Real-Time Fraud Message & Threat Detector</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <button
              onClick={() => setCurrentView('landing')}
              className="hover:text-amber-400 transition-colors"
            >
              Opening Portal
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentView('scanner')}
              className="hover:text-amber-400 transition-colors"
            >
              Live Scanner
            </button>
            <span>·</span>
            <span>Helpline 1930 Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
