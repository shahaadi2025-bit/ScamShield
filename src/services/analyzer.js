/**
 * ScamShield RAG-Augmented Fraud Analysis Engine
 * Combines Indian Cyber Crime Knowledge Vectors with Rule Patterns & Entity Extraction.
 */
import { searchKnowledgeBaseVectors } from './ragEngine';

// Heuristic rule patterns
const PATTERN_RULES = [
  {
    id: 'DIGITAL_ARREST',
    tactic: 'Digital Arrest Threat',
    severity: 88,
    regex: /(digital arrest|supreme court|cbi officer|narcotics control|ncb|customs department|police commissioner|arrest warrant|money laundering case|illegal consignment|passport seized|skype interrogation|virtual courtroom)/i,
    explanation: 'Scammers are impersonating law enforcement officers. Indian police NEVER place individuals under digital arrest or demand money via video calls.',
    actionStep: 'Immediately disconnect the call. Do not join video calls. Report to 1930.'
  },
  {
    id: 'ELECTRICITY_DISCONNECT',
    tactic: 'Utility Disconnection Scam',
    severity: 82,
    regex: /(electricity will be disconnected|power will be cut|disconnection tonight|bill unpaid.*call officer|update bill status|contact electricity official)/i,
    explanation: 'Scammers threaten power cutoffs to cause panic. Power distribution boards never use personal 10-digit mobile numbers for bill payments.',
    actionStep: 'Never call personal phone numbers given in the message. Check your official electricity provider portal.'
  },
  {
    id: 'BANK_KYC_SUSPEND',
    tactic: 'Fake Bank KYC / Account Block',
    severity: 82,
    regex: /(account (will be |is )?(suspended|blocked|frozen)|kyc (expired|pending|mandatory)|pan card not linked|sbi yono|hdfc netbanking blocked|update pan immediately)/i,
    explanation: 'Banks never threaten immediate account suspension over SMS or send direct web links to update PAN or Aadhaar.',
    actionStep: 'Never click the link. Visit your physical bank branch or open the official verified banking mobile app.'
  },
  {
    id: 'MALICIOUS_APK',
    tactic: 'Malicious APK Distribution',
    severity: 92,
    regex: /(\.apk|download app from link|install yono\.apk|install support app|update-app\.link)/i,
    explanation: 'The message is urging you to download an unverified APK file. This is malware designed to steal OTPs and empty bank accounts.',
    actionStep: 'DO NOT download or install any file ending in .apk from messages. Delete the link immediately.'
  },
  {
    id: 'REMOTE_ACCESS_APP',
    tactic: 'Remote Device Takeover',
    severity: 95,
    regex: /(anydesk|teamviewer|rustdesk|quicksupport|airdroid|screen share)/i,
    explanation: 'Scammers ask you to install screen-sharing apps so they can view your phone screen, capture OTPs, and control your device.',
    actionStep: 'Never install AnyDesk or screen-sharing tools on instructions from an unknown caller.'
  },
  {
    id: 'PART_TIME_JOB',
    tactic: 'Telegram Task / Part-Time Job Scam',
    severity: 78,
    regex: /(work from home|like youtube videos|earn (rs\.?|inr|₹)\s?[0-9,]{3,6} daily|telegram agent|hotel review job|prepaid task|guaranteed daily income)/i,
    explanation: 'Fake job offer promising easy money for liking videos or rating hotels. They will eventually demand "prepaid task deposits" and steal your money.',
    actionStep: 'Never pay money to get a job. Block the sender and report the Telegram account.'
  },
  {
    id: 'LOTTERY_REWARD',
    tactic: 'Lottery / Lucky Draw Fraud',
    severity: 70,
    regex: /(kbc lucky draw|congratulations.*won (rs\.?|inr|₹|lakh|crore)|lottery prize|claim reward points|won iphone|claim cashback)/i,
    explanation: 'Promises of unexpected lottery or lucky draw winnings are fraudulent attempts to solicit "processing fees" or banking passwords.',
    actionStep: 'You cannot win a lottery you never entered. Ignore and delete the message.'
  },
  {
    id: 'CREDENTIAL_HARVESTING',
    tactic: 'Credential & OTP Harvesting',
    severity: 85,
    regex: /(share otp|send 6[- ]digit pin|enter (mpin|atm pin|cvv)|verify password|provide netbanking credentials)/i,
    explanation: 'Direct attempt to steal your confidential passwords, MPIN, or bank OTP. No legitimate authority will ever ask for this.',
    actionStep: 'Never share OTP, MPIN, or password with ANYONE, even if they claim to be a bank manager or police.'
  },
  {
    id: 'URGENCY_TRIGGER',
    tactic: 'Urgency & Fear Trigger',
    severity: 65,
    regex: /(immediately|within (1|2|12|24) hours|strictly within|last warning|final notice|tonight at \d{1,2}|action will be taken|legal notice)/i,
    explanation: 'Creates false panic and a false ticking clock so you act before consulting your family or bank.',
    actionStep: 'Slow down. Scammers rely on rushed decisions. Consult a trusted family member first.'
  },
  {
    id: 'SUSPICIOUS_LINKS',
    tactic: 'Unverified / Shortened Link',
    regex: /(bit\.ly|tinyurl|t\.me|ngrok|is\.gd|cutt\.ly|goo\.gl|wa\.me|http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
    severity: 65,
    explanation: 'Shortened or disguised URLs hide the real malicious destination site.',
    actionStep: 'Never click shortened links received from unknown senders.'
  }
];

const LEGIT_MARKERS = [
  /never share (your )?(otp|password|pin|cvv)/i,
  /bank never asks for/i,
  /available bal(ance)?:?\s?(inr|rs\.?)/i,
  /credited with inr/i,
  /debited for inr/i,
  /txn ref no/i,
  /upi ref(erence)?/i
];

export function extractEntities(text) {
  if (!text) return { urls: [], phones: [], upis: [], apks: [] };

  const urlRegex = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|t\.me\/[^\s]+)/gi;
  const phoneRegex = /(\+?91[\s-]?)?[6-9]\d{9}\b/g;
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
  const apkRegex = /[a-zA-Z0-9_\-]+\.apk\b/gi;

  const urls = Array.from(new Set(text.match(urlRegex) || []));
  const phones = Array.from(new Set(text.match(phoneRegex) || []));
  const upis = Array.from(new Set(text.match(upiRegex) || []));
  const apks = Array.from(new Set(text.match(apkRegex) || []));

  return { urls, phones, upis, apks };
}

