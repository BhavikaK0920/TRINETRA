import React from 'react';
import {
  PhoneCall,
  Shield,
  LifeBuoy,
  Scale,
  FileCheck2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface ResourcesProps {
  language: SupportedLanguage;
}

export const EmergencyResources: React.FC<ResourcesProps> = ({ language }) => {
  const verifiedHelplines = [
    {
      number: '112',
      title: 'National Emergency Response System (NERS)',
      desc: 'All-in-one 24x7 emergency dispatch across all States & UTs in India (Police, Fire, Ambulance, Disaster).',
      badge: 'Immediate Danger',
      color: 'border-rose-300 bg-rose-50/70 text-rose-900',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    {
      number: '181',
      title: 'Women Helpline (WHL) 24x7',
      desc: 'Toll-free 24-hour telephonic support for women facing violence, domestic abuse, intimidation, and trauma counseling.',
      badge: 'Crisis Counseling',
      color: 'border-violet-300 bg-violet-50/70 text-violet-900',
      btnColor: 'bg-[#6D28D9] hover:bg-[#5B21B6] text-white',
    },
    {
      number: '1091',
      title: 'Women in Distress (State Police Call Center)',
      desc: 'Direct police women safety desks in major Indian metropolitan cities and district superintendent headquarters.',
      badge: 'Police Dispatch',
      color: 'border-indigo-300 bg-indigo-50/70 text-indigo-900',
      btnColor: 'bg-indigo-700 hover:bg-indigo-800 text-white',
    },
    {
      number: '1930',
      title: 'National Cyber Crime Helpline',
      desc: 'Immediate reporting for digital harassment, morphing, non-consensual image sharing, blackmail, and online fraud.',
      badge: 'Cyber Safety',
      color: 'border-teal-300 bg-teal-50/70 text-teal-900',
      btnColor: 'bg-teal-700 hover:bg-teal-800 text-white',
    },
    {
      number: '1098',
      title: 'CHILDLINE India 24x7',
      desc: 'Emergency assistance, rescue, and rehabilitation for minors, girl child safety, and child abuse protection.',
      badge: 'Minors & Adolescents',
      color: 'border-amber-300 bg-amber-50/70 text-amber-900',
      btnColor: 'bg-amber-700 hover:bg-amber-800 text-white',
    },
    {
      number: '+91 7827170170',
      title: 'National Commission for Women (NCW) WhatsApp',
      desc: 'Direct 24x7 NCW emergency helpline for reporting domestic violence and harassment via messaging.',
      badge: 'WhatsApp Support',
      color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
      btnColor: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
  ];

  const safetyChecklist = [
    {
      title: 'Safe Communications & Device Hygiene',
      points: [
        'Use private incognito browsing or clear browser history on shared or monitored devices.',
        'Use neutral code words with trusted friends (e.g. "Order coffee" = call for immediate pickup).',
        'Check smartphone location sharing permissions for Google Maps, Find My, and WhatsApp live location.',
      ],
    },
    {
      title: 'Emergency Document Kit',
      points: [
        'Secure digital scans of Aadhaar, PAN, bank passbooks, marriage certificates, and medical records in a private cloud or encrypted drive.',
        'Keep an emergency physical bag with clothes, basic cash, essential medicines, and spare keys at a safe friend’s residence.',
      ],
    },
    {
      title: 'Workplace Evidence Preservation',
      points: [
        'Archive harassing emails, WhatsApp texts, Teams messages, and performance reviews with original timestamps.',
        'Take screenshots including sender phone numbers or handles and save to a non-work personal device.',
        'Document verbal interactions in a dated personal journal noting presence of colleagues or witnesses.',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="bg-[#FFFBF5] p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
          <LifeBuoy className="w-3.5 h-3.5 text-emerald-700" />
          <span>Verified Indian Resource Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">
          Verified Emergency Support & Helplines
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl">
          Direct access to official Indian government helplines, National Commission for Women (NCW) channels, and legal safety planning resources.
        </p>
      </div>

      {/* Verified Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {verifiedHelplines.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${item.color} shadow-xs flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-current">
                  {item.badge}
                </span>
                <span className="font-mono text-lg font-black">{item.number}</span>
              </div>
              <h3 className="font-bold text-sm text-[#1E1B4B] mb-1.5">{item.title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed mb-4">{item.desc}</p>
            </div>

            <a
              href={`tel:${item.number.replace(/\s+/g, '')}`}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${item.btnColor}`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dial {item.number}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Safety Planning Checklist & POSH Legal Reference */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7D7C1] shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#6D28D9]" />
          <span>Survivor Safety Planning & Evidence Guidelines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safetyChecklist.map((sec, idx) => (
            <div key={idx} className="bg-[#FEF7ED] p-5 rounded-2xl border border-[#E7D7C1] space-y-3">
              <h3 className="font-bold text-xs text-[#1E1B4B] uppercase tracking-wide">
                {sec.title}
              </h3>
              <ul className="space-y-2 text-xs text-gray-700 leading-relaxed">
                {sec.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="text-[#6D28D9] font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* POSH Act 2013 Quick Reference */}
      <div className="bg-[#1E1B4B] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Statutory Framework: POSH Act 2013</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Your Rights Under Indian Workplace Harassment Law
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed pt-2">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white text-sm">1. Mandatory Internal Committee (IC)</h4>
            <p>
              Every employer with 10 or more employees must constitute an IC. The Presiding Officer must be a senior woman employee, and at least 50% of the members must be women, including an external independent expert.
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white text-sm">2. 90-Day Inquiry Limit</h4>
            <p>
              The Internal Committee must complete its inquiry within 90 days of receiving the complaint and submit the report to the employer within 10 days of completion. Interim relief (transfer, paid leave up to 3 months) is statutory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
