import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  PlusCircle,
  Hash,
} from 'lucide-react';
import { Report, SupportedLanguage, UserRole } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { verifyAuditChain } from '../utils/crypto';

interface TrustTrackProps {
  reports: Report[];
  selectedCaseRef?: string;
  language: SupportedLanguage;
  role: UserRole;
  onUpdateReportAction: (
    caseRef: string,
    newStatus: string,
    note: string,
    eventType: string
  ) => Promise<void>;
}

export const TrustTrackModule: React.FC<TrustTrackProps> = ({
  reports,
  selectedCaseRef,
  language,
  role,
  onUpdateReportAction,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [searchQuery, setSearchQuery] = useState(selectedCaseRef || 'TRN-2026-SR-9182');
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [chainVerification, setChainVerification] = useState<{
    isValid: boolean;
    brokenIndex?: number;
    message: string;
    verifying: boolean;
  }>({
    isValid: true,
    message: 'Verifying hash ledger...',
    verifying: true,
  });

  // Action form state for Reviewer
  const [reviewerStatus, setReviewerStatus] = useState('under_review');
  const [reviewerNote, setReviewerNote] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  // Sync with selectedCaseRef prop
  useEffect(() => {
    if (selectedCaseRef) {
      setSearchQuery(selectedCaseRef);
    }
  }, [selectedCaseRef]);

  // Find report and run chain verification
  useEffect(() => {
    const found = reports.find(
      (r) => r.caseRef.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    setActiveReport(found || reports[0] || null);
  }, [searchQuery, reports]);

  // Run cryptographic verification whenever activeReport changes
  useEffect(() => {
    if (activeReport && activeReport.auditLog) {
      setChainVerification((prev) => ({ ...prev, verifying: true }));
      verifyAuditChain(activeReport.auditLog).then((res) => {
        setChainVerification({
          isValid: res.isValid,
          brokenIndex: res.brokenIndex,
          message: res.message,
          verifying: false,
        });
      });
    }
  }, [activeReport]);

  const handleReviewerActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;
    setActionSubmitting(true);
    try {
      await onUpdateReportAction(
        activeReport.caseRef,
        reviewerStatus,
        reviewerNote || `Status updated to ${reviewerStatus} by ${role}`,
        'status_updated'
      );
      setReviewerNote('');
    } catch (err) {
      console.error('Failed to submit reviewer action:', err);
    } finally {
      setActionSubmitting(false);
    }
  };

  const statusProgression = [
    { id: 'submitted', label: 'Submitted' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'more_info_requested', label: 'Info Requested' },
    { id: 'action_planned', label: 'Action Planned' },
    { id: 'resolved', label: 'Resolved / Safe' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-[#FFFBF5] p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5 text-orange-700" />
              <span>TrustTrack • SHA-256 Tamper-Evident Case Timeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
              Immutable Case Accountability Ledger
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-xl">
              Track the exact review journey of your case without logging in. Every review milestone is cryptographically chained to guarantee records cannot be deleted or manipulated.
            </p>
          </div>

          {/* Quick Demo Case Selector */}
          <div className="flex flex-col gap-1.5 text-xs">
            <span className="font-bold text-gray-500 uppercase text-[10px]">
              Inspect Demo Cases:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {reports.slice(0, 3).map((r) => (
                <button
                  key={r.caseRef}
                  onClick={() => setSearchQuery(r.caseRef)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeReport?.caseRef === r.caseRef
                      ? 'bg-[#1E1B4B] text-white shadow-xs'
                      : 'bg-white border border-[#E2D2BC] text-gray-700 hover:bg-[#FEF7ED]'
                  }`}
                >
                  {r.caseRef}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Case Reference Search Input */}
        <div className="mt-6 pt-6 border-t border-[#E7D7C1]/70">
          <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
            Lookup Case by Reference Code
          </label>
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. TRN-2026-SR-9182"
              className="w-full text-xs sm:text-sm pl-10 pr-24 py-3 rounded-xl border border-gray-300 bg-white font-mono font-semibold focus:border-[#6D28D9] outline-hidden shadow-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <button
              onClick={() => {
                const found = reports.find(
                  (r) => r.caseRef.toLowerCase() === searchQuery.trim().toLowerCase()
                );
                setActiveReport(found || null);
              }}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#1E1B4B] text-white px-3 rounded-lg text-xs font-bold hover:bg-slate-900 cursor-pointer"
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      {activeReport ? (
        <div className="space-y-6">
          {/* Active Case Summary Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-base font-black text-[#1E1B4B]">
                    {activeReport.caseRef}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {activeReport.type === 'safereach' ? 'SafeReach' : 'SpeakUp POSH'}
                  </span>
                  <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {activeReport.anonymityMode}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#1E1B4B]">
                  {activeReport.categoryLabel}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>Logged: {new Date(activeReport.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Region: {activeReport.broadRegion}</span>
                  {activeReport.organization && (
                    <>
                      <span>•</span>
                      <span>Org: {activeReport.organization}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Milestone */}
              <div className="flex flex-col sm:items-end">
                <span className="text-[10px] uppercase font-bold text-gray-400">Current Status</span>
                <span className="text-sm font-black text-[#1E1B4B] capitalize bg-[#FEF7ED] border border-[#E7D7C1] px-3 py-1 rounded-xl mt-0.5">
                  {activeReport.status.replace(/_/g, ' ')}
                </span>
                {activeReport.assignedReviewer && (
                  <span className="text-[11px] text-gray-500 mt-1 font-medium">
                    Assigned: {activeReport.assignedReviewer}
                  </span>
                )}
              </div>
            </div>

            {/* Cryptographic Hash Chain Verification Badge */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                chainVerification.isValid
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    chainVerification.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-wide text-emerald-950 flex items-center gap-1.5">
                    <span>
                      {chainVerification.isValid
                        ? 'SHA-256 Hash Chain Verified (Zero Tampering)'
                        : 'Warning: Hash Inconsistency Detected'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    {chainVerification.message}
                  </p>
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-500 sm:text-right">
                <div>Genesis: GENESIS_ROOT_TRINETRA_2026</div>
                <div>Ledger Depth: {activeReport.auditLog.length} Blocks</div>
              </div>
            </div>

            {/* Status Visual Timeline Progression */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-3">
                Case Progression Milestones
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {statusProgression.map((s, idx) => {
                  const currentIdx = statusProgression.findIndex((item) => item.id === activeReport.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  return (
                    <div
                      key={s.id}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-[#6D28D9] bg-violet-50 text-[#6D28D9] font-bold shadow-xs'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono mb-0.5">Stage 0{idx + 1}</div>
                      <div className="text-xs">{s.label}</div>
                      {isCompleted && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">✓ Recorded</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviewer Action Notes If Any */}
            {activeReport.reviewerNotes && activeReport.reviewerNotes.length > 0 && (
              <div className="p-4 bg-[#FEF7ED] rounded-2xl border border-[#E7D7C1] space-y-2">
                <span className="text-xs font-bold text-[#1E1B4B] block">
                  Authorised Reviewer Guidance & Follow-up Notes:
                </span>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {activeReport.reviewerNotes.map((n, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#E7D7C1]">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Cryptographic SHA-256 Audit Chain Event Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1E1B4B] flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#6D28D9]" />
                  <span>Tamper-Evident Audit Event Blocks</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Each event payload is hashed with the previous event's hash using SHA-256.
                </p>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {activeReport.auditLog.length} Chain Blocks
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#E7D7C1] before:content-['']">
              {activeReport.auditLog.map((block, index) => (
                <div key={block.id} className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF7ED] border border-[#E7D7C1] text-[#1E1B4B] flex items-center justify-center font-bold text-xs shrink-0 z-10">
                    #{index + 1}
                  </div>

                  <div className="flex-1 bg-[#FFFBF5] p-4 rounded-2xl border border-[#E2D2BC] shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                        {block.eventType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {new Date(block.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-sans">
                      {block.details}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1">
                      <span className="font-semibold">Actor:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                        {block.actorId} ({block.actorRole})
                      </span>
                    </div>

                    {/* Cryptographic Link Hashes */}
                    <div className="pt-2 border-t border-[#E7D7C1]/60 space-y-1 font-mono text-[10px]">
                      <div className="text-gray-400 truncate">
                        <span className="font-bold text-gray-500">Prev Hash:</span> {block.previousHash}
                      </div>
                      <div className="text-[#6D28D9] font-semibold truncate">
                        <span className="font-bold text-[#1E1B4B]">Current Hash:</span> {block.currentHash}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviewer / Admin Action Panel (For evaluation and demo) */}
          {(role === 'reviewer' || role === 'admin') && (
            <div className="bg-[#FEF7ED] p-6 rounded-3xl border-2 border-purple-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9] bg-purple-100 px-2.5 py-0.5 rounded">
                  Authorised Reviewer Console
                </span>
                <span className="text-xs text-gray-500">
                  Role: <strong className="capitalize">{role}</strong>
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B]">
                Append Reviewer Action to Hash Chain
              </h3>
              <p className="text-xs text-gray-600">
                Updating the status or adding an official triage note will generate a new cryptographic SHA-256 block linked to block #{activeReport.auditLog.length}.
              </p>

              <form onSubmit={handleReviewerActionSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Target Status
                    </label>
                    <select
                      value={reviewerStatus}
                      onChange={(e) => setReviewerStatus(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                    >
                      <option value="under_review">Under Review</option>
                      <option value="more_info_requested">More Information Requested</option>
                      <option value="action_planned">Action Planned / Counsel Assigned</option>
                      <option value="resolved">Resolved / Safety Plan Completed</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Official Reviewer Note
                    </label>
                    <input
                      type="text"
                      value={reviewerNote}
                      onChange={(e) => setReviewerNote(e.target.value)}
                      placeholder="e.g. Coordinated with Bengaluru Night Patrol team..."
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={actionSubmitting}
                    className="flex items-center gap-2 bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{actionSubmitting ? 'Hashing New Block...' : 'Commit Audit Event'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-3xl border border-[#E7D7C1] text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-[#1E1B4B]">Case Reference Not Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Please verify the Case Reference code (e.g. TRN-2026-SR-9182) or choose one of the demo cases above.
          </p>
        </div>
      )}
    </div>
  );
};
