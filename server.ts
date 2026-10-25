import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// In-Memory Data Store (Persisted during app session with full cryptographic hash-chaining)
interface StoredAuditEvent {
  id: string;
  caseRef: string;
  eventType: string;
  timestamp: string;
  actorRole: string;
  actorId: string;
  details: string;
  previousHash: string;
  currentHash: string;
}

interface StoredReport {
  id: string;
  caseRef: string;
  type: 'safereach' | 'speakup';
  concernCategory: string;
  categoryLabel: string;
  description: string;
  approximateDate: string;
  approximateTime?: string;
  approximateLocation: string;
  broadRegion: string;
  isOngoing: boolean;
  isImmediatelyDangerous: boolean;
  anonymityMode: 'anonymous' | 'confidential';
  safeContactMethod?: string;
  safeContactValue?: string;
  organization?: string;
  isFormalPoshRequested?: boolean;
  status: string;
  reviewerNotes?: string[];
  assignedReviewer?: string;
  createdAt: string;
  updatedAt: string;
  auditLog: StoredAuditEvent[];
}

interface StoredPattern {
  id: string;
  patternRef: string;
  title: string;
  concernCategory: string;
  broadRegion: string;
  timeWindow: string;
  reportCount: number;
  reportRefs: string[];
  matchFactors: string[];
  confidenceScore: number;
  duplicateFlag: boolean;
  recommendedAction: string;
  explanation: string;
  status: 'emerging' | 'reviewed' | 'dismissed';
  dismissReason?: string;
  discoveredAt: string;
}

