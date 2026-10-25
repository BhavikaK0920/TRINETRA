export type UserRole = 'reporter' | 'reviewer' | 'admin';

export type ConcernCategory =
  | 'domestic_violence'
  | 'coercive_control'
  | 'stalking_surveillance'
  | 'physical_intimidation'
  | 'digital_harassment'
  | 'workplace_sexual_harassment'
  | 'workplace_bullying_hostile'
  | 'quid_pro_quo'
  | 'retaliation_posh'
  | 'public_transit_safety';

export type CaseStatus =
  | 'submitted'
  | 'under_review'
  | 'more_info_requested'
  | 'action_planned'
  | 'resolved'
  | 'closed';

export interface AuditEvent {
  id: string;
  caseRef: string;
  eventType: 'report_created' | 'status_updated' | 'evidence_attached' | 'reviewer_assigned' | 'info_requested' | 'pattern_linked' | 'case_closed';
  timestamp: string;
  actorRole: UserRole;
  actorId: string;
  details: string;
  previousHash: string;
  currentHash: string;
}

export interface Report {
  id: string;
  caseRef: string;
  type: 'safereach' | 'speakup';
  concernCategory: ConcernCategory;
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
  evidenceFiles?: string[];
  status: CaseStatus;
  reviewerNotes?: string[];
  assignedReviewer?: string;
  followUpDeadline?: string;
  createdAt: string;
  updatedAt: string;
  auditLog: AuditEvent[];
}

export interface PatternCandidate {
  id: string;
  patternRef: string;
  title: string;
  concernCategory: ConcernCategory;
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

export type SupportedLanguage =
  | 'en' // English
  | 'kn' // Kannada
  | 'hi' // Hindi
  | 'te' // Telugu
  | 'ta' // Tamil
  | 'ml' // Malayalam
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'ur' // Urdu
  | 'as' // Assamese
  | 'sa'; // Sanskrit

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  bcp47: string;
  direction?: 'ltr' | 'rtl';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'saathi' | 'system';
  text: string;
  timestamp: string;
  language?: SupportedLanguage;
  isEmergencyAlert?: boolean;
}
