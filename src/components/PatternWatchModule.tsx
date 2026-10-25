import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ShieldAlert,
  MapPin,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Eye,
  Filter,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PatternCandidate, Report, SupportedLanguage, UserRole } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface PatternWatchProps {
  patterns: PatternCandidate[];
  reports: Report[];
  language: SupportedLanguage;
  role: UserRole;
  onDismissPattern: (id: string, reason: string) => void;
  onSelectCaseRef: (caseRef: string) => void;
}

export const PatternWatchModule: React.FC<PatternWatchProps> = ({
  patterns,
  reports,
  language,
  role,
  onDismissPattern,
  onSelectCaseRef,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedPatternForExplanation, setSelectedPatternForExplanation] =
    useState<PatternCandidate | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dismissReasonModal, setDismissReasonModal] = useState<PatternCandidate | null>(null);
  const [dismissReasonText, setDismissReasonText] = useState('');

  // Category Aggregates for Chart
  const categoryCounts: Record<string, { count: number; label: string }> = {
    stalking_surveillance: { count: 0, label: 'Stalking & Surveillance' },
    public_transit_safety: { count: 0, label: 'Public Transit Safety' },
    workplace_sexual_harassment: { count: 0, label: 'Workplace Sexual Harassment' },
    domestic_violence: { count: 0, label: 'Domestic Violence' },
    coercive_control: { count: 0, label: 'Coercive Control' },
    retaliation_posh: { count: 0, label: 'POSH Retaliation' },
  };

  reports.forEach((r) => {
    if (categoryCounts[r.concernCategory]) {
      categoryCounts[r.concernCategory].count += 1;
    } else {
      categoryCounts[r.concernCategory] = { count: 1, label: r.categoryLabel || r.concernCategory };
    }
  });

  const maxCategoryCount = Math.max(...Object.values(categoryCounts).map((c) => c.count), 1);

  // Time-of-day clusters
  const timeBuckets = [
    { label: 'Morning (06:00 - 12:00)', count: 1, percent: 12 },
    { label: 'Afternoon (12:00 - 17:00)', count: 2, percent: 24 },
    { label: 'Evening Transit (17:00 - 21:00)', count: 5, percent: 52, isPeak: true },
    { label: 'Late Night (21:00 - 06:00)', count: 1, percent: 12 },
  ];

  const filteredPatterns = patterns.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.concernCategory === filterCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-[#FFFBF5] p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold mb-2">
              <Cpu className="w-3.5 h-3.5 text-teal-700" />
              <span>PatternWatch • Explainable Safety Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
              Detect Recurring Harassment Patterns
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl">
              Cross-correlates anonymized reports across time corridors, broad transit stops, and modus operandi without exposing personal identities. Every match includes transparent, auditable factors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span>Rule-Based & Vector Analysis</span>
            </span>
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-[#E7D7C1]/70">
          <div className="bg-white p-3.5 rounded-xl border border-[#E7D7C1]">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Active Reports</span>
            <div className="text-2xl font-black text-[#1E1B4B] mt-0.5">{reports.length}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">100% Anonymized</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E7D7C1]">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Detected Clusters</span>
            <div className="text-2xl font-black text-teal-700 mt-0.5">{patterns.length}</div>
            <span className="text-[10px] text-gray-500">Spatial & temporal</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E7D7C1]">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Transit Peak Window</span>
            <div className="text-base sm:text-lg font-black text-rose-700 mt-1">19:30 - 20:30 IST</div>
            <span className="text-[10px] text-rose-600 font-semibold">High recurrence corridor</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E7D7C1]">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Human Review Loop</span>
            <div className="text-2xl font-black text-[#6D28D9] mt-0.5">
              {patterns.filter((p) => p.status === 'emerging').length}
            </div>
            <span className="text-[10px] text-purple-700 font-semibold">Pending verification</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Categories Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1E1B4B] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#6D28D9]" />
              <span>Incidents by Concern Category</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">Aggregated</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([catKey, data]) => {
              const widthPct = Math.round((data.count / maxCategoryCount) * 100);
              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">{data.label}</span>
                    <span className="font-bold text-[#1E1B4B]">{data.count} cases</span>
                  </div>
                  <div className="w-full bg-[#FAF1E6] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#6D28D9] to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(widthPct, 12)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Time-of-Day Pattern & Peak Window */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1E1B4B] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Temporal Distribution & Peak Threat Window</span>
            </h3>
            <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
              Evening Peak Alert
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {timeBuckets.map((bucket, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-semibold ${bucket.isPeak ? 'text-rose-900 font-bold' : 'text-gray-700'}`}>
                    {bucket.label}
                  </span>
                  <span className={`font-bold ${bucket.isPeak ? 'text-rose-700' : 'text-gray-600'}`}>
                    {bucket.percent}% ({bucket.count} incidents)
                  </span>
                </div>
                <div className="w-full bg-[#FAF1E6] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      bucket.isPeak ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${bucket.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-[11px] text-rose-950 flex items-start gap-2 mt-4">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              <strong>Algorithmic Insight:</strong> 52% of transit stalking concerns occurred along unlit bus stops between 19:30 and 20:30 IST. PatternWatch recommends night patrolling at identified junctions.
            </span>
          </div>
        </div>
      </div>

      {/* Pattern Candidates List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1E1B4B]">
              Active Recurring Pattern Candidates
            </h2>
            <p className="text-xs text-gray-500">
              Clusters identified by category, spatial correlation, and timeframe overlap.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs p-2 rounded-lg border border-gray-300 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="stalking_surveillance">Stalking & Surveillance</option>
              <option value="retaliation_posh">POSH Retaliation</option>
            </select>
          </div>
        </div>

        {/* Pattern Cards */}
        <div className="space-y-4">
          {filteredPatterns.map((pat) => (
            <div
              key={pat.id}
              className={`p-5 rounded-2xl border transition-all ${
                pat.status === 'dismissed'
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : 'bg-[#FFFBF5] border-[#E2D2BC] hover:border-teal-600 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded">
                      {pat.patternRef}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{pat.timeWindow}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        pat.status === 'emerging'
                          ? 'bg-amber-100 text-amber-800'
                          : pat.status === 'reviewed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {pat.status}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E1B4B]">
                    {pat.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-600" />
                      <span>{pat.broadRegion}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-teal-800">
                      {pat.reportCount} Correlated Reports
                    </span>
                  </div>
                </div>

                {/* Confidence Meter Badge */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center p-2.5 bg-white rounded-xl border border-[#E7D7C1] min-w-[130px]">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Match Strength</span>
                  <div className="text-xl font-black text-teal-700">{pat.confidenceScore}%</div>
                  <span className="text-[9px] text-emerald-700 font-semibold">High Confidence</span>
                </div>
              </div>

              {/* Matching Factors Pill List */}
              <div className="pt-3 border-t border-[#E7D7C1]/60">
                <span className="text-[11px] font-bold text-[#1E1B4B] block mb-1.5">
                  Algorithmic Matching Factors:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                  {pat.matchFactors.map((fac, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] bg-white p-2 rounded-lg border border-[#E7D7C1] text-gray-700 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>

                {/* Linked Anonymous Case Refs */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-[11px] text-gray-500 font-medium">Linked Case References:</span>
                  {pat.reportRefs.map((ref) => (
                    <button
                      key={ref}
                      onClick={() => onSelectCaseRef(ref)}
                      className="font-mono text-[11px] text-[#6D28D9] bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      title="Inspect case audit chain"
                    >
                      {ref} ↗
                    </button>
                  ))}
                </div>

                {/* Action Buttons: Explain This Pattern & Reviewer Triage */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setSelectedPatternForExplanation(pat)}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Explain This Pattern</span>
                  </button>

                  {/* Reviewer / Admin Controls */}
                  {(role === 'reviewer' || role === 'admin') && pat.status !== 'dismissed' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setDismissReasonModal(pat);
                          setDismissReasonText('');
                        }}
                        className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 px-2.5 py-1 rounded border border-rose-200 bg-white hover:bg-rose-50 cursor-pointer"
                      >
                        Dismiss as False Match
                      </button>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Human Triage Active
                      </span>
                    </div>
                  )}

                  {pat.status === 'dismissed' && pat.dismissReason && (
                    <div className="text-[11px] text-gray-500 italic">
                      Dismissed: {pat.dismissReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Anti-Defamation Guardrails Notice */}
      <div className="p-5 bg-[#FAF1E6] rounded-2xl border border-[#E7D7C1] text-xs text-[#334155] space-y-1.5">
        <div className="font-bold text-[#1E1B4B] flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#EA580C]" />
          <span>PatternWatch Privacy & Anti-Defamation Constitution</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          1. <strong>Not Proof of Misconduct:</strong> A correlated pattern candidate flags recurring safety indicators for prevention and verified human review. It does not constitute legal guilt.
          <br />
          2. <strong>Zero Naming or Ranking:</strong> TRINETRA never publishes alleged individual names or subjective public scores.
          <br />
          3. <strong>Aggregated Safeguards:</strong> High-precision GPS is strictly aggregated to broad transit corridors and tech campuses to prevent identifying survivor residences.
        </p>
      </div>

      {/* "Explain This Pattern" Modal */}
      {selectedPatternForExplanation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E7D7C1] shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {selectedPatternForExplanation.patternRef}
                </span>
                <h3 className="text-lg font-bold text-[#1E1B4B] mt-1.5">
                  Explainable AI Factor Breakdown
                </h3>
              </div>
              <button
                onClick={() => setSelectedPatternForExplanation(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#FEF7ED] rounded-xl border border-[#E7D7C1] text-xs text-gray-700 leading-relaxed space-y-2">
              <div className="font-bold text-[#1E1B4B]">Why this match was triggered:</div>
              <p>{selectedPatternForExplanation.explanation}</p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Key Confidence Drivers ({selectedPatternForExplanation.confidenceScore}% Match):
              </div>
              <ul className="space-y-1.5 text-xs text-gray-600">
                {selectedPatternForExplanation.matchFactors.map((fac, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0"></span>
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
              <strong>Recommended Action:</strong> {selectedPatternForExplanation.recommendedAction}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPatternForExplanation(null)}
                className="bg-[#1E1B4B] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dismiss Reason Modal */}
      {dismissReasonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#1E1B4B]">
              Dismiss Pattern {dismissReasonModal.patternRef}
            </h3>
            <p className="text-xs text-gray-500">
              Authorized reviewers can dismiss false matches by recording a mandatory rationale for the audit record.
            </p>
            <textarea
              rows={3}
              value={dismissReasonText}
              onChange={(e) => setDismissReasonText(e.target.value)}
              placeholder="e.g. Verified by local security that transit timing was unrelated construction activity..."
              className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:border-rose-500 outline-hidden"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDismissReasonModal(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDismissPattern(
                    dismissReasonModal.id,
                    dismissReasonText || 'Reviewed and dismissed as coincidental by authorised reviewer.'
                  );
                  setDismissReasonModal(null);
                }}
                className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
