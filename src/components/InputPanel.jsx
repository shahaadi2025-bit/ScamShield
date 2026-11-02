import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  UploadCloud, 
  Sparkles, 
  Trash2, 
  ClipboardCheck, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mic,
  MicOff,
  AlertCircle
} from 'lucide-react';
import { createWorker } from 'tesseract.js';

// Pre-packaged realistic sample messages
const SAMPLES = [
  {
    id: 'arrest',
    title: '🚨 Digital Arrest Threat',
    category: 'CBI / Police Coercion',
    text: 'URGENT NOTICE: CBI Officer Cyber Crime Cell Delhi. A narcotics consignment sent under your Aadhaar has been intercepted at Mumbai Airport. A non-bailable arrest warrant is issued by Supreme Court. Join Skype interrogation immediately to avoid digital arrest. Call Officer Sharma: +91 9823145670.'
  },
  {
    id: 'upi',
    title: '💸 UPI / Bank Freeze',
    category: 'Banking KYC Phishing',
    text: 'Dear Customer, your SBI YONO account will be permanently BLOCKED tonight within 2 hours due to pending KYC verification. Update your PAN card immediately by downloading the official support app: http://bit.ly/sbi-kyc-update.apk'
  },
  {
    id: 'job',
    title: '💼 Fake Job / Telegram Trap',
    category: 'High-Yield Task Fraud',
    text: 'Earn Rs. 3500 to 5000 daily from home! Just like YouTube videos and write hotel reviews. No experience required. Daily instant payouts to your UPI. Contact our Telegram agent @priya_hr_tasks right now to claim your Rs. 500 joining bonus!'
  },
  {
    id: 'electricity',
    title: '⚡ Electricity Cutoff Panic',
    category: 'Utility Disconnection',
    text: 'Dear Consumer, your electricity power will be cut tonight at 9:30 PM from electricity power office because your previous month bill was unpaid. Immediately call our electricity official Mr. Verma at 9876543210.'
  },
  {
    id: 'lottery',
    title: '🎁 KBC Lucky Draw',
    category: 'Advance Fee Fraud',
    text: 'CONGRATULATIONS!! You have won Rs. 25,00,000 in KBC All India WhatsApp Lucky Draw. To claim your prize money, contact KBC Manager Rana Pratap on WhatsApp +91 9123456789 with your lottery code KBC-7890. Deposit Rs 12,500 tax processing fee.'
  },
  {
    id: 'safe',
    title: '✅ Legitimate Bank Alert',
    category: 'Verified Safe Notice',
    text: 'Dear Customer, INR 2,500.00 credited to your A/C XX4821 on 01-Nov-2026 by UPI Ref No 430612984512. Available Bal: INR 18,450.00. Bank NEVER asks for OTP or PIN. Never share confidential details with anyone.'
  }
];

// Pre-designed realistic scam screenshots for 1-click OCR testing
const SAMPLE_SCREENSHOTS = [
  {
    id: 'ocr-arrest',
    title: 'Police Arrest Threat Notice',
    text: 'CYBER POLICE NOTICE: Narcotics parcel intercepted. Arrest warrant issued. Contact CBI Officer at +91 9876543210 immediately.'
  },
  {
    id: 'ocr-kyc',
    title: 'SBI YONO KYC Warning',
    text: 'SBI ALERT: Account suspended within 24 hours. Click link to download yono-kyc.apk: http://bit.ly/sbi-update'
  },
  {
    id: 'ocr-power',
    title: 'Electricity Disconnection Notice',
    text: 'Electricity will be disconnected tonight 9:30 PM. Call officer at 9811223344 to verify bill immediately.'
  }
];