/**
 * Primary RAG-Augmented Fraud Analyzer
 * Integrates Vector Knowledge Retrieval + Pattern Heuristics
 */
export function analyzeFraudMessage(rawText) {
  const text = (rawText || '').trim();
  if (!text) {
    return {
      riskScore: 0,
      riskLevel: 'Safe',
      detectedTactics: [],
      simpleExplanation: 'No text provided. Enter a message or upload a screenshot to inspect.',
      actionSteps: ['Enter or paste a message to begin real-time fraud scanning.'],
      entities: { urls: [], phones: [], upis: [], apks: [] },
      confidence: 100,
      matchedRules: [],
      retrievedVectors: [],
      factCheckedGrounding: null
    };
  }

  // 1. RAG Vector Knowledge Retrieval
  const retrievedVectors = searchKnowledgeBaseVectors(text, 3);
  const topVector = retrievedVectors.length > 0 ? retrievedVectors[0] : null;

  // 2. Entity Extraction
  const entities = extractEntities(text);
  const matchedRules = [];
  let scoreAccumulator = 0;

  for (const rule of PATTERN_RULES) {
    if (rule.regex.test(text)) {
      matchedRules.push(rule);
      scoreAccumulator += rule.severity;
    }
  }

  if (entities.urls.length > 0 && /urgent|immediately|within|warning/i.test(text)) {
    scoreAccumulator += 15;
  }
  if (entities.apks.length > 0) {
    scoreAccumulator += 30;
  }

  // Factor in vector similarity boost
  if (topVector && topVector.similarity >= 0.75) {
    scoreAccumulator += topVector.similarity * 25;
  }

  let legitCount = 0;
  for (const marker of LEGIT_MARKERS) {
    if (marker.test(text)) legitCount++;
  }

  const hasExtremeThreat = matchedRules.some(r => ['DIGITAL_ARREST', 'MALICIOUS_APK', 'REMOTE_ACCESS_APP'].includes(r.id));
  if (legitCount >= 2 && !hasExtremeThreat) {
    scoreAccumulator = Math.max(0, scoreAccumulator - 45);
  }

  let calculatedScore = 0;
  if (matchedRules.length > 0 || entities.apks.length > 0 || (topVector && topVector.similarity > 0.65)) {
    calculatedScore = Math.min(100, Math.round(scoreAccumulator / (1 + (matchedRules.length * 0.16))));
    if (hasExtremeThreat && calculatedScore < 88) {
      calculatedScore = 92;
    } else if (matchedRules.length >= 2 && calculatedScore < 65) {
      calculatedScore = 74;
    }
  } else {
    calculatedScore = Math.min(15, text.length > 200 ? 10 : 5);
  }

  let riskLevel = 'Safe';
  if (calculatedScore >= 66) {
    riskLevel = 'Critical Danger';
  } else if (calculatedScore >= 26) {
    riskLevel = 'Suspicious';
  } else {
    riskLevel = 'Safe';
  }

  const detectedTactics = Array.from(new Set(matchedRules.map(r => r.tactic)));
  if (entities.apks.length > 0 && !detectedTactics.includes('Malicious APK Distribution')) {
    detectedTactics.push('Malicious APK Distribution');
  }
  if (entities.urls.length > 0 && !detectedTactics.includes('Unverified / Shortened Link')) {
    detectedTactics.push('External Link Detected');
  }
  if (topVector && topVector.similarity >= 0.70 && !detectedTactics.includes(topVector.category)) {
    detectedTactics.push(topVector.category);
  }

  let simpleExplanation = '';
  if (riskLevel === 'Critical Danger') {
    if (topVector && topVector.similarity >= 0.70) {
      simpleExplanation = `OFFICIAL I4C WARNING: This communication closely matches documented fraud in ${topVector.source} (${topVector.citation}). ${topVector.content}`;
    } else {
      const primaryRule = matchedRules[0];
      simpleExplanation = primaryRule 
        ? `WARNING: This message exhibits clear signs of financial fraud (${primaryRule.tactic}). ${primaryRule.explanation}`
        : 'WARNING: This message contains strong hallmarks of a high-risk cyber scam designed to steal your money, credentials, or device access.';
    }
  } else if (riskLevel === 'Suspicious') {
    simpleExplanation = topVector 
      ? `CAUTION: Potential fraud signals detected matching ${topVector.source} advisory (${topVector.citation}). Proceed with extreme care before responding or clicking links.`
      : 'CAUTION: This message contains warning signals such as artificial urgency or unverified contact points.';
  } else {
    simpleExplanation = 'LOOKS SAFE: No malicious threat indicators or coercive cyber patterns found in official I4C/NPCI fraud databases.';
  }

  const actionSteps = [];
  if (riskLevel === 'Critical Danger') {
    actionSteps.push('DO NOT click any link, download any APK, or call the phone number mentioned.');
    actionSteps.push('DO NOT share any OTP, PIN, password, or Aadhaar/PAN details.');
    actionSteps.push('Block the sender number or report the WhatsApp/Telegram account.');
    actionSteps.push('Dial the National Cyber Crime Helpline at 1930 immediately if any money was transferred.');
    actionSteps.push(`Cited Source: Refer to ${topVector?.citation || 'Official Cybercrime Manual'}.`);
  } else if (riskLevel === 'Suspicious') {
    actionSteps.push('Verify directly with the official organization (bank, electricity board) through their official website or helpline.');
    actionSteps.push('Do not use the phone number or URL provided inside this suspicious message.');
    actionSteps.push('Show this message to a tech-savvy family member before taking any action.');
  } else {
    actionSteps.push('Always remember: Legitimate banks will never ask you for your PIN, CVV, or OTP.');
    actionSteps.push('Stay vigilant. If a sender asks for money or personal details later, re-scan the new message.');
  }

  return {
    riskScore: calculatedScore,
    riskLevel,
    detectedTactics,
    simpleExplanation,
    actionSteps,
    entities,
    confidence: topVector && topVector.similarity > 0.7 ? Math.round(topVector.similarity * 100) : 92,
    matchedRules: matchedRules.map(r => ({ id: r.id, tactic: r.tactic, explanation: r.explanation })),
    retrievedVectors,
    factCheckedGrounding: topVector
  };
}