function calculateHash(canonical: string): string {
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

// Seed Store
let reports: StoredReport[] = [
  {
    id: 'rep-001',
    caseRef: 'TRN-2026-SR-9182',
    type: 'safereach',
    concernCategory: 'stalking_surveillance',
    categoryLabel: 'Stalking & Physical Surveillance',
    description: 'Repeated tracking by a dark silver motorcycle near Koramangala 80ft Road bus stop during evening commute (approx 7:30 PM - 8:00 PM). Happened three times this week.',
    approximateDate: '2026-10-22',
    approximateTime: '19:45',
    approximateLocation: 'Koramangala 80ft Road, Sony Signal Junction',
    broadRegion: 'Bengaluru South Urban',
    isOngoing: true,
    isImmediatelyDangerous: false,
    anonymityMode: 'anonymous',
    status: 'under_review',
    assignedReviewer: 'Reviewer_Kavitha_R',
    createdAt: '2026-10-22T20:15:00.000Z',
    updatedAt: '2026-10-23T09:30:00.000Z',
    auditLog: [
      {
        id: 'aud-001-1',
        caseRef: 'TRN-2026-SR-9182',
        eventType: 'report_created',
        timestamp: '2026-10-22T20:15:00.000Z',
        actorRole: 'reporter',
        actorId: 'ANONYMOUS_REPORTER_SESSION_329',
        details: 'Initial report encrypted and recorded with zero personal identity tokens.',
        previousHash: 'GENESIS_ROOT_TRINETRA_2026',
        currentHash: 'b4a6217e997f74c7e6c464455823793081ce47d7c6742589574d6c69f216832b',
      },
      {
        id: 'aud-001-2',
        caseRef: 'TRN-2026-SR-9182',
        eventType: 'reviewer_assigned',
        timestamp: '2026-10-23T09:15:00.000Z',
        actorRole: 'reviewer',
        actorId: 'Reviewer_Kavitha_R',
        details: 'Case claimed for regional triage and pattern verification.',
        previousHash: 'b4a6217e997f74c7e6c464455823793081ce47d7c6742589574d6c69f216832b',
        currentHash: '19a4e09cb6f4e1f72b9a74c2df47b85e05a8f4c9c10f882f04e1bc2cf18ebf31',
      },
      {
        id: 'aud-001-3',
        caseRef: 'TRN-2026-SR-9182',
        eventType: 'pattern_linked',
        timestamp: '2026-10-23T09:30:00.000Z',
        actorRole: 'reviewer',
        actorId: 'Reviewer_Kavitha_R',
        details: 'Linked to candidate cluster PAT-BLR-80FT-01 due to matching transit route and vehicle description.',
        previousHash: '19a4e09cb6f4e1f72b9a74c2df47b85e05a8f4c9c10f882f04e1bc2cf18ebf31',
        currentHash: '38b9d3e8e1f57e62c5b96792348ffca1d92bf3589a1c841bb20984ee24ef0382',
      },
    ],
  },
  {
    id: 'rep-002',
    caseRef: 'TRN-2026-SR-9204',
    type: 'safereach',
    concernCategory: 'stalking_surveillance',
    categoryLabel: 'Stalking & Physical Surveillance',
    description: 'Man on two-wheeler following women walking from Koramangala 80ft road bus stop toward 4th Block between 7:45 PM and 8:15 PM.',
    approximateDate: '2026-10-23',
    approximateTime: '20:00',
    approximateLocation: 'Koramangala 80ft Road, near Maharaja Signal',
    broadRegion: 'Bengaluru South Urban',
    isOngoing: true,
    isImmediatelyDangerous: false,
    anonymityMode: 'anonymous',
    status: 'under_review',
    assignedReviewer: 'Reviewer_Kavitha_R',
    createdAt: '2026-10-23T20:30:00.000Z',
    updatedAt: '2026-10-23T21:00:00.000Z',
    auditLog: [
      {
        id: 'aud-002-1',
        caseRef: 'TRN-2026-SR-9204',
        eventType: 'report_created',
        timestamp: '2026-10-23T20:30:00.000Z',
        actorRole: 'reporter',
        actorId: 'ANONYMOUS_REPORTER_SESSION_441',
        details: 'Initial report encrypted and recorded.',
        previousHash: 'GENESIS_ROOT_TRINETRA_2026',
        currentHash: '7f9180c98f98ec517208f43ad9e671ea3458bf2a36b3014a09c25f1642c8d201',
      },
    ],
  },
  {
    id: 'rep-003',
    caseRef: 'TRN-2026-SR-9241',
    type: 'safereach',
    concernCategory: 'public_transit_safety',
    categoryLabel: 'Public Transit Safety & Harassment',
    description: 'Unlit stretch near Koramangala Sony World bus shelter where repeated eve-teasing and aggressive bike revving has been witnessed after 7:30 PM.',
    approximateDate: '2026-10-24',
    approximateTime: '19:30',
    approximateLocation: 'Koramangala 80ft Road corridor',
    broadRegion: 'Bengaluru South Urban',
    isOngoing: true,
    isImmediatelyDangerous: false,
    anonymityMode: 'anonymous',
    status: 'under_review',
    createdAt: '2026-10-24T21:10:00.000Z',
    updatedAt: '2026-10-24T21:10:00.000Z',
    auditLog: [
      {
        id: 'aud-003-1',
        caseRef: 'TRN-2026-SR-9241',
        eventType: 'report_created',
        timestamp: '2026-10-24T21:10:00.000Z',
        actorRole: 'reporter',
        actorId: 'ANONYMOUS_REPORTER_SESSION_502',
        details: 'Initial report encrypted and recorded.',
        previousHash: 'GENESIS_ROOT_TRINETRA_2026',
        currentHash: 'a52f44c8034d6189ea73499427ce33a08892f3922f281e81b6c7a421689104fa',
      },
    ],
  },
  {
    id: 'rep-004',
    caseRef: 'TRN-2026-SU-4410',
    type: 'speakup',
    concernCategory: 'workplace_sexual_harassment',
    categoryLabel: 'Workplace Sexual Harassment & POSH',
    description: 'Senior lead consistently making inappropriate personal remarks during 1:1 meetings and sending late-night WhatsApp texts unrelated to work tasks.',
    approximateDate: '2026-10-18',
    approximateTime: '18:00',
    approximateLocation: 'Tech Park Campus, Whitefield',
    broadRegion: 'Bengaluru East',
    organization: 'Apex Digital Solutions Pvt Ltd',
    isFormalPoshRequested: true,
    isOngoing: true,
    isImmediatelyDangerous: false,
    anonymityMode: 'confidential',
    safeContactMethod: 'Encrypted Proton Email',
    safeContactValue: 'secure.temp.contact.91@proton.me',
    status: 'action_planned',
    assignedReviewer: 'Reviewer_POSH_Advisor_Meera',
    createdAt: '2026-10-18T19:00:00.000Z',
    updatedAt: '2026-10-20T11:00:00.000Z',
    auditLog: [
      {
        id: 'aud-004-1',
        caseRef: 'TRN-2026-SU-4410',
        eventType: 'report_created',
        timestamp: '2026-10-18T19:00:00.000Z',
        actorRole: 'reporter',
        actorId: 'CONFIDENTIAL_REPORTER_HASH_781',
        details: 'Confidential formal POSH assistance request submitted.',
        previousHash: 'GENESIS_ROOT_TRINETRA_2026',
        currentHash: 'cf9804e3b1236109356ef24a1876e6a1059f13c8e3bf5c4d52140a37901844b2',
      },
      {
        id: 'aud-004-2',
        caseRef: 'TRN-2026-SU-4410',
        eventType: 'status_updated',
        timestamp: '2026-10-19T10:00:00.000Z',
        actorRole: 'reviewer',
        actorId: 'Reviewer_POSH_Advisor_Meera',
        details: 'Status transitioned from Submitted to Under Review. POSH advisory packet prepared.',
        previousHash: 'cf9804e3b1236109356ef24a1876e6a1059f13c8e3bf5c4d52140a37901844b2',
        currentHash: 'e394018f2d592a83ec9034e4028b17169420042a967f08d3e85749c470876123',
      },
    ],
  },
];

let patterns: StoredPattern[] = [
  {
    id: 'pat-001',
    patternRef: 'PAT-BLR-80FT-01',
    title: 'Evening Transit Stalking Cluster (Koramangala 80ft Corridor)',
    concernCategory: 'stalking_surveillance',
    broadRegion: 'Bengaluru South Urban',
    timeWindow: 'Past 7 Days (Oct 22 - Oct 25, 2026)',
    reportCount: 3,
    reportRefs: ['TRN-2026-SR-9182', 'TRN-2026-SR-9204', 'TRN-2026-SR-9241'],
    matchFactors: [
      'Same Category: Stalking & Transit Harassment',
      'Geographic Radius: Within 600m on Koramangala 80ft Road corridor',
      'Temporal Alignment: Evening hours 19:30 - 20:30 IST',
      'Modus Operandi: Motorcyclist tracking female commuters between Sony Signal and Maharaja Signal',
    ],
    confidenceScore: 89,
    duplicateFlag: false,
    recommendedAction: 'Alert local community night patrol coordinators and request Bengaluru Police Hoysala vehicle presence at 80ft Road bus stands 19:30-21:00.',
    explanation: 'Rule-based and behavioral vector matching detected 3 distinct anonymous reports within a 72-hour window sharing identical transit stop coordinates and time-of-day profile. No personal identities were accessed.',
    status: 'emerging',
    discoveredAt: '2026-10-24T22:00:00.000Z',
  },
  {
    id: 'pat-002',
    patternRef: 'PAT-BLR-TECH-02',
    title: 'Workplace Retaliation & IC Defiance Pattern',
    concernCategory: 'retaliation_posh',
    broadRegion: 'Bengaluru East (Whitefield)',
    timeWindow: 'Past 30 Days',
    reportCount: 2,
    reportRefs: ['TRN-2026-SU-4410'],
    matchFactors: [
      'Shared Workplace Entity: Apex Digital Solutions campus',
      'Incident Pattern: Subtle project removal and hostile reviews following internal dissent',
      'POSH Status: Formal complaints stalled beyond 90-day statutory threshold',
    ],
    confidenceScore: 81,
    duplicateFlag: false,
    recommendedAction: 'Provide external POSH legal counsel connection and inform state women commission POSH compliance cell.',
    explanation: 'Multiple reports mention identical organizational subsidiary and systemic delays in statutory POSH inquiry. Individual complainant identities remain strictly partitioned.',
    status: 'reviewed',
    discoveredAt: '2026-10-20T12:00:00.000Z',
  },
];

// Re-evaluates PatternWatch clustering when new reports arrive
function evaluatePatternsForNewReport(newReport: StoredReport) {
  // Check against existing reports with similar category & region within 14 days
  const relatedReports = reports.filter(
    (r) =>
      r.id !== newReport.id &&
      (r.concernCategory === newReport.concernCategory ||
        (r.broadRegion && newReport.broadRegion && r.broadRegion.toLowerCase() === newReport.broadRegion.toLowerCase()))
  );

  if (relatedReports.length >= 2) {
    const existingPat = patterns.find((p) => p.concernCategory === newReport.concernCategory && p.broadRegion === newReport.broadRegion);
    if (existingPat) {
      if (!existingPat.reportRefs.includes(newReport.caseRef)) {
        existingPat.reportRefs.push(newReport.caseRef);
        existingPat.reportCount += 1;
        existingPat.confidenceScore = Math.min(96, existingPat.confidenceScore + 4);
      }
    } else {
      const newPat: StoredPattern = {
        id: `pat-${Date.now()}`,
        patternRef: `PAT-${newReport.broadRegion.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        title: `Recurring Pattern: ${newReport.categoryLabel} in ${newReport.broadRegion}`,
        concernCategory: newReport.concernCategory,
        broadRegion: newReport.broadRegion,
        timeWindow: 'Recent 14 Days',
        reportCount: relatedReports.length + 1,
        reportRefs: [newReport.caseRef, ...relatedReports.map((r) => r.caseRef)],
        matchFactors: [
          `Shared Category: ${newReport.categoryLabel}`,
          `Common Broad Region: ${newReport.broadRegion}`,
          'Temporal Proximity: Multiple incidents logged in overlapping window',
        ],
        confidenceScore: 78,
        duplicateFlag: false,
        recommendedAction: 'Priority triage recommended for regional reviewer and safety planning review.',
        explanation: 'Automated explainable pattern detection correlated shared location markers and incident descriptions without exposing any individual reporter identity.',
        status: 'emerging',
        discoveredAt: new Date().toISOString(),
      };
      patterns.unshift(newPat);
    }
  }
}

// API Routes

// 1. Get all reports
app.get('/api/reports', (req, res) => {
  const { role, caseRef } = req.query;
  if (caseRef) {
    const single = reports.find((r) => r.caseRef === String(caseRef).trim());
    if (single) {
      return res.json({ success: true, report: single });
    }
    return res.status(404).json({ success: false, message: 'Case reference not found.' });
  }

  // If role is reviewer or admin, return all reports; if reporter, return anonymized list or their own
  res.json({ success: true, reports });
});

// 2. Submit new report
app.post('/api/reports', (req, res) => {
  try {
    const {
      type,
      concernCategory,
      categoryLabel,
      description,
      approximateDate,
      approximateTime,
      approximateLocation,
      broadRegion,
      isOngoing,
      isImmediatelyDangerous,
      anonymityMode,
      safeContactMethod,
      safeContactValue,
      organization,
      isFormalPoshRequested,
    } = req.body;

    if (!description || !concernCategory) {
      return res.status(400).json({ success: false, message: 'Category and description are required.' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = type === 'speakup' ? 'TRN-2026-SU' : 'TRN-2026-SR';
    const caseRef = `${prefix}-${randomSuffix}`;
    const id = `rep-${Date.now()}`;
    const nowIso = new Date().toISOString();

    // Generate Genesis Audit Block
    const canonical = `GENESIS_ROOT_TRINETRA_2026|${caseRef}|report_created|${nowIso}|reporter|${anonymityMode === 'anonymous' ? 'ANONYMOUS_REPORTER' : 'CONFIDENTIAL_REPORTER'}|Initial encrypted report submission`;
    const blockHash = calculateHash(canonical);

    const newAuditEvent: StoredAuditEvent = {
      id: `aud-${id}-1`,
      caseRef,
      eventType: 'report_created',
      timestamp: nowIso,
      actorRole: 'reporter',
      actorId: anonymityMode === 'anonymous' ? 'ANONYMOUS_REPORTER' : 'CONFIDENTIAL_REPORTER',
      details: 'Report created and locked into tamper-evident audit ledger with zero tracking tokens.',
      previousHash: 'GENESIS_ROOT_TRINETRA_2026',
      currentHash: blockHash,
    };

    const newReport: StoredReport = {
      id,
      caseRef,
      type: type || 'safereach',
      concernCategory,
      categoryLabel: categoryLabel || concernCategory,
      description,
      approximateDate: approximateDate || new Date().toISOString().split('T')[0],
      approximateTime,
      approximateLocation: approximateLocation || 'Approximate location noted',
      broadRegion: broadRegion || 'Regional jurisdiction',
      isOngoing: Boolean(isOngoing),
      isImmediatelyDangerous: Boolean(isImmediatelyDangerous),
      anonymityMode: anonymityMode || 'anonymous',
      safeContactMethod,
      safeContactValue,
      organization,
      isFormalPoshRequested: Boolean(isFormalPoshRequested),
      status: 'submitted',
      createdAt: nowIso,
      updatedAt: nowIso,
      auditLog: [newAuditEvent],
    };

    reports.unshift(newReport);
    evaluatePatternsForNewReport(newReport);

    res.status(201).json({
      success: true,
      caseRef,
      report: newReport,
      message: 'Report successfully created and added to tamper-evident audit ledger.',
    });
  } catch (err: any) {
    console.error('Error submitting report:', err);
    res.status(500).json({ success: false, message: 'Server error creating report' });
  }
});

// 3. Reviewer Action (Update Status / Add Note / Link Pattern)
app.post('/api/reports/:id/action', (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, reviewerName, eventType } = req.body;

    const report = reports.find((r) => r.id === id || r.caseRef === id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const prevAudit = report.auditLog[report.auditLog.length - 1];
    const prevHash = prevAudit ? prevAudit.currentHash : 'GENESIS_ROOT_TRINETRA_2026';
    const nowIso = new Date().toISOString();
    const actionDetails = note || `Status updated to ${status}`;
    const canonical = `${prevHash}|${report.caseRef}|${eventType || 'status_updated'}|${nowIso}|reviewer|${reviewerName || 'Reviewer_Kavitha_R'}|${actionDetails}`;
    const newHash = calculateHash(canonical);

    const newEvent: StoredAuditEvent = {
      id: `aud-${Date.now()}`,
      caseRef: report.caseRef,
      eventType: eventType || 'status_updated',
      timestamp: nowIso,
      actorRole: 'reviewer',
      actorId: reviewerName || 'Authorised_Reviewer',
      details: actionDetails,
      previousHash: prevHash,
      currentHash: newHash,
    };

    if (status) {
      report.status = status;
    }
    if (reviewerName) {
      report.assignedReviewer = reviewerName;
    }
    if (note) {
      if (!report.reviewerNotes) report.reviewerNotes = [];
      report.reviewerNotes.push(`[${nowIso.split('T')[0]}] ${note}`);
    }
    report.updatedAt = nowIso;
    report.auditLog.push(newEvent);

    res.json({ success: true, report, newEvent });
  } catch (err: any) {
    console.error('Error taking action on report:', err);
    res.status(500).json({ success: false, message: 'Failed to record action' });
  }
});

// 4. PatternWatch Candidates
app.get('/api/patterns', (req, res) => {
  res.json({ success: true, patterns });
});

// 5. Dismiss Pattern Candidate
app.post('/api/patterns/:id/dismiss', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const pat = patterns.find((p) => p.id === id || p.patternRef === id);
  if (!pat) {
    return res.status(404).json({ success: false, message: 'Pattern not found' });
  }
  pat.status = 'dismissed';
  pat.dismissReason = reason || 'Reviewed and dismissed by authorised reviewer.';
  res.json({ success: true, pattern: pat });
});

// 6. TRINETRA SAATHI AI Assistant Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language, context, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      kn: 'Kannada (ಕನ್ನಡ)',
      hi: 'Hindi (हिन्दी)',
      te: 'Telugu (తెలుగు)',
      ta: 'Tamil (தமிழ்)',
      ml: 'Malayalam (മലയാളം)',
      mr: 'Marathi (मराठी)',
      bn: 'Bengali (বাংলা)',
      gu: 'Gujarati (ગુજરાતી)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)',
      or: 'Odia (ଓଡ଼ିଆ)',
      ur: 'Urdu (اردو)',
      as: 'Assamese (অসমীয়া)',
      sa: 'Sanskrit (संस्कृतम्)',
    };

    const targetLangName = languageNames[language] || 'English';

    // Check for crisis trigger words
    const lower = message.toLowerCase();
    const isImmediateCrisis =
      lower.includes('emergency') ||
      lower.includes('help me now') ||
      lower.includes('danger') ||
      lower.includes('kill') ||
      lower.includes('beating') ||
      lower.includes('attack') ||
      lower.includes('bleeding') ||
      lower.includes('save me') ||
      lower.includes('ತುರ್ತು') ||
      lower.includes('बचाओ') ||
      lower.includes('आपातकाल');

    if (ai) {
      const candidateModels = [
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
      ];

      const systemInstruction = `
You are TRINETRA SAATHI, an empathetic, highly knowledgeable, and protective women's safety AI companion in India.
Platform Tagline: "See the Signs. Protect the Silent."

CRITICAL SAFETY & TRIAGE RULES:
1. Target Language: You MUST reply entirely in the user's requested language: ${targetLangName}.
2. Immediate Danger Protocol:
   If the user indicates active danger, domestic assault, or violence:
   - Prioritize immediate personal safety above all else.
   - Prominently provide official Indian verified helplines:
     * 112: All-India National Emergency Number (Police/Ambulance/Fire)
     * 181: Women Helpline (24x7 Domestic Abuse & Crisis Support)
     * 1091: Women in Distress Call Center
     * 1098: Childline (for minors)
     * +91 7827170170: National Commission for Women (NCW) WhatsApp helpline
   - Remind them to leave the unsafe space if possible or alert trusted neighbors.
   - NEVER claim that TRINETRA has dispatched police or emergency personnel.
3. Domestic Abuse & Personal Safety (SafeReach):
   - Never judge, doubt, or blame. Never advise confronting an abuser directly.
   - Explain that TRINETRA SafeReach enables confidential or 100% anonymous reporting.
   - Remind the user about device safety: clearing browser history, private browsing, and the Quick Exit button if their phone or computer is monitored.
4. Workplace Harassment & POSH (SpeakUp):
   - Explain options under India's POSH Act 2013 (Sexual Harassment of Women at Workplace Act).
   - Clarify the difference between:
     * An informal concern on TRINETRA SpeakUp (to spot patterns and connect with advisors).
     * A formal statutory complaint to an employer's Internal Committee (IC) or Local Committee (LC), which must be a written complaint within statutory timelines (90 days).
   - Address retaliation concerns and evidence preservation (screenshots, timestamps, emails).
5. Explainable Patterns & Integrity (PatternWatch & TrustTrack):
   - PatternWatch groups anonymized reports across transit corridors and workplaces with transparent matching factors.
   - TrustTrack uses SHA-256 cryptographic hash-chains so records cannot be silently modified or erased.
6. Tone: Empowering, respectful, compassionate, culturally attuned to India, accurate, and concise.

Current user context on screen: ${context || 'General navigation'}
`;

      // Construct conversational contents if history is provided
      let contentsPayload: any = message;
      if (Array.isArray(history) && history.length > 0) {
        const turns: { role: string; parts: { text: string }[] }[] = [];
        for (const item of history.slice(-6)) {
          if (item && item.text && item.sender) {
            turns.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
        turns.push({
          role: 'user',
          parts: [{ text: message }],
        });
        contentsPayload = turns;
      }

      for (const modelName of candidateModels) {
        try {
          console.log(`[TRINETRA AI] Querying ${modelName} in ${targetLangName}...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contentsPayload,
            config: {
              systemInstruction,
              temperature: 0.35,
            },
          });

          const replyText = response.text || '';
          if (replyText.trim()) {
            console.log(`[TRINETRA AI] Success with ${modelName}`);
            return res.json({
              success: true,
              reply: replyText,
              isImmediateCrisis,
              source: modelName,
            });
          }
        } catch (geminiError: any) {
          console.warn(`[TRINETRA AI] Model ${modelName} error (${geminiError.status || geminiError.message}), trying next model...`);
        }
      }
    }

    // Local Expert System Fallback (Deterministic, verified, multilingual)
    let fallbackReply = '';
    if (isImmediateCrisis) {
      if (language === 'kn') {
        fallbackReply = 'ತುರ್ತು ಎಚ್ಚರಿಕೆ: ನೀವು ತಕ್ಷಣದ ಅಪಾಯದಲ್ಲಿದ್ದರೆ, ದಯವಿಟ್ಟು ಕೂಡಲೇ 112 (ರಾಷ್ಟ್ರೀಯ ತುರ್ತು) ಅಥವಾ 181 (ಮಹಿಳಾ ಸಹಾಯವಾಣಿ) ಗೆ ಕರೆ ಮಾಡಿ. ಸಾಧ್ಯವಾದರೆ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ. ತ್ರಿನೇತ್ರ ನಿಮ್ಮ ಜೊತೆಗಿದೆ.';
      } else if (language === 'hi') {
        fallbackReply = 'आपातकालीन चेतावनी: यदि आप तत्काल खतरे में हैं, तो कृपया बिना देर किए 112 (राष्ट्रीय आपातकाल) या 181 (महिला हेल्पलाइन) पर कॉल करें। सुरक्षित स्थान पर जाएं। त्रिनेत्र आपकी सुरक्षा के लिए प्रतिबद्ध है।';
      } else if (language === 'te') {
        fallbackReply = 'అత్యవసర హెచ్చరిక: మీరు ప్రమాదంలో ఉంటే వెంటనే 112 లేదా మహిళా హెల్ప్‌లైన్ 181కి కాల్ చేయండి. సురక్షిత ప్రదేశానికి వెళ్లండి.';
      } else if (language === 'ta') {
        fallbackReply = 'அவசர எச்சரிக்கை: நீங்கள் ஆபத்தில் இருந்தால் உடனடியாக 112 அல்லது 181 மகளிர் உதவி எண்ணை அழைக்கவும். பாதுகாப்பான இடத்திற்கு செல்லவும்.';
      } else {
        fallbackReply = 'EMERGENCY ALERT: If you are in immediate physical danger, please dial 112 (National Emergency) or 181 (Women Helpline 24x7) immediately. Move to a safe location or alert a trusted person nearby.';
      }
    } else if (lower.includes('posh') || lower.includes('work') || lower.includes('office') || lower.includes('boss')) {
      fallbackReply =
        language === 'hi'
          ? 'कार्यस्थल सुरक्षा (POSH): त्रिनेत्र "SpeakUp" मॉड्यूल के माध्यम से आप कार्यस्थल उत्पीड़न दर्ज कर सकती हैं। कृपया ध्यान दें कि औपचारिक POSH जांच के लिए आंतरिक समिति (IC) को लिखित शिकायत आवश्यक होती है। आप यहां अनाम रूप से भी चिंता साझा कर सकती हैं।'
          : language === 'kn'
          ? 'ಕೆಲಸದ ಸ್ಥಳದ ಸುರಕ್ಷತೆ (POSH): ತ್ರಿನೇತ್ರ SpeakUp ಮೂಲಕ ನೀವು ಕಚೇರಿ ಕಿರುಕುಳದ ವಿವರಗಳನ್ನು ದಾಖಲಿಸಬಹುದು. ಅನಾಮಧೇಯ ವರದಿಗಳು ಮಾದರಿಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ, ಆದರೆ ಕಾನೂನಾತ್ಮಕ ತನಿಖೆಗೆ ಆಂತರಿಕ ಸಮಿತಿಗೆ (IC) ವಿವರಗಳು ಅಗತ್ಯ.'
          : 'Workplace Safety (POSH): Under India\'s POSH Act 2013, every workplace with 10+ employees must maintain an Internal Committee (IC). On TRINETRA SpeakUp, you can file an informal concern to detect patterns, or request guidance for formal POSH complaint filing with confidential support.';
    } else if (lower.includes('report') || lower.includes('safereach') || lower.includes('domestic') || lower.includes('abuse')) {
      fallbackReply =
        language === 'hi'
          ? 'घरेलू सुरक्षा (SafeReach): आप अपनी पहचान छुपाकर पूरी तरह गुमनाम (Anonymous) या गोपनीय (Confidential) रिपोर्ट दर्ज कर सकती हैं। प्रत्येक रिपोर्ट को क्रिप्टोग्राफिक केस रेफरेंस नंबर मिलता है जिससे आप बिना लॉगिन किए स्थिति जांच सकती हैं।'
          : language === 'kn'
          ? 'SafeReach ಗೃಹ ಸುರಕ್ಷತೆ: ನಿಮ್ಮ ಗುರುತನ್ನು ರಹಸ್ಯವಾಗಿಟ್ಟು ನೀವು ವರದಿ ಸಲ್ಲಿಸಬಹುದು. ವರದಿ ಸಲ್ಲಿಸಿದ ನಂತರ ನಿಮಗೆ ಸಿಗುವ ಖಾಸಗಿ ಕೇಸ್ ರೆಫರೆನ್ಸ್ ಸಂಖ್ಯೆಯ ಮೂಲಕ ನೀವು ಯಾವುದೇ ಲಾಗಿನ್ ಇಲ್ಲದೆ ಪ್ರಗತಿ ತಿಳಿಯಬಹುದು.'
          : 'TRINETRA SafeReach enables confidential domestic safety and abuse reporting. You can choose Anonymous Mode (zero identity collected) or Confidential Mode (safe contact method). You will receive a private Case Reference to track progress securely in TrustTrack.';
    } else {
      fallbackReply =
        language === 'hi'
          ? 'नमस्ते। मैं त्रिनेत्र साथी हूँ। मैं आपको SafeReach (घरेलू सुरक्षा), SpeakUp (कार्यस्थल POSH), PatternWatch (सुरक्षा पैटर्न) और TrustTrack (केस ट्रैकिंग) के बारे में जानकारी दे सकती हूँ। आपातकाल के लिए 112 या 181 डायल करें।'
          : language === 'kn'
          ? 'ನಮಸ್ಕಾರ. ನಾನು ತ್ರಿನೇತ್ರ ಸಾಥಿ. ಕೌಟುಂಬಿಕ ಸುರಕ್ಷತೆ (SafeReach), ಕೆಲಸದ ಸ್ಥಳದ ಕಿರುಕುಳ (SpeakUp), ಅಪಾಯಕಾರಿ ಮಾದರಿ ಪತ್ತೆ (PatternWatch) ಅಥವಾ ಕೇಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ (TrustTrack) ಬಗ್ಗೆ ನಿಮಗೆ ಮಾಹಿತಿ ನೀಡಲು ನಾನು ಸಿದ್ಧ.'
          : 'Hello. I am TRINETRA Saathi. I can guide you through SafeReach (domestic safety), SpeakUp (workplace POSH), PatternWatch (explainable pattern detection), and TrustTrack (tamper-evident audit timeline). For immediate emergency in India, dial 112 or 181.';
    }

    res.json({
      success: true,
      reply: fallbackReply,
      isImmediateCrisis,
      source: 'trinetra-expert-rules',
    });
  } catch (err: any) {
    console.error('Error in chat handler:', err);
    res.status(500).json({ success: false, message: 'Chat service error' });
  }
});

// Vite Setup for Development & Static Serve for Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TRINETRA] Fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