export default function InputPanel({ 
  inputText, 
  setInputText, 
  onAnalyze, 
  isAnalyzing, 
  familyGuard 
}) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'screenshot'
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const fileInputRef = useRef(null);

  // Speech Recognition (Dictation) states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English accents

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        let finalTranscripts = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscripts += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscripts) {
          setInputText((prev) => (prev ? `${prev.trim()} ${finalTranscripts.trim()}` : finalTranscripts.trim()));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [setInputText]);

  // Toggle voice dictation
  const handleToggleVoiceDictation = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      setSpeechError('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Error starting speech recognition:', err);
      }
    }
  };

  // Quick paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
      }
    } catch {
      // Fallback
    }
  };

  // Perform client-side OCR using Tesseract.js
  const processImageFile = async (file) => {
    if (!file) return;

    setOcrLoading(true);
    setOcrProgress(5);
    setOcrStatusText('Initializing Optical Character Engine...');

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
            setOcrStatusText(`Reading text from screenshot... ${Math.round(m.progress * 100)}%`);
          } else if (m.status) {
            setOcrStatusText(m.status.replace(/_/g, ' '));
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const cleanedText = (text || '').trim();
      if (cleanedText) {
        setInputText(cleanedText);
        setOcrStatusText('Text extracted successfully!');
      } else {
        setOcrStatusText('No legible text found in image. Please try another screenshot.');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setOcrStatusText('Error reading screenshot. You can also paste or dictate the message.');
    } finally {
      setOcrLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Load sample pre-fill
  const handleSelectSample = (sample) => {
    setInputText(sample.text);
  };

  // Load sample screenshot into canvas and run OCR
  const handleSelectSampleScreenshot = (sample) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Draw phone-like background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 600, 300);
    
    // Header
    ctx.fillStyle = '#131b2e';
    ctx.fillRect(0, 0, 600, 50);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Messages · Real-time Alert', 20, 30);
    
    // Message bubble
    ctx.fillStyle = '#1e293b';
    ctx.roundRect(20, 70, 560, 190, 12);
    ctx.fill();
    
    // Text inside
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px sans-serif';
    
    const words = sample.text.split(' ');
    let line = '';
    let y = 110;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 520 && n > 0) {
        ctx.fillText(line, 40, y);
        line = words[n] + ' ';
        y += 28;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 40, y);

    canvas.toBlob((blob) => {
      if (blob) {
        processImageFile(blob);
      }
    }, 'image/png');
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl shadow-black/20 overflow-hidden transition-all">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-950/70 p-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'text'
              ? 'bg-slate-800 text-white shadow-md shadow-black/30 border border-slate-700/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          } ${familyGuard ? 'text-base sm:text-lg py-3.5' : ''}`}
        >
          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Paste or Dictate Message</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('screenshot')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'screenshot'
              ? 'bg-slate-800 text-white shadow-md shadow-black/30 border border-slate-700/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          } ${familyGuard ? 'text-base sm:text-lg py-3.5' : ''}`}
        >
          <ImageIcon className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Upload Screenshot (OCR)</span>
        </button>
      </div>

      <div className="p-5 sm:p-7 space-y-5">
        {/* TAB 1: PASTE OR DICTATE TEXT */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* Control Bar above textarea */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-300">
                Suspicious SMS, WhatsApp, or Telegram message:
              </span>

              <div className="flex items-center gap-2.5">
                {/* Voice Dictation (Web Speech API) */}
                <button
                  type="button"
                  onClick={handleToggleVoiceDictation}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-900/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
                  }`}
                  title={isListening ? 'Click to stop voice dictation' : 'Click to dictate message using microphone'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Listening... (Click to Stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dictate with Voice</span>
                    </>
                  )}
                </button>

                {/* Paste Clipboard */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors font-semibold"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden xs:inline">Paste</span>
                </button>

                {/* Clear */}
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Voice Listening Banner */}
            {isListening && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-amber-950/50 border border-rose-800/60 flex items-center justify-between gap-3 text-xs text-rose-200 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold">
                    Microphone is listening... Speak the scam message clearly into your device.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleVoiceDictation}
                  className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-[11px]"
                >
                  Done
                </button>
              </div>
            )}

            {/* Error Message */}
            {speechError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Clean, Non-overlapping Textarea */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={familyGuard ? 6 : 5}
                placeholder="Paste or dictate suspicious message here... e.g. 'Your electricity will be cut tonight at 9:30 PM. Call officer at 9876543210'"
                className={`w-full rounded-2xl border p-4 sm:p-5 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-amber-500/80 transition-all ${
                  familyGuard
                    ? 'text-lg sm:text-xl leading-relaxed border-2 border-slate-700'
                    : 'text-sm sm:text-base border-slate-800'
                }`}
              />
            </div>

            {/* Clean bottom status line (No overlapping text) */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Supports English, Hindi transliteration, and regional scam formats</span>
              <span className="font-mono text-slate-400 tabular-nums">{inputText.length} characters</span>
            </div>

            {/* Sample Pre-fill Scenarios */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Test Scenarios:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 rounded-xl text-left bg-slate-800/70 hover:bg-slate-800 text-slate-200 border border-slate-700/70 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
                  >
                    <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {sample.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD SCREENSHOT */}
        {activeTab === 'screenshot' && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/70 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0])}
              />

              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h4 className="text-sm font-bold text-slate-200">
                Drop your WhatsApp or SMS screenshot here
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Optical Character Recognition (OCR) runs securely in your browser. No image data leaves your computer.
              </p>
              <button
                type="button"
                className="mt-3.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
              >
                Browse Images
              </button>
            </div>

            {/* OCR Progress Indicator */}
            {ocrLoading && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {ocrStatusText}
                  </span>
                  <span className="font-mono">{ocrProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Extracted Text Box after OCR */}
            {inputText && activeTab === 'screenshot' && !ocrLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Extracted Message Text (Editable):
                  </span>
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="text-slate-400 hover:text-rose-400 font-medium"
                  >
                    Clear Text
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-800 p-3.5 bg-slate-950/70 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/80"
                />
              </div>
            )}

            {/* 1-Click Simulated Screenshot Demo */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-2">
                Or test OCR with simulated scam screenshots:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_SCREENSHOTS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSampleScreenshot(sample)}
                    disabled={ocrLoading}
                    className="p-3 rounded-xl text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-200">
                      {sample.title}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {sample.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scan / Analyze Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 hidden sm:block">
            {inputText ? 'Ready for deep threat intelligence analysis' : 'Enter, dictate, or upload a message above'}
          </p>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            className={`w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold transition-all shadow-lg ${
              inputText.trim() && !isAnalyzing
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 active:scale-[0.99] shadow-rose-950/50'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            } ${familyGuard ? 'text-lg py-4 px-9' : 'text-sm'}`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Evaluating Patterns...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 stroke-[2.3]" />
                <span>Analyze Fraud Threat Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
