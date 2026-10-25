import React from 'react';
import {
  Shield,
  Eye,
  Lock,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  HeartHandshake,
  FileText,
  Sparkles,
  PhoneCall,
  Volume2,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HeroProps {
  onNavigate: (tab: string) => void;
  language: SupportedLanguage;
  onOpenSaathi: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, language, onOpenSaathi }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFBF5] via-[#FEF7ED] to-[#F5ECE1] border border-[#E7D7C1] shadow-sm p-6 sm:p-10 lg:p-14">
        {/* Subtle decorative glowing backdrops */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#EA580C]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Logo Badge & Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E2D2BC] shadow-xs mb-6 text-xs font-bold text-[#1E1B4B]">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span>{t.tagline}</span>
            <span className="text-[#94A3B8]">•</span>
            <span className="text-[#6D28D9] font-medium">India's AI Safety Platform</span>
          </div>

          {/* Prominent Logo Presentation */}
          <div className="relative mb-6 group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white p-2 shadow-md border-2 border-[#E7D7C1] flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <img
                src="/trinetra-logo.png"
                alt="TRINETRA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-2 bg-[#1E1B4B] text-[#FEF7ED] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#CBD5E1]">
              AI INTELLIGENCE
            </div>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E1B4B] tracking-tight leading-[1.15] max-w-4xl mb-5">
            {t.heroHeading}
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-[#334155] max-w-2xl font-normal leading-relaxed mb-8">
            {t.heroSubheading}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10 w-full max-w-md">
            <button
              onClick={() => onNavigate('safereach')}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>{t.reportConcern}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSaathi}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-white hover:bg-[#FEF7ED] text-[#1E1B4B] border border-[#D5C2A5] px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#6D28D9]" />
              <span>{t.talkToSaathi}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-6 border-t border-[#E7D7C1]/80 text-left">
            <div className="bg-white/70 p-3 rounded-xl border border-[#E7D7C1]">
              <div className="text-[#6D28D9] font-bold text-xs flex items-center gap-1.5 mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Identity PII</span>
              </div>
              <p className="text-[11px] text-[#475569]">No mandatory phone numbers or names required for anonymous safety reports.</p>
            </div>

            <div className="bg-white/70 p-3 rounded-xl border border-[#E7D7C1]">
              <div className="text-[#0D9488] font-bold text-xs flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Explainable AI</span>
              </div>
              <p className="text-[11px] text-[#475569]">PatternWatch correlates recurrence with transparent matching factors.</p>
            </div>

            <div className="bg-white/70 p-3 rounded-xl border border-[#E7D7C1]">
              <div className="text-[#EA580C] font-bold text-xs flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SHA-256 Ledger</span>
              </div>
              <p className="text-[11px] text-[#475569]">TrustTrack audit logs are cryptographically hash-chained against tampering.</p>
            </div>

            <div className="bg-white/70 p-3 rounded-xl border border-[#E7D7C1]">
              <div className="text-[#1E1B4B] font-bold text-xs flex items-center gap-1.5 mb-1">
                <Volume2 className="w-3.5 h-3.5" />
                <span>14 Languages</span>
              </div>
              <p className="text-[11px] text-[#475569]">Full voice & regional text support across major Indian mother tongues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars: LISTEN, DETECT, PROTECT */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9] bg-[#6D28D9]/10 px-2.5 py-1 rounded-full">
            Core Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] mt-2">
            The Tri-Fold Safety Paradigm
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Engineered specifically to solve the systemic underreporting of harassment and violence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: LISTEN */}
          <div className="bg-[#FFFBF5] border border-[#E2D2BC] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-[#6D28D9] mb-4">
                <span className="font-black text-lg">01</span>
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] mb-2">LISTEN — Safe Expression</h3>
              <p className="text-xs text-[#334155] leading-relaxed mb-4">
                Remove the barriers of fear, retaliation, and language. Users can record concerns confidentially or anonymously in any of 14 Indian languages using voice or text.
              </p>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Domestic abuse confidential reporting (SafeReach)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Workplace harassment & POSH guidance (SpeakUp)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('safereach')}
              className="mt-6 text-xs font-bold text-[#6D28D9] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Explore Reporting Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: DETECT */}
          <div className="bg-[#FFFBF5] border border-[#E2D2BC] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-[#0D9488] mb-4">
                <span className="font-black text-lg">02</span>
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] mb-2">DETECT — Pattern Intelligence</h3>
              <p className="text-xs text-[#334155] leading-relaxed mb-4">
                Individual isolated incidents often belong to predatory recurring patterns. PatternWatch groups anonymized signals by time, transit corridors, and modus operandi.
              </p>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Recurring predator & transit route clustering</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Explainable confidence factors (Zero black-box)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('patternwatch')}
              className="mt-6 text-xs font-bold text-[#0D9488] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View Pattern Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3: PROTECT */}
          <div className="bg-[#FFFBF5] border border-[#E2D2BC] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#EA580C] mb-4">
                <span className="font-black text-lg">03</span>
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] mb-2">PROTECT — Immutable Trust</h3>
              <p className="text-xs text-[#334155] leading-relaxed mb-4">
                Accountability requires proof. TrustTrack maintains a SHA-256 cryptographic audit chain for every reviewer action and status update, verifiable by the complainant.
              </p>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>Tamper-evident case reference timelines</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>Direct links to 112, 181, 1091, and NCW support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('trusttrack')}
              className="mt-6 text-xs font-bold text-[#EA580C] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Verify Audit Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Feature Cards */}
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#E7D7C1]">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1E1B4B]">Platform Modules</h2>
            <p className="text-xs text-[#475569]">Select a module to file a concern, inspect patterns, or track progress.</p>
          </div>
          <div className="text-xs font-bold text-[#6D28D9] mt-2 sm:mt-0">
            Real MVP • Zero Mock Placeholders
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: SafeReach */}
          <div
            onClick={() => onNavigate('safereach')}
            className="group bg-white p-6 rounded-2xl border border-[#E7D7C1] hover:border-[#6D28D9] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Domestic & Personal
                </span>
                <span className="text-xs text-gray-400 group-hover:text-[#6D28D9] font-semibold transition-colors">
                  Open SafeReach →
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1B4B] group-hover:text-[#6D28D9] transition-colors mb-2">
                SafeReach — Confidential Crisis Reporting
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                Sensitive reporting workflow for domestic abuse, coercive control, physical threats, stalking, and public transit harassment. Choose between Anonymous (zero trace) or Confidential (protected safe-contact) modes.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
              <span>Approximate Location</span>
              <span>•</span>
              <span>Emergency 112/181 Caveats</span>
              <span>•</span>
              <span>Safe Device Tips</span>
            </div>
          </div>

          {/* Card 2: SpeakUp */}
          <div
            onClick={() => onNavigate('speakup')}
            className="group bg-white p-6 rounded-2xl border border-[#E7D7C1] hover:border-[#6D28D9] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Workplace & POSH
                </span>
                <span className="text-xs text-gray-400 group-hover:text-[#6D28D9] font-semibold transition-colors">
                  Open SpeakUp →
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1B4B] group-hover:text-[#6D28D9] transition-colors mb-2">
                SpeakUp — Workplace Safety & POSH Guidance
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                Tailored for Indian corporate, tech campus, and informal sector workplaces. Differentiates between informal safety concerns (pattern tracking) and formal complaints under the POSH Act 2013 for Internal Committees (IC).
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
              <span>90-Day Inquiry Rules</span>
              <span>•</span>
              <span>Retaliation Logging</span>
              <span>•</span>
              <span>IC/LC Guidance</span>
            </div>
          </div>

          {/* Card 3: PatternWatch */}
          <div
            onClick={() => onNavigate('patternwatch')}
            className="group bg-white p-6 rounded-2xl border border-[#E7D7C1] hover:border-[#0D9488] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Explainable AI
                </span>
                <span className="text-xs text-gray-400 group-hover:text-[#0D9488] font-semibold transition-colors">
                  Open PatternWatch →
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1B4B] group-hover:text-[#0D9488] transition-colors mb-2">
                PatternWatch — Explainable Safety Pattern Detection
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                Aggregates signals across reports without exposing individual survivors. Detects recurring vehicle descriptions, evening transit timing clusters, and common organizational departments with transparent matching factors.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
              <span>Explain This Pattern</span>
              <span>•</span>
              <span>Confidence Scoring</span>
              <span>•</span>
              <span>Human Triage Loop</span>
            </div>
          </div>

          {/* Card 4: TrustTrack */}
          <div
            onClick={() => onNavigate('trusttrack')}
            className="group bg-white p-6 rounded-2xl border border-[#E7D7C1] hover:border-[#EA580C] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Cryptographic Ledger
                </span>
                <span className="text-xs text-gray-400 group-hover:text-[#EA580C] font-semibold transition-colors">
                  Open TrustTrack →
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1B4B] group-hover:text-[#EA580C] transition-colors mb-2">
                TrustTrack — Accountable Case Tracking & SHA-256 Chain
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                Track your Case Reference without disclosing identity. View tamper-evident audit events linking each status update to a cryptographic SHA-256 parent hash, proving reports are never silently discarded.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
              <span>SHA-256 Proof</span>
              <span>•</span>
              <span>Live Chain Verification</span>
              <span>•</span>
              <span>Status Milestones</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Demonstration Workflow */}
      <section className="max-w-5xl mx-auto bg-[#FFFBF5] rounded-3xl p-8 border border-[#E7D7C1]">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E1B4B] text-center mb-2">
          How TRINETRA Works
        </h2>
        <p className="text-xs text-[#475569] text-center max-w-lg mx-auto mb-8">
          A clear, accountable pipeline safeguarding reporter anonymity from initial report to verified action.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-white p-5 rounded-xl border border-[#E2D2BC] shadow-xs relative">
            <div className="text-xs font-black text-[#6D28D9] mb-1">STEP 1</div>
            <h4 className="font-bold text-[#1E1B4B] text-sm mb-1.5">Report Safely</h4>
            <p className="text-xs text-[#475569]">
              Survivor or witness submits details via SafeReach or SpeakUp in their preferred language. A cryptographic Case Reference code is generated.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2D2BC] shadow-xs relative">
            <div className="text-xs font-black text-[#0D9488] mb-1">STEP 2</div>
            <h4 className="font-bold text-[#1E1B4B] text-sm mb-1.5">Review Patterns</h4>
            <p className="text-xs text-[#475569]">
              PatternWatch correlates spatial-temporal signals across anonymized reports to spot recurring serial harassment or systemic workplace misconduct.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2D2BC] shadow-xs relative">
            <div className="text-xs font-black text-[#EA580C] mb-1">STEP 3</div>
            <h4 className="font-bold text-[#1E1B4B] text-sm mb-1.5">Track Follow-up</h4>
            <p className="text-xs text-[#475569]">
              Authorized reviewers record triage decisions into TrustTrack. Complainants verify the status and hash-linked audit events anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Resources Quick Callout */}
      <section className="max-w-5xl mx-auto bg-gradient-to-r from-rose-950 via-[#1E1B4B] to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Immediate Danger Assistance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              In Distress or Facing Imminent Harm?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              TRINETRA is a confidential reporting & intelligence platform. If you are experiencing physical assault or urgent danger right now, call India's verified emergency lines directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="tel:112"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 (National)</span>
            </a>
            <a
              href="tel:181"
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#1E1B4B] px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Call 181 (Women Helpline)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
