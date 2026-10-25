import React, { useState } from 'react';
import { Shield, Eye, Lock, Globe, AlertTriangle, UserCheck, Menu, X, ArrowUpRight, LogOut } from 'lucide-react';
import { SupportedLanguage, UserRole } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onOpenQuickExit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  role,
  setRole,
  onOpenQuickExit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'safereach', label: 'SafeReach (Domestic)' },
    { id: 'speakup', label: 'SpeakUp (POSH)' },
    { id: 'patternwatch', label: 'PatternWatch' },
    { id: 'trusttrack', label: 'TrustTrack' },
    { id: 'resources', label: 'Helplines' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FEF7ED]/95 backdrop-blur-md border-b border-[#E7D7C1] shadow-xs">
      {/* Emergency Hotline Header Strip */}
      <div className="bg-[#1E1B4B] text-[#FEF7ED] px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-amber-200">24x7 India Crisis Helplines:</span>
            <span>National Emergency: <strong className="text-white underline">112</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Women Helpline: <strong className="text-white underline">181</strong></span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Distress: <strong className="text-white underline">1091</strong></span>
          </div>

          <button
            onClick={onOpenQuickExit}
            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide transition-all shadow-xs cursor-pointer"
            title="Leaves this site instantly and opens a neutral page"
          >
            <LogOut className="w-3 h-3" />
            <span>{t.quickExit}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-xl bg-white border border-[#E7D7C1] p-1 shadow-xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="/trinetra-logo.png"
                alt="TRINETRA Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#1E1B4B] font-serif-brand">
                  TRINETRA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#7C3AED]/10 text-[#6D28D9] px-1.5 py-0.5 rounded">
                  India
                </span>
              </div>
              <span className="text-[11px] text-[#475569] font-medium tracking-tight -mt-0.5 hidden sm:inline">
                AI-Powered Women's Safety Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1E1B4B] text-white shadow-xs'
                      : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#FAF1E6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector, Demo Role Switcher, Primary CTA */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2D2BC] bg-[#FFFBF5] hover:bg-white text-xs font-semibold text-[#1E1B4B] transition-colors cursor-pointer"
                title="Select Indian Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#6D28D9]" />
                <span className="font-medium">{currentLangObj.nativeName}</span>
                <span className="text-[10px] text-gray-500 hidden sm:inline">({currentLangObj.code.toUpperCase()})</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2D2BC] rounded-xl shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Indian Regional Languages (14)
                  </div>
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`text-left px-2.5 py-2 rounded-lg text-xs flex flex-col cursor-pointer transition-colors ${
                          language === lang.code
                            ? 'bg-[#1E1B4B] text-white font-bold'
                            : 'text-[#1E293B] hover:bg-[#FEF7ED]'
                        }`}
                      >
                        <span className="font-semibold">{lang.nativeName}</span>
                        <span className={`text-[10px] ${language === lang.code ? 'text-purple-200' : 'text-gray-500'}`}>
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Demo Role Switcher (For Judges and Testers) */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2D2BC] bg-[#FAF1E6] hover:bg-white text-xs font-semibold text-[#1E1B4B] transition-colors cursor-pointer"
                title="Switch Role for Demo Evaluation"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                <span className="capitalize hidden sm:inline">{role}</span>
                <span className="text-[10px] bg-[#0D9488]/15 text-[#0F766E] px-1 rounded font-bold">
                  Demo
                </span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E2D2BC] rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Switch Evaluator Role
                  </div>
                  {(['reporter', 'reviewer', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleDropdownOpen(false);
                        if (r === 'reviewer' || r === 'admin') {
                          setCurrentTab('patternwatch');
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer ${
                        role === r ? 'bg-[#FEF7ED] text-[#6D28D9] font-bold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="capitalize">{r}</span>
                      {role === r && <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">Active</span>}
                    </button>
                  ))}
                  <div className="px-3 py-1.5 mt-1 border-t border-gray-100 text-[10px] text-gray-400">
                    Allows judges to inspect reviewer actions & case management without passwords.
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setCurrentTab('safereach')}
              className="hidden md:flex items-center gap-1.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Report Safely</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-[#E7D7C1] space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
                  currentTab === item.id ? 'bg-[#1E1B4B] text-white' : 'text-gray-700 hover:bg-[#FAF1E6]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentTab('safereach');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#6D28D9] text-white py-2.5 rounded-lg font-bold text-sm shadow-xs"
              >
                <Shield className="w-4 h-4 text-amber-300" />
                <span>Report Concern</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
