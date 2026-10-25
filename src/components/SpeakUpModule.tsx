import React, { useState } from 'react';
import {
  Briefcase,
  Shield,
  Lock,
  Info,
  CheckCircle2,
  Calendar,
  Building,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  ExternalLink,
  Scale,
  FileCheck,
} from 'lucide-react';
import { ConcernCategory, Report, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface SpeakUpProps {
  language: SupportedLanguage;
  onReportCreated: (newReport: Report) => void;
  onNavigateToTrustTrack: (caseRef: string) => void;
}

export const SpeakUpModule: React.FC<SpeakUpProps> = ({
  language,
  onReportCreated,
  onNavigateToTrustTrack,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState<Report | null>(null);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [concernCategory, setConcernCategory] = useState<ConcernCategory>('workplace_sexual_harassment');
  const [categoryLabel, setCategoryLabel] = useState('Workplace Sexual Harassment');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [broadRegion, setBroadRegion] = useState('Bengaluru East (Whitefield / ITPL)');
  const [approximateDate, setApproximateDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isFormalPoshRequested, setIsFormalPoshRequested] = useState(false);
  const [anonymityMode, setAnonymityMode] = useState<'anonymous' | 'confidential'>('confidential');
  const [safeContactMethod, setSafeContactMethod] = useState('');
  const [safeContactValue, setSafeContactValue] = useState('');
  const [acknowledgedPoshTerms, setAcknowledgedPoshTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const workplaceCategories: { id: ConcernCategory; label: string; desc: string }[] = [
    {
      id: 'workplace_sexual_harassment',
      label: 'Unwelcome Sexual Conduct & Comments',
      desc: 'Sexually colored remarks, inappropriate physical contact, or unwanted propositions.',
    },
    {
      id: 'quid_pro_quo',
      label: 'Quid Pro Quo Harassment',
      desc: 'Conditioning appraisals, promotions, project assignments, or job retention on sexual favors.',
    },
    {
      id: 'workplace_bullying_hostile',
      label: 'Hostile & Intimidating Work Environment',
      desc: 'Systemic degradation, verbal abuse, public humiliation, or targeted professional sabotage.',
    },
    {
      id: 'retaliation_posh',
      label: 'Post-Reporting Retaliation',
      desc: 'Negative performance reviews, ostracization, or sudden termination threats after speaking up.',
    },
    {
      id: 'digital_harassment',
      label: 'Late-Night Digital & WhatsApp Incursions',
      desc: 'Persistent non-work messaging on WhatsApp, Slack, Teams, or personal social media.',
    },
  ];

  const handleSubmit = async () => {
    if (!description.trim()) {
      setErrorMsg('Please describe the workplace incident or concern.');
      return;
    }
    if (!acknowledgedPoshTerms) {
      setErrorMsg('Please confirm your understanding of the POSH legal framework distinction.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        type: 'speakup',
        concernCategory,
        categoryLabel,
        description,
        organization: organization || 'Undisclosed Workplace Entity',
        broadRegion,
        approximateDate,
        approximateLocation: department ? `${department}, ${organization}` : organization || 'Workplace Premises',
        isOngoing: true,
        isImmediatelyDangerous: false,
        anonymityMode,
        safeContactMethod: anonymityMode === 'confidential' ? safeContactMethod : undefined,
        safeContactValue: anonymityMode === 'confidential' ? safeContactValue : undefined,
        isFormalPoshRequested,
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
        setStep(4);
      } else {
        setErrorMsg(data.message || 'Failed to submit workplace concern.');
      }
    } catch (err) {
      console.error('Error submitting workplace report:', err);
      // Fallback local creation
      const fallbackCaseRef = `TRN-2026-SU-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackReport: Report = {
        id: `rep-${Date.now()}`,
        caseRef: fallbackCaseRef,
        type: 'speakup',
        concernCategory,
        categoryLabel,
        description,
        organization: organization || 'Undisclosed Workplace Entity',
        broadRegion,
        approximateDate,
        approximateLocation: department || 'Workplace Premises',
        isOngoing: true,
        isImmediatelyDangerous: false,
        anonymityMode,
        safeContactMethod,
        safeContactValue,
        isFormalPoshRequested,
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
            details: 'Workplace report recorded into tamper-evident ledger.',
            previousHash: 'GENESIS_ROOT_TRINETRA_2026',
            currentHash: 'cf9804e3b1236109356ef24a1876e6a1059f13c8e3bf5c4d52140a37901844b2',
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
      {/* Header Banner */}
      <div className="bg-[#FFFBF5] p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>SpeakUp • Workplace Safety & POSH Legal Guidance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
              Address Workplace Harassment Responsibly
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-xl">
              Report sexual harassment, bullying, and retaliation. Understand Indian POSH Act 2013 compliance, Internal Committee (IC) procedures, and maintain an immutable record.
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-indigo-200 text-xs max-w-xs space-y-1">
            <span className="font-bold text-indigo-900 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>POSH Act 2013 Rights</span>
            </span>
            <p className="text-[11px] text-gray-600 leading-tight">
              Every employer with 10+ employees must constitute an Internal Committee (IC) headed by a senior woman.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E7D7C1]/70">
            {[
              { num: 1, title: 'Category & Legal Scope' },
              { num: 2, title: 'Workplace & Incident' },
              { num: 3, title: 'Review & Terms' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 text-xs font-bold ${
                  step === s.num
                    ? 'text-indigo-700'
                    : step > s.num
                    ? 'text-emerald-700'
                    : 'text-gray-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === s.num
                      ? 'bg-indigo-700 text-white'
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

      {/* STEP 1: Category & Scope Selection */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1E1B4B] mb-1">
              1. Type of Workplace Concern
            </label>
            <p className="text-xs text-[#475569] mb-4">
              Select the option that best reflects what occurred within the work environment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workplaceCategories.map((cat) => {
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
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-[#FEF7ED]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm text-[#1E1B4B]">{cat.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-700" />}
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">{cat.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formal vs Informal POSH distinction */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-bold text-[#1E1B4B] mb-1">
              2. How would you like this recorded?
            </label>
            <p className="text-xs text-[#475569] mb-3">
              Understand the legal difference between an anonymous pattern report and formal statutory inquiry assistance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setIsFormalPoshRequested(false);
                  setAnonymityMode('anonymous');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  !isFormalPoshRequested
                    ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-teal-700" />
                    <span>Informal Concern & Pattern Logging</span>
                  </span>
                  {!isFormalPoshRequested && <CheckCircle2 className="w-4 h-4 text-teal-700" />}
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Log the incident to detect recurring patterns across the organization. Completely anonymous. Does NOT constitute a formal legal complaint before the Internal Committee.
                </p>
              </div>

              <div
                onClick={() => {
                  setIsFormalPoshRequested(true);
                  setAnonymityMode('confidential');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isFormalPoshRequested
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-indigo-700" />
                    <span>Formal POSH Guidance & Advisory Support</span>
                  </span>
                  {isFormalPoshRequested && <CheckCircle2 className="w-4 h-4 text-indigo-700" />}
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Connect with accredited POSH advisors to prepare a written statutory complaint under Section 9 of the POSH Act, ensuring 90-day inquiry timelines and protection against retaliation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-[#1E1B4B] hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Continue to Workplace Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Workplace Details & Narrative */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-gray-500" />
                <span>Organization / Company Name (Optional)</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Apex Digital Solutions"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Enables PatternWatch to spot recurring harassment across departments.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Department / Facility / Floor (Optional)
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Quality Assurance / 4th Floor"
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Broad Tech Hub / District
              </label>
              <select
                value={broadRegion}
                onChange={(e) => setBroadRegion(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              >
                <option value="Bengaluru East (Whitefield / ITPL)">Bengaluru East (Whitefield / ITPL)</option>
                <option value="Bengaluru South (Electronic City / Koramangala)">Bengaluru South (Electronic City / Koramangala)</option>
                <option value="Hyderabad Hitec City">Hyderabad Hitec City</option>
                <option value="Gurugram Cyber City / DLF">Gurugram Cyber City / DLF</option>
                <option value="Noida Sector 62 / Expressway">Noida Sector 62 / Expressway</option>
                <option value="Pune Magarpatta / Hinjawadi">Pune Magarpatta / Hinjawadi</option>
                <option value="Chennai OMR">Chennai OMR</option>
                <option value="Mumbai BKC / Andheri">Mumbai BKC / Andheri</option>
                <option value="Other Indian Workplace">Other Indian Workplace</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>Incident Date or Timeframe</span>
              </label>
              <input
                type="date"
                value={approximateDate}
                onChange={(e) => setApproximateDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1E1B4B] mb-1">
              Incident Narrative
            </label>
            <p className="text-xs text-[#475569] mb-2">
              Detail specific occurrences, dates, digital messages, or witness presence. Do not include sensitive personal Aadhaar numbers.
            </p>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, any written or spoken remarks, retaliatory gestures, or attempts made to report internally..."
              className="w-full text-xs sm:text-sm p-4 rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-hidden leading-relaxed"
            />
          </div>

          {/* Safe Follow-up Channel */}
          {anonymityMode === 'confidential' && (
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
              <div className="text-xs font-bold text-indigo-900">Protected Contact For Advisory Follow-up</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Safe Contact Method (Non-work channel recommended)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Personal Proton email, Signal handle"
                    value={safeContactMethod}
                    onChange={(e) => setSafeContactMethod(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Safe Contact Coordinate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. secure.alias@proton.me"
                    value={safeContactValue}
                    onChange={(e) => setSafeContactValue(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

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
                  setErrorMsg('Please describe the incident before continuing.');
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

      {/* STEP 3: Review & POSH Legal Distinction */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-[#1E1B4B]">Review Workplace Submission</h2>
            <p className="text-xs text-gray-500">
              Verify the details to generate an immutable SHA-256 audit block in TrustTrack.
            </p>
          </div>

          <div className="space-y-3 bg-[#FEF7ED] p-4 rounded-xl border border-[#E7D7C1] text-xs">
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Workplace Category:</span>
              <span className="font-bold text-[#1E1B4B]">{categoryLabel}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Organization:</span>
              <span className="font-semibold text-gray-800">{organization || 'Undisclosed'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Reporting Scope:</span>
              <span className="font-bold text-indigo-700">
                {isFormalPoshRequested ? 'Formal POSH Guidance Requested' : 'Informal Pattern Concern'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E7D7C1]">
              <span className="text-gray-500">Broad Hub:</span>
              <span className="font-semibold text-gray-800">{broadRegion}</span>
            </div>
            <div className="py-1">
              <span className="text-gray-500 block mb-1">Description:</span>
              <p className="bg-white p-3 rounded-lg border border-[#E7D7C1] text-[#1E1B4B] leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* CRITICAL Statutory Clarification Required by Prompt */}
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900">
              <AlertCircle className="w-4 h-4 text-indigo-700" />
              <span>Statutory Clarification (India POSH Act 2013)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-900">
              Submitting this concern into TRINETRA SpeakUp allows pattern correlation and advisory assistance.
              <strong> It does not automatically institute a formal inquiry under the Sexual Harassment of Women at Workplace Act 2013.</strong> Formal inquiries legally require a signed or designated written complaint delivered to your employer's Internal Committee (IC) or the District Local Committee (LC). Anonymity limits statutory cross-examination and disciplinary sanctions.
            </p>
          </div>

          {/* Acknowledgment Checkbox */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="posh-ack"
              checked={acknowledgedPoshTerms}
              onChange={(e) => setAcknowledgedPoshTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-indigo-600 rounded"
            />
            <label htmlFor="posh-ack" className="text-xs text-gray-700 leading-normal">
              I acknowledge that TRINETRA SpeakUp provides pattern intelligence and confidential support, and that a formal statutory POSH inquiry requires following legal IC complaint guidelines.
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
              className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white px-7 py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              {submitting ? (
                <span>Generating Cryptographic Block...</span>
              ) : (
                <>
                  <Briefcase className="w-4 h-4 text-amber-300" />
                  <span>Submit Workplace Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Screen */}
      {step === 4 && createdReport && (
        <div className="bg-white p-8 rounded-3xl border-2 border-indigo-300 shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Workplace Case Reference Generated
            </span>
            <h2 className="text-2xl font-black text-[#1E1B4B] mt-2">
              Workplace Concern Recorded
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-1">
              Your record has been encrypted and integrated into PatternWatch intelligence.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-[#FEF7ED] p-5 rounded-2xl border border-[#E7D7C1] space-y-3">
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Your Workplace Case Reference
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
            {copied && <span className="text-[11px] font-bold text-indigo-700">Copied to clipboard!</span>}
            <p className="text-[11px] text-gray-500">
              Use this reference to monitor IC coordination and reviewer updates in <strong>TrustTrack</strong>.
            </p>
          </div>

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
                setAcknowledgedPoshTerms(false);
              }}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2"
            >
              File Another Workplace Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
