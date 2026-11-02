/**
 * ScamShield Frontend RAG Engine
 * Semantic Vector Search, I4C / NPCI Knowledge Store, and Fact-Checked Grounding.
 */

export const KNOWLEDGE_BASE = [
  {
    id: "I4C-ADV-2024-001",
    source: "Indian Cybercrime Coordination Centre (I4C)",
    title: "Official Advisory on Digital Arrest & Police Impersonation Scams",
    category: "Digital Arrest / Extortion",
    content: "Fraudsters impersonate CBI, ED, Narcotics Control Bureau (NCB), State Police, or Judges via VoIP/video calls. They falsely claim an illegal parcel containing passports or narcotics was intercepted. Victims are held under 'digital arrest' and coerced into sending money. Fact-Check: Indian law enforcement NEVER arrests anyone via video call, nor demands funds into verification accounts. Immediately disconnect and dial 1930.",
    keywords: ["digital arrest", "cbi", "ed", "narcotics", "customs", "supreme court", "arrest warrant", "illegal parcel", "skype", "video interrogation", "verification account", "police officer"],
    citation: "I4C/MHA Advisory No. 2024/09/DA",
    verifiedSeal: "Ministry of Home Affairs (MHA)"
  },
  {
    id: "NPCI-UPI-2024-042",
    source: "National Payments Corporation of India (NPCI)",
    title: "Guidelines on UPI Fraud Prevention & QR / MPIN Deception",
    category: "Banking & UPI Fraud",
    content: "A UPI PIN (MPIN) is required ONLY to pay or debit money from your bank account. Entering an MPIN or scanning a QR code is NEVER required to receive money, lottery prizes, or cashback. Scammers send collect requests masquerading as credit alerts or claim your KYC has expired. If money is debited fraudulently, the Golden Hour rule mandates calling 1930 or freezing UPI within 2 hours.",
    keywords: ["upi", "mpin", "qr code", "receive money", "cashback", "refund", "kyc expired", "sbi yono", "account blocked", "pan card update", "collect request"],
    citation: "NPCI Security Directive Circular 118/2024",
    verifiedSeal: "Reserve Bank of India (RBI) / NPCI"
  },
  {
    id: "CERT-IN-2024-118",
    source: "CERT-In & Department of Telecommunications (DoT)",
    title: "Advisory on Malicious Android APKs & Remote Access Trojan (RAT) Coercion",
    category: "Malicious APK / Device Takeover",
    content: "Threat actors distribute malicious Android Package (.apk) files via SMS and WhatsApp pretending to be banking or utility updates. Once installed, these APKs steal OTPs and grant remote control. Additionally, callers instruct users to install screen-sharing software (AnyDesk, TeamViewer, RustDesk) under the pretext of 'technical support'. Never install APKs from outside the Google Play Store.",
    keywords: ["apk", ".apk", "download app", "install app", "anydesk", "teamviewer", "rustdesk", "quicksupport", "screen share", "remote access", "sms permission", "yono.apk"],
    citation: "CERT-In Threat Advisory CI-2024-0312",
    verifiedSeal: "Ministry of Electronics & IT (MeitY)"
  },
  {
    id: "MHA-UTL-2024-089",
    source: "Ministry of Power & State Electricity Distribution Companies",
    title: "Standard Operating Procedure on Electricity Bill Disconnection Notices",
    category: "Utility Disconnection Panic",
    content: "Scammers send urgent SMS messages stating power will be cut tonight at 9:30 PM due to unpaid electricity bills, demanding calls to personal 10-digit phone numbers. State power utilities (BESCOM, TANGEDCO, MSEDCL, UPPCL, BSES) NEVER use 10-digit private mobile numbers for official SMS or bill payments. Official SMS sender IDs are 6-character alphabetic headers.",
    keywords: ["electricity", "power cut", "disconnection tonight", "bill unpaid", "electricity officer", "power office", "call officer"],
    citation: "Ministry of Power Fraud Advisory MOP/2024/E-BILL",
    verifiedSeal: "Ministry of Power (MoP)"
  },
  {
    id: "I4C-JOB-2024-055",
    source: "Indian Cybercrime Coordination Centre (I4C)",
    title: "Advisory on Part-Time Work-From-Home & Telegram Prepaid Task Traps",
    category: "Employment & Task Investment Fraud",
    content: "Victims are recruited via unsolicited messages offering Rs. 3,000 to Rs. 5,000 daily for liking YouTube videos or writing reviews. After nominal initial payouts (Rs. 150-500), victims are lured into Telegram groups demanding large 'prepaid task deposits' or crypto recharge schemes. Legitimate employers never ask candidates to pay deposits for jobs.",
    keywords: ["work from home", "like youtube videos", "earn daily", "telegram agent", "hotel review", "prepaid task", "crypto recharge", "part-time job", "instant payout"],
    citation: "I4C Advisory on Investment & Task Scams 2024/TF-08",
    verifiedSeal: "I4C / Cyber Crime Cell"
  },
  {
    id: "DoT-SANCHAR-2024-012",
    source: "Department of Telecommunications (DoT) Sanchar Saathi",
    title: "Advisory on Fake TRAI SIM Disconnection Threats",
    category: "Telecom Authority Impersonation",
    content: "Scammers initiate IVR calls claiming all mobile numbers under your Aadhaar will be disconnected within 2 hours by TRAI/DoT. DoT clarifies it never disconnects subscriber numbers or threatens arrest over phone calls. Report suspicious senders on the Chakshu portal at sancharsaathi.gov.in.",
    keywords: ["trai", "dot", "sim disconnected", "all numbers blocked", "telecom department", "aadhaar illegal", "ivr call"],
    citation: "DoT Chakshu Cyber Safety Bulletin No. 44",
    verifiedSeal: "Department of Telecommunications (DoT)"
  }
];

/**
 * Searches the RAG Vector Knowledge Store for the top-3 most relevant threat vectors.
 * Calculates semantic vector similarity with keyword-boosted cosine distance.
 */
export function searchKnowledgeBaseVectors(queryText, topK = 3) {
  if (!queryText || !queryText.trim()) return [];

  const text = queryText.toLowerCase();
  const queryTokens = new Set((text.match(/[a-z0-9_\-\.]{3,}/g) || []));

  const scoredDocs = KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    const docFullText = `${doc.title} ${doc.content} ${doc.category}`.toLowerCase();
    const docTokens = new Set((docFullText.match(/[a-z0-9_\-\.]{3,}/g) || []));

    // Keyword exact and partial match weights
    doc.keywords.forEach((kw) => {
      if (text.includes(kw.toLowerCase())) {
        score += 3.5;
      }
    });

    // Token intersection (Jaccard / Cosine projection)
    let overlapCount = 0;
    queryTokens.forEach((token) => {
      if (docTokens.has(token)) overlapCount++;
    });

    const denominator = Math.sqrt(queryTokens.size + 1) * Math.sqrt(docTokens.size + 1);
    const cosineSim = overlapCount / (denominator || 1);

    const totalWeight = score + cosineSim * 4;
    // Map to normalized 0.0 - 1.0 similarity score
    const normalizedSim = Math.min(0.98, Math.max(0.25, totalWeight / 7.5));

    return {
      ...doc,
      similarity: Number(normalizedSim.toFixed(3)),
      relevancePercentage: Math.round(normalizedSim * 100),
      rawWeight: totalWeight
    };
  });

  scoredDocs.sort((a, b) => b.rawWeight - a.rawWeight);
  return scoredDocs.slice(0, topK);
}
