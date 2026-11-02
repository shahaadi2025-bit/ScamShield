/**
 * ScamShield Local Storage History Service
 * Provides robust persistent storage for recent scans across browser sessions.
 */

const STORAGE_KEY = 'scamshield_recent_scans_v2';
const MAX_SCANS = 25;

export const storageService = {
  /**
   * Retrieves all saved scans from localStorage
   * @returns {Array} Array of scan objects
   */
  getScans: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('Failed to read scans from localStorage:', err);
      return [];
    }
  },

  /**
   * Saves a new scan to the top of the history list
   * @param {Object} scanData - The scan result and message data
   * @returns {Array} Updated array of scans
   */
  saveScan: (scanData) => {
    try {
      const existing = storageService.getScans();
      
      const newScan = {
        id: scanData.id || `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: scanData.timestamp || new Date().toISOString(),
        formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
        text: (scanData.text || '').trim(),
        riskScore: typeof scanData.riskScore === 'number' ? scanData.riskScore : (scanData.score || 0),
        riskLevel: scanData.riskLevel || scanData.level || 'Safe',
        detectedTactics: scanData.detectedTactics || [],
        simpleExplanation: scanData.simpleExplanation || '',
        actionSteps: scanData.actionSteps || [],
        entities: scanData.entities || { urls: [], phones: [], upis: [], apks: [] },
        source: scanData.source || 'text' // 'text' | 'screenshot' | 'dictation'
      };

      // Filter out duplicate if same text was just scanned
      const filtered = existing.filter(item => item.text !== newScan.text);
      const updated = [newScan, ...filtered].slice(0, MAX_SCANS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.warn('Failed to save scan to localStorage:', err);
      return [];
    }
  },

  /**
   * Deletes a specific scan by its ID
   * @param {string} id - Scan unique ID
   * @returns {Array} Updated array of scans
   */
  deleteScan: (id) => {
    try {
      const existing = storageService.getScans();
      const updated = existing.filter(scan => scan.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.warn('Failed to delete scan from localStorage:', err);
      return [];
    }
  },

  /**
   * Clears all scans from localStorage
   */
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    } catch (err) {
      console.warn('Failed to clear scans from localStorage:', err);
      return [];
    }
  }
};
