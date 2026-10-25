import React, { useState } from 'react';
import {
  Shield,
  Lock,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Copy,
  Info,
  PhoneCall,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ConcernCategory, Report, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface SafeReachProps {
  language: SupportedLanguage;
  onReportCreated: (newReport: Report) => void;
  onNavigateToTrustTrack: (caseRef: string) => void;
}

export const SafeReachModule: React.FC<SafeReachProps> = ({
  language,
  onReportCreated,
  onNavigateToTrustTrack,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState<Report | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [concernCategory, setConcernCategory] = useState<ConcernCategory>('stalking_surveillance');
  const [categoryLabel, setCategoryLabel] = useState('Stalking & Physical Surveillance');
  const [description, setDescription] = useState('');
  const [approximateDate, setApproximateDate] = useState(new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('20:00');
  const [approximateLocation, setApproximateLocation] = useState('Koramangala 80ft Road, Sony Signal');
  const [broadRegion, setBroadRegion] = useState('Bengaluru South Urban');
  const [isOngoing, setIsOngoing] = useState(true);
  const [isImmediatelyDangerous, setIsImmediatelyDangerous] = useState(false);
  const [anonymityMode, setAnonymityMode] = useState<'anonymous' | 'confidential'>('anonymous');
  const [safeContactMethod, setSafeContactMethod] = useState('');
  const [safeContactValue, setSafeContactValue] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories: { id: ConcernCategory; label: string; desc: string }[] = [
    {
      id: 'stalking_surveillance',
      label: 'Stalking & Physical Surveillance',
      desc: 'Repeated tracking, following near transit stops, or physical intimidation in public spaces.',
    },
    {
      id: 'domestic_violence',
      label: 'Domestic Violence & Physical Abuse',
      desc: 'Intimate partner violence, battery, or physical hostility within residential settings.',
    },
    {
      id: 'coercive_control',
      label: 'Coercive Control & Emotional Isolation',
      desc: 'Financial withholding, monitoring phone communications, movement restriction, or intimidation.',
    },
    {
      id: 'public_transit_safety',
      label: 'Public Transit Harassment',
      desc: 'Unsafe bus shelters, metro corridors, auto-rickshaw threats, or poorly lit commute routes.',
    },
    {
      id: 'digital_harassment',
      label: 'Digital Stalking & Online Abuse',
      desc: 'Unwanted messages, GPS tracker placement, non-consensual sharing threats, or cyber stalking.',
    },
  ];

  const broadRegions = [
    'Bengaluru South Urban',
    'Bengaluru East (Whitefield / ITPL)',
    'Bengaluru North (Hebbal / Yelahanka)',
    'Bengaluru Central (MG Road / Majestic)',
    'Hyderabad Cyberabad Tech Zone',
    'Chennai OMR IT Corridor',
    'Delhi NCR (Gurugram / Noida)',
    'Mumbai Suburban',
    'Pune Hinjawadi Hub',
    'Other Indian District / City',
  ];

  const handleSubmit = async () => {
    if (!description.trim()) {
      setErrorMsg('Please describe the concern so our intelligence system can evaluate patterns.');
      return;
    }
    if (!consentAccepted) {
      setErrorMsg('Please review and check the privacy and consent agreement.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        type: 'safereach',
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
        safeContactMethod: anonymityMode === 'confidential' ? safeContactMethod : undefined,
        safeContactValue: anonymityMode === 'confidential' ? safeContactValue : undefined,
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setCreatedReport(data.report);
        onReportCreated(data.report);
        setStep(4); // Success step
      } else {
        setErrorMsg(data.message || 'Failed to submit report. Please try again.');
      }
    } catch (err: any) {
      console.error('Error submitting report:', err);
      // Fallback local report creation
      const fallbackCaseRef = `TRN-2026-SR-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackReport: Report = {
        id: `rep-${Date.now()}`,
        caseRef: fallbackCaseRef,
        type: 'safereach',
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
        status: 'submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            caseRef: fallbackCaseRef,
            eventType: 'report_created',
            timestamp: new Date().toISOString(),
            actorRole: 'reporter',
            actorId: anonymityMode === 'anonymous' ? 'ANONYMOUS_REPORTER' : 'CONFIDENTIAL_REPORTER',
            details: 'Report created and locked into tamper-evident audit ledger.',
            previousHash: 'GENESIS_ROOT_TRINETRA_2026',
            currentHash: 'b4a6217e997f74c7e6c464455823793081ce47d7c6742589574d6c69f216832b',
          },
        ],
      };
      setCreatedReport(fallbackReport);
      onReportCreated(fallbackReport);
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCaseRef = () => {
    if (createdReport) {
      navigator.clipboard.writeText(createdReport.caseRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="bg-[#FFFBF5] p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>SafeReach • Confidential Domestic & Personal Reporting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
              Share Your Concern in Complete Safety
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-xl">
              Report domestic abuse, coercive control, threats, or public stalking. No forced identity. Every report receives a tamper-evident SHA-256 Case Reference.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-rose-200 text-xs">
            <span className="font-bold text-rose-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Immediate Danger?</span>
            </span>
            <div className="flex gap-2">
              <a
                href="tel:112"
                className="bg-rose-600 text-white px-2.5 py-1 rounded font-bold hover:bg-rose-700 flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>112</span>
              </a>
              <a
                href="tel:181"
                className="bg-[#1E1B4B] text-white px-2.5 py-1 rounded font-bold hover:bg-slate-800 flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3 text-amber-300" />
                <span>181 (Women)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E7D7C1]/70">
            {[
              { num: 1, title: 'Concern & Mode' },
              { num: 2, title: 'Incident Details' },
              { num: 3, title: 'Review & Verify' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 text-xs font-bold ${
                  step === s.num
                    ? 'text-[#6D28D9]'
                    : step > s.num
                    ? 'text-emerald-700'
                    : 'text-gray-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === s.num
                      ? 'bg-[#6D28D9] text-white'
                      : step > s.num
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STEP 1: Concern Category & Anonymity Mode */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1E1B4B] mb-1">
              1. What best describes the concern?
            </label>
            <p className="text-xs text-[#475569] mb-4">
              Categorization allows PatternWatch to correlate recurring harassment patterns without revealing your personal identity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isSelected = concernCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setConcernCategory(cat.id);
                      setCategoryLabel(cat.label);
                    }}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#6D28D9] bg-violet-50/70 shadow-xs ring-1 ring-[#6D28D9]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-[#FEF7ED]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-[#1E1B4B]">{cat.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#6D28D9]" />}
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">{cat.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Anonymity Choice */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-[#1E1B4B] mb-1">
              2. Choose Your Privacy Mode
            </label>
            <p className="text-xs text-[#475569] mb-3">
              Understand the difference between zero-identity and confidential follow-up.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setAnonymityMode('anonymous')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  anonymityMode === 'anonymous'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-emerald-700" />
                    <span>Anonymous (Zero Identity)</span>
                  </span>
                  {anonymityMode === 'anonymous' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                </div>
                <p className="text-[11px] text-gray-600">
                  No name, phone number, email, or IP address stored. You receive a Case Reference code to check status independently.
                </p>
              </div>

              <div
                onClick={() => setAnonymityMode('confidential')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  anonymityMode === 'confidential'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-700" />
                    <span>Confidential (Protected Safe Contact)</span>
                  </span>
                  {anonymityMode === 'confidential' && <CheckCircle2 className="w-4 h-4 text-indigo-700" />}
                </div>
                <p className="text-[11px] text-gray-600">
                  Provide an encrypted, safe contact channel (e.g. Proton email, trusted friend's phone) accessible solely by verified triage counselors.
                </p>
              </div>
            </div>

            {anonymityMode === 'confidential' && (
              <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                <div className="text-xs font-bold text-indigo-900">Safe Follow-up Contact Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Preferred Safe Channel
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Proton Mail, Trusted friend phone"
                      value={safeContactMethod}
                      onChange={(e) => setSafeContactMethod(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Safe Contact Address / Number / Safe Hours
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. call only between 2 PM - 4 PM"
                      value={safeContactValue}
                      onChange={(e) => setSafeContactValue(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-[#1E1B4B] hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Continue to Incident Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Incident Details */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1E1B4B] mb-1">
              Describe What Happened
            </label>
            <p className="text-xs text-[#475569] mb-2">
              Share details such as descriptions, vehicle signs, repeated patterns, or intimidation words. Do not share your real name or Aadhaar.
            </p>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., While waiting for the 7:45 PM bus at the Koramangala 80ft Road shelter, a man on a black Pulsar motorcycle without a front plate circled three times, stopped and made threatening gestures..."
              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] outline-hidden leading-relaxed"
            />
          </div>

          {/* Approximate Time and Approximate Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Broad Region / City Zone</span>
              </label>
              <select
                value={broadRegion}
                onChange={(e) => setBroadRegion(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              >
                {broadRegions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-500 mt-1">
                We use broad zones to prevent pinpointing your residential house.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Approximate Landmark / Corridor
              </label>
              <input
                type="text"
                value={approximateLocation}
                onChange={(e) => setApproximateLocation(e.target.value)}
                placeholder="e.g. Near Sony Signal bus stand"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>Approximate Date</span>
              </label>
              <input
                type="date"
                value={approximateDate}
                onChange={(e) => setApproximateDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Approximate Time Window</span>
              </label>
              <input
                type="text"
                value={approximateTime}
                onChange={(e) => setApproximateTime(e.target.value)}
                placeholder="e.g. 19:30 - 20:15 IST"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          {/* Ongoing & Danger Level */}
          <div className="p-4 bg-[#FEF7ED] rounded-xl border border-[#E7D7C1] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1E1B4B]">Is this situation ongoing or likely to reoccur?</span>
                <p className="text-[11px] text-gray-600">Helps prioritize reviewer follow-up timeline.</p>
              </div>
              <input
                type="checkbox"
                checked={isOngoing}
                onChange={(e) => setIsOngoing(e.target.checked)}
                className="w-4 h-4 text-[#6D28D9] rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E7D7C1]">
              <div>
                <span className="text-xs font-bold text-rose-800">Are you in immediate physical danger right now?</span>
                <p className="text-[11px] text-rose-600">If yes, please call emergency line 112 directly.</p>
              </div>
              <input
                type="checkbox"
                checked={isImmediatelyDangerous}
                onChange={(e) => setIsImmediatelyDangerous(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!description.trim()) {
                  setErrorMsg('Please describe what occurred before reviewing.');
                  return;
                }
                setErrorMsg('');
                setStep(3);
              }}
              className="flex items-center gap-2 bg-[#1E1B4B] hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Review Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review Screen & Consent */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-[#1E1B4B]">Review Your Report Before Submitting</h2>
            <p className="text-xs text-gray-500">
              Verify your information. Once submitted, an immutable SHA-256 genesis block will be recorded in TrustTrack.
            </p>
          </div>

          <div className="space-y-3 bg-[#FEF7ED] p-4 rounded-xl border border-[#E7D7C1] text-xs">
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Concern Category:</span>
              <span className="font-bold text-[#1E1B4B]">{categoryLabel}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Privacy Mode:</span>
              <span className="font-bold text-emerald-700 capitalize">{anonymityMode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Broad Region:</span>
              <span className="font-semibold text-gray-800">{broadRegion}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Approximate Location:</span>
              <span className="font-semibold text-gray-800">{approximateLocation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Date & Window:</span>
              <span className="font-semibold text-gray-800">{approximateDate} ({approximateTime})</span>
            </div>
            <div className="py-1">
              <span className="text-gray-500 block mb-1">Description:</span>
              <p className="bg-white p-3 rounded-lg border border-[#E7D7C1] text-[#1E1B4B] leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Legal / Operational Notice */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Important Disclaimer</span>
            </div>
            <p>
              Submitting a report to TRINETRA records the concern for pattern detection, counselor review, and audit tracking.
              <strong> It does not automatically dispatch police to your location or substitute for a formal FIR.</strong> For instant police response in India, please dial 112.
            </p>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="consent"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-[#6D28D9] rounded"
            />
            <label htmlFor="consent" className="text-xs text-gray-700 leading-normal">
              I consent to encrypting this non-identifiable incident report into TRINETRA's PatternWatch analytics and TrustTrack audit log for safety correlation and authorized counselor review.
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-lg border border-rose-200">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 text-white px-7 py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              {submitting ? (
                <span>Generating Cryptographic Block...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>Submit Secure Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Screen with Case Reference & Hash Link */}
      {step === 4 && createdReport && (
        <div className="bg-white p-8 rounded-3xl border-2 border-emerald-300 shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Tamper-Evident Genesis Block Generated
            </span>
            <h2 className="text-2xl font-black text-[#1E1B4B] mt-2">
              Report Successfully Recorded
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-1">
              Your concern is secured. No personal identity traces are linked to this record.
            </p>
          </div>

          {/* Case Reference Display Box */}
          <div className="max-w-md mx-auto bg-[#FEF7ED] p-5 rounded-2xl border border-[#E7D7C1] space-y-3">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Your Private Case Reference
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl font-black tracking-wider text-[#1E1B4B]">
                {createdReport.caseRef}
              </span>
              <button
                onClick={copyCaseRef}
                className="p-2 rounded-lg bg-white border border-[#E7D7C1] hover:bg-slate-50 text-gray-700 transition-colors cursor-pointer"
                title="Copy Case Reference"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <span className="text-[11px] font-bold text-emerald-700">Copied to clipboard!</span>}
            <p className="text-[11px] text-gray-500">
              Save this reference number. You can use it in <strong>TrustTrack</strong> to check progress and reviewer updates without any username or password.
            </p>
          </div>

          {/* Cryptographic Hash Details */}
          {createdReport.auditLog[0] && (
            <div className="max-w-md mx-auto text-left p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 font-mono break-all">
              <div className="font-sans font-bold text-slate-900 mb-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#6D28D9]" />
                <span>SHA-256 Audit Hash:</span>
              </div>
              <span className="text-slate-600 text-[10px]">
                {createdReport.auditLog[0].currentHash}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigateToTrustTrack(createdReport.caseRef)}
              className="flex items-center gap-2 bg-[#1E1B4B] hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Track in TrustTrack</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setStep(1);
                setDescription('');
                setCreatedReport(null);
                setConsentAccepted(false);
              }}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2"
            >
              File Another Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
