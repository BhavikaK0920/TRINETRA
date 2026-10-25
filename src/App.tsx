/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SafeReachModule } from './components/SafeReachModule';
import { SpeakUpModule } from './components/SpeakUpModule';
import { PatternWatchModule } from './components/PatternWatchModule';
import { TrustTrackModule } from './components/TrustTrackModule';
import { EmergencyResources } from './components/EmergencyResources';
import { TrinetraSaathiChat } from './components/TrinetraSaathiChat';
import { QuickExitModal } from './components/QuickExitModal';
import { Footer } from './components/Footer';
import { INITIAL_PATTERNS, INITIAL_REPORTS } from './data/seedData';
import { PatternCandidate, Report, SupportedLanguage, UserRole } from './types';
import { MessageSquare, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [role, setRole] = useState<UserRole>('reporter');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [patterns, setPatterns] = useState<PatternCandidate[]>(INITIAL_PATTERNS);
  const [selectedCaseRef, setSelectedCaseRef] = useState<string>('TRN-2026-SR-9182');
  const [saathiChatOpen, setSaathiChatOpen] = useState<boolean>(false);
  const [quickExitOpen, setQuickExitOpen] = useState<boolean>(false);

  // Sync with backend API on mount
  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reports && data.reports.length > 0) {
          setReports(data.reports);
        }
      })
      .catch((err) => console.log('Using local seed data for reports:', err));

    fetch('/api/patterns')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.patterns && data.patterns.length > 0) {
          setPatterns(data.patterns);
        }
      })
      .catch((err) => console.log('Using local seed data for patterns:', err));
  }, []);

  const handleReportCreated = (newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
    setSelectedCaseRef(newReport.caseRef);
  };

  const handleUpdateReportAction = async (
    caseRef: string,
    newStatus: string,
    note: string,
    eventType: string
  ) => {
    try {
      const res = await fetch(`/api/reports/${caseRef}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note,
          reviewerName: role === 'admin' ? 'System_Administrator' : 'Reviewer_Kavitha_R',
          eventType,
        }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReports((prev) =>
          prev.map((r) => (r.caseRef === caseRef ? data.report : r))
        );
      }
    } catch (err) {
      console.error('Failed to submit reviewer action:', err);
    }
  };

  const handleDismissPattern = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/patterns/${id}/dismiss`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success && data.pattern) {
        setPatterns((prev) =>
          prev.map((p) => (p.id === id ? data.pattern : p))
        );
      }
    } catch (err) {
      console.error('Failed to dismiss pattern:', err);
      // Fallback
      setPatterns((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: 'dismissed', dismissReason: reason } : p
        )
      );
    }
  };

  const handleNavigateToTrustTrack = (caseRef: string) => {
    setSelectedCaseRef(caseRef);
    setCurrentTab('trusttrack');
  };

  return (
    <div className="min-h-screen bg-[#FEF7ED] text-[#0F172A] flex flex-col font-sans selection:bg-[#7C3AED]/20 selection:text-[#1E1B4B]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        role={role}
        setRole={setRole}
        onOpenQuickExit={() => setQuickExitOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        {currentTab === 'home' && (
          <Hero
            onNavigate={(tab) => setCurrentTab(tab)}
            language={language}
            onOpenSaathi={() => setSaathiChatOpen(true)}
          />
        )}

        {currentTab === 'safereach' && (
          <SafeReachModule
            language={language}
            onReportCreated={handleReportCreated}
            onNavigateToTrustTrack={handleNavigateToTrustTrack}
          />
        )}

        {currentTab === 'speakup' && (
          <SpeakUpModule
            language={language}
            onReportCreated={handleReportCreated}
            onNavigateToTrustTrack={handleNavigateToTrustTrack}
          />
        )}

        {currentTab === 'patternwatch' && (
          <PatternWatchModule
            patterns={patterns}
            reports={reports}
            language={language}
            role={role}
            onDismissPattern={handleDismissPattern}
            onSelectCaseRef={handleNavigateToTrustTrack}
          />
        )}

        {currentTab === 'trusttrack' && (
          <TrustTrackModule
            reports={reports}
            selectedCaseRef={selectedCaseRef}
            language={language}
            role={role}
            onUpdateReportAction={handleUpdateReportAction}
          />
        )}

        {currentTab === 'resources' && (
          <EmergencyResources language={language} />
        )}
      </main>

      {/* Floating TRINETRA SAATHI Chat Trigger Button */}
      {!saathiChatOpen && (
        <button
          onClick={() => setSaathiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#1E1B4B] to-[#4338CA] hover:from-[#2E1065] hover:to-[#6D28D9] text-[#FEF7ED] p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border-2 border-[#E7D7C1] flex items-center gap-3 transition-all transform hover:scale-105 group cursor-pointer"
          title="Open TRINETRA SAATHI AI Voice & Text Assistant"
        >
          <div className="relative w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img
              src="/trinetra-logo.png"
              alt="TRINETRA Logo"
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-tight font-serif-brand text-white">
              TRINETRA SAATHI
            </span>
            <span className="text-[10px] text-amber-200 font-medium">
              Voice & Safety Assistant
            </span>
          </div>
        </button>
      )}

      {/* TRINETRA SAATHI Chat Drawer */}
      <TrinetraSaathiChat
        language={language}
        setLanguage={setLanguage}
        isOpen={saathiChatOpen}
        onClose={() => setSaathiChatOpen(false)}
        currentContext={currentTab}
      />

      {/* Quick Exit Safe Escape Modal */}
      <QuickExitModal
        isOpen={quickExitOpen}
        onClose={() => setQuickExitOpen(false)}
      />

      {/* Global Footer */}
      <Footer
        language={language}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenQuickExit={() => setQuickExitOpen(true)}
      />
    </div>
  );
}
