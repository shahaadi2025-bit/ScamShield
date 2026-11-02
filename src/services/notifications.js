/**
 * ScamShield Browser Notification & Audio Alert Service
 * Triggers high-priority OS/browser notifications and emergency audio chimes
 * on 'Critical Danger' detection, even when the browser tab is minimized or in the background.
 */

export const notificationService = {
  /**
   * Checks whether the browser supports the Notification API
   */
  isSupported: () => {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * Returns current notification permission state
   * @returns {'granted' | 'denied' | 'default' | 'unsupported'}
   */
  getPermission: () => {
    if (!notificationService.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  /**
   * Requests permission from the user to display notifications
   */
  requestPermission: async () => {
    if (!notificationService.isSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return Notification.permission;
    }
  },

  /**
   * Plays a high-priority emergency audio alert chime via Web Audio API.
   * Works in the background even if OS notifications are silenced.
   */
  playEmergencyChime: () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Dual-tone urgent alert pattern (880Hz -> 587Hz)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(587, now + 0.15);
      osc1.frequency.setValueAtTime(880, now + 0.3);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.5);
    } catch {
      // AudioContext may be restricted by autoplay policy
    }
  },

  /**
   * Triggers a system notification for a Critical Danger scan result
   * @param {Object} result - Scan analysis output
   * @param {string} rawText - Original suspicious message
   */
  sendCriticalAlert: async (result, rawText = '') => {
    // Play background audio chime immediately
    notificationService.playEmergencyChime();

    if (!notificationService.isSupported()) return false;

    // Check if permission is granted
    if (Notification.permission !== 'granted') {
      // If default, attempt to request
      if (Notification.permission === 'default') {
        try {
          const perm = await Notification.requestPermission();
          if (perm !== 'granted') return false;
        } catch {
          return false;
        }
      } else {
        return false;
      }
    }

    const score = result?.riskScore || 90;
    const explanation = result?.simpleExplanation || 'High-risk cyber fraud attempt detected.';
    const tactics = (result?.detectedTactics || []).slice(0, 2).join(', ');

    const title = `🚨 CRITICAL SCAM DETECTED (${score}/100 Threat)`;
    const body = `${explanation}\n\nTactics: ${tactics || 'Extortion / Phishing'}\nDo NOT send money or share OTP. Dial 1930 immediately.`;

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'scamshield-critical-threat',
        requireInteraction: true, // Remains on screen even if tab is minimized
        silent: false,
        vibrate: [300, 150, 300, 150, 400]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (err) {
      console.warn('Failed to display browser notification:', err);
      return false;
    }
  },

  /**
   * Dispatches a test alert notification so the user can verify background notifications work
   */
  sendTestAlert: async () => {
    return notificationService.sendCriticalAlert({
      riskScore: 98,
      riskLevel: 'Critical Danger',
      simpleExplanation: 'TEST NOTIFICATION: ScamShield background alerts are active and working!',
      detectedTactics: ['Test Simulation', 'Background Detection']
    });
  }
};
