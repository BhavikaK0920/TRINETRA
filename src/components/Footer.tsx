import React from 'react';
import { Shield, Lock, Eye, Heart, Globe, ArrowUpRight, PhoneCall } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FooterProps {
  language: SupportedLanguage;
  onNavigate: (tab: string) => void;
  onOpenQuickExit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate, onOpenQuickExit }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <footer className="bg-[#1E1B4B] text-[#FEF7ED] border-t border-[#E7D7C1]/30 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 flex items-center justify-center">
                <img
                  src="/trinetra-logo.png"
                  alt="TRINETRA Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-black font-serif-brand tracking-tight text-white">
                  TRINETRA
                </span>
                <span className="text-[10px] text-purple-300 block -mt-1">
                  Women's Safety Intelligence
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              “See the Signs. Protect the Silent.”
              <br />
              A privacy-conscious full-stack platform for India combining confidential crisis reporting, workplace POSH guidance, explainable AI pattern detection, and cryptographic SHA-256 case tracking.
            </p>
            <div className="text-[11px] text-purple-200">
              Zero PII stored in public analytics.
            </div>
          </div>

          {/* Core Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('safereach')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  SafeReach (Domestic Safety)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('speakup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  SpeakUp (Workplace POSH)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patternwatch')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  PatternWatch (Explainable AI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trusttrack')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  TrustTrack (Cryptographic Ledger)
                </button>
              </li>
            </ul>
          </div>

          {/* India Crisis Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              24x7 India Crisis Helplines
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center justify-between">
                <span>National Emergency:</span>
                <a href="tel:112" className="font-bold text-white hover:underline">
                  112
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>Women Helpline:</span>
                <a href="tel:181" className="font-bold text-amber-300 hover:underline">
                  181
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>Women in Distress:</span>
                <a href="tel:1091" className="font-bold text-white hover:underline">
                  1091
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>Cyber Crime Portal:</span>
                <a href="tel:1930" className="font-bold text-white hover:underline">
                  1930
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>NCW WhatsApp:</span>
                <span className="font-bold text-emerald-300">+91 7827170170</span>
              </li>
            </ul>
          </div>

          {/* Privacy & Safe Exit */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Safety & Escape
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you feel unsafe or someone approaches your screen, trigger instant escape to a neutral weather search.
            </p>
            <button
              onClick={onOpenQuickExit}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t.quickExit}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-slate-400">
              Remember to clear device history if your browser is monitored.
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2026 TRINETRA Intelligence Platform.</span>
            <span>•</span>
            <span>Built for India with Privacy-First Architecture.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => onNavigate('resources')} className="hover:text-white">
              Legal Rights & POSH Guide
            </button>
            <span>•</span>
            <span className="text-purple-300 font-mono">SHA-256 Ledger Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
