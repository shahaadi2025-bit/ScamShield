import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  HeartHandshake, 
  PhoneCall, 
  Volume2, 
  Shield, 
  Bell, 
  BellOff, 
  BellRing,
  LayoutDashboard,
  Home,
  CheckCircle2
} from 'lucide-react';
import { notificationService } from '../services/notifications';

export default function Header({ 
  familyGuard, 
  setFamilyGuard,
  currentView = 'landing',
  setCurrentView
}) {
  const [notificationState, setNotificationState] = useState('default');
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setNotificationState(notificationService.getPermission());
  }, []);

  const handleRequestNotification = async () => {
    const res = await notificationService.requestPermission();
    setNotificationState(res);
    if (res === 'granted') {
      await notificationService.sendTestAlert();
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleTestAlert = async () => {
    await notificationService.sendTestAlert();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div 
          onClick={() => setCurrentView && setCurrentView('landing')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-600 to-indigo-950 p-[1px] shadow-md shadow-rose-950/50 shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400 stroke-[2.3]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Scam<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Shield</span>
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 tracking-wide">
                Active Cyber Defense
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight hidden xs:block">
              Real-Time Scam Detection & Indian Cyber Protection
            </p>
          </div>
        </div>

        {/* Center View Switcher (Landing Opening vs Live Scanner) */}
        {setCurrentView && (
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'landing'
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Opening Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('scanner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'scanner'
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Live Scanner</span>
            </button>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Alert Status & Test Action */}
          {notificationService.isSupported() && (
            <button
              type="button"
              onClick={notificationState === 'granted' ? handleTestAlert : handleRequestNotification}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                testSent
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600 animate-pulse'
                  : notificationState === 'granted'
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-emerald-900/60'
                    : notificationState === 'denied'
                      ? 'bg-slate-800/60 text-slate-500 border border-slate-800'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border border-amber-400 shadow-md shadow-amber-500/20'
              }`}
              title={
                notificationState === 'granted'
                  ? 'Click to send a test alert (works when tab is minimized)'
                  : 'Enable background critical threat notifications'
              }
            >
              {testSent ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Alert Sent!</span>
                </>
              ) : notificationState === 'granted' ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Alerts Active</span>
                </>
              ) : notificationState === 'denied' ? (
                <>
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Alerts Blocked</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                  <span>Enable Alerts</span>
                </>
              )}
            </button>
          )}

          {/* Quick 1930 Helpline Button */}
          <a
            href="tel:1930"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 hover:border-rose-700 transition-all shadow-sm"
            title="Call National Cyber Crime Reporting Helpline 1930"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="hidden xs:inline">Helpline</span>
            <span className="font-mono text-rose-200 font-extrabold">1930</span>
          </a>

          {/* Family Guard Accessibility Mode */}
          <button
            type="button"
            onClick={() => setFamilyGuard(!familyGuard)}
            aria-pressed={familyGuard}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              familyGuard
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300/60 shadow-amber-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80'
            }`}
          >
            <HeartHandshake className={`w-4 h-4 ${familyGuard ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400'}`} />
            <span className="whitespace-nowrap">
              {familyGuard ? 'Family Guard ON' : 'Family Guard'}
            </span>
          </button>
        </div>
      </div>

      {/* Accessible Family Guard Banner */}
      {familyGuard && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-inner">
          <Volume2 className="w-4 h-4 text-slate-950 shrink-0" />
          <span>Family Guard Enabled: High-contrast visibility, magnified typography, and voice assistance.</span>
        </div>
      )}
    </header>
  );
}
