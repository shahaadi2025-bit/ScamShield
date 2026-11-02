/**
 * ScamShield PDF Evidence Summary Generator
 * Generates an executive-grade Cyber Incident Evidence Report using jsPDF
 * suitable for police FIR complaints, bank disputes, or family documentation.
 */
import { jsPDF } from 'jspdf';

export function exportAnalysisAsPDF(result, rawMessage = '') {
  if (!result) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = 18;

  // Header Banner Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent line
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(0, 37, pageWidth, 1.5, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SCAMSHIELD CYBER INCIDENT EVIDENCE SUMMARY', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('National Cyber Threat Intelligence & Forensic Documentation Record', margin, 23);

  // Reference Code & Date
  const reportId = `SS-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(251, 191, 36); // amber-400
  doc.text(`REPORT ID: ${reportId}`, pageWidth - margin - 45, 23);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'normal');
  doc.text(`DATE: ${dateStr}`, pageWidth - margin - 45, 29);

  y = 48;

  // Threat Level Verdict Box
  const isDanger = result.riskLevel === 'Critical Danger';
  const isSuspicious = result.riskLevel === 'Suspicious';

  if (isDanger) {
    doc.setFillColor(254, 242, 242); // rose-50
    doc.setDrawColor(225, 29, 72); // rose-600
  } else if (isSuspicious) {
    doc.setFillColor(254, 243, 199); // amber-50
    doc.setDrawColor(217, 119, 6); // amber-600
  } else {
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(16, 185, 129); // emerald-500
  }

  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  // Verdict text inside box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (isDanger) {
    doc.setTextColor(190, 18, 60); // rose-700
    doc.text('VERDICT: CRITICAL FRAUD THREAT DETECTED', margin + 6, y + 9);
  } else if (isSuspicious) {
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text('VERDICT: HIGHLY SUSPICIOUS MESSAGE', margin + 6, y + 9);
  } else {
    doc.setTextColor(4, 120, 87); // emerald-700
    doc.text('VERDICT: VERIFIED SAFE / LOW RISK', margin + 6, y + 9);
  }

  // Score readout
  doc.setFontSize(14);
  doc.text(`${result.riskScore || 0} / 100`, pageWidth - margin - 28, y + 10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('THREAT SCORE', pageWidth - margin - 29, y + 15);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Jurisdiction: Helpline 1930 (I4C) · Assessment Confidence: ${result.confidence || 94}%`,
    margin + 6,
    y + 17
  );

  y += 32;

  // SECTION 1: Forensic Message Transcript
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. SUSPICIOUS MESSAGE TRANSCRIPT (EVIDENCE)', margin, y);
  y += 4;

  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);

  const messageText = (rawMessage || result.text || 'No message text recorded').trim();
  const splitMessage = doc.splitTextToSize(`"${messageText}"`, contentWidth - 12);
  const transcriptBoxHeight = Math.min(36, splitMessage.length * 4.5 + 8);

  doc.roundedRect(margin, y, contentWidth, transcriptBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(splitMessage.slice(0, 7), margin + 6, y + 7);

  y += transcriptBoxHeight + 8;

  // SECTION 2: Identified Deception Tactics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DETECTED DECEPTION TACTICS & RED FLAGS', margin, y);
  y += 5;

  const tactics = result.detectedTactics && result.detectedTactics.length > 0 
    ? result.detectedTactics 
    : ['No standard fraud indicators identified'];

  tactics.forEach((tactic) => {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'FD');

    doc.setFillColor(225, 29, 72); // red dot
    doc.circle(margin + 4, y + 3.5, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(tactic, margin + 8, y + 4.8);
    y += 9;
  });

  y += 2;

  // SECTION 3: Extracted Digital Artifacts
  const entities = result.entities || { urls: [], phones: [], upis: [], apks: [] };
  const hasArtifacts = 
    entities.urls?.length > 0 || 
    entities.phones?.length > 0 || 
    entities.apks?.length > 0 || 
    entities.upis?.length > 0;

  if (hasArtifacts) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('3. EXTRACTED DIGITAL ARTIFACTS', margin, y);
    y += 5;

    let artifactLines = [];
    if (entities.apks?.length > 0) {
      artifactLines.push(`[MALICIOUS APK]: ${entities.apks.join(', ')}`);
    }
    if (entities.phones?.length > 0) {
      artifactLines.push(`[PHONE / SENDER]: ${entities.phones.join(', ')}`);
    }
    if (entities.urls?.length > 0) {
      artifactLines.push(`[LINKS DETECTED]: ${entities.urls.join(', ')}`);
    }
    if (entities.upis?.length > 0) {
      artifactLines.push(`[UPI HANDLES]: ${entities.upis.join(', ')}`);
    }

    artifactLines.forEach((art) => {
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(225, 29, 72);
      doc.text(art, margin + 4, y);
      y += 5;
    });
    y += 3;
  }

  // SECTION 4: Senior Citizen & Family Safety Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('4. PLAIN-LANGUAGE SAFETY SUMMARY', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const explanationLines = doc.splitTextToSize(
    result.simpleExplanation || 'Exercise extreme caution before taking any action.',
    contentWidth
  );
  doc.text(explanationLines, margin, y);
  y += explanationLines.length * 4.5 + 4;

  // SECTION 5: Immediate Recommended Actions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('5. IMMEDIATE ACTION CHECKLIST FOR VICTIMS / FAMILIES', margin, y);
  y += 5;

  const actions = result.actionSteps || [
    'Do not click any link or download APK files.',
    'Do not share passwords, MPIN, or bank OTP.',
    'Call Cyber Helpline 1930 to freeze unauthorized transactions.'
  ];

  actions.slice(0, 4).forEach((act, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}.`, margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const actLines = doc.splitTextToSize(act, contentWidth - 10);
    doc.text(actLines, margin + 8, y);
    y += actLines.length * 4 + 2;
  });

  // Emergency Helpline Callout Strip at Bottom
  const bottomBoxY = pageHeight - 32;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, bottomBoxY, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(225, 29, 72);
  doc.text('NATIONAL CYBER HELPLINE: DIAL 1930 (24x7 TOLL-FREE)', margin + 6, bottomBoxY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'File formal complaint online at cybercrime.gov.in · Report numbers on sancharsaathi.gov.in (Chakshu)',
    margin + 6,
    bottomBoxY + 12
  );

  // Footer note
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This summary document is generated by ScamShield AI Engine for evidence retention under IT Act, 2000.',
    margin,
    pageHeight - 6
  );

  // Save the PDF
  const filename = `ScamShield_Evidence_${reportId}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
