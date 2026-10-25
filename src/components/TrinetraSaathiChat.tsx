import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Shield,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Globe,
  Trash2,
  ArrowRight,
  PhoneCall,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { ChatMessage, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

interface SaathiChatProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isOpen: boolean;
  onClose: () => void;
  currentContext: string;
}

export const TrinetraSaathiChat: React.FC<SaathiChatProps> = ({
  language,
  setLanguage,
  isOpen,
  onClose,
  currentContext,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested Prompts
  const suggestedChips = [
    { label: 'I need help understanding my options', prompt: 'I need help understanding my safety and reporting options on TRINETRA.' },
    { label: 'How to report domestic abuse anonymously?', prompt: 'How can I report domestic abuse anonymously on TRINETRA SafeReach?' },
    { label: 'How to report workplace harassment under POSH?', prompt: 'How does workplace harassment reporting work under India\'s POSH Act?' },
    { label: 'What is a tamper-evident audit ledger?', prompt: 'Explain how TrustTrack uses SHA-256 cryptographic hashes to protect case integrity.' },
    { label: 'Show verified emergency numbers in India', prompt: 'What are the verified women safety emergency helplines in India?' },
  ];

  // Initialize Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'saathi',
          text: t.saathiGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language,
        },
      ]);
    }
  }, [language]);

  // Scroll to bottom on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Setup Browser Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = currentLangObj.bcp47;

      recognizer.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognizer.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    } else {
      setSpeechSupported(false);
    }
  }, [currentLangObj]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = currentLangObj.bcp47;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  // Browser Speech Synthesis (Read Aloud)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLangObj.bcp47;
    utterance.rate = 0.95;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find((v) => v.lang.includes(language));
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          context: `User active on screen: ${currentContext}`,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const saathiMsg: ChatMessage = {
          id: `msg-saathi-${Date.now()}`,
          sender: 'saathi',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language,
          isEmergencyAlert: data.isImmediateCrisis,
        };
        setMessages((prev) => [...prev, saathiMsg]);
      } else {
        throw new Error(data.message || 'Error from Saathi service');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      // Friendly fallback
      const fallbackMsg: ChatMessage = {
        id: `msg-fallback-${Date.now()}`,
        sender: 'saathi',
        text: 'I am here to support you. You can report concerns confidentially through SafeReach (Domestic Safety) or SpeakUp (Workplace POSH). If you are in immediate danger in India, please dial 112 or Women Helpline 181 immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? 'bottom-4 right-4 w-72'
          : 'bottom-4 right-4 w-[92vw] sm:w-[440px] max-w-[480px] h-[640px] max-h-[88vh]'
      } bg-white rounded-3xl shadow-2xl border-2 border-[#E7D7C1] flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E1B4B] to-[#2E1065] text-[#FEF7ED] p-3.5 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-purple-200/40 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/trinetra-logo.png"
              alt="Saathi Avatar"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white font-serif-brand">
                TRINETRA SAATHI
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span className="text-[10px] text-purple-200 block -mt-0.5">
              Your Language • Your Voice • Your Safety
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Audio Stop Control */}
          {isPlayingAudio && (
            <button
              onClick={stopAudio}
              className="p-1 rounded-lg bg-rose-600 text-white text-[10px] px-2 flex items-center gap-1 animate-pulse"
              title="Stop reading aloud"
            >
              <VolumeX className="w-3 h-3" />
              <span>Stop</span>
            </button>
          )}

          {/* Minimize / Maximize */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Subheader Language & Context Banner */}
          <div className="bg-[#FEF7ED] px-4 py-2 border-b border-[#E7D7C1] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-600">
              <span className="text-[10px] text-gray-400">Context:</span>
              <span className="font-semibold text-[#1E1B4B] capitalize">{currentContext}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#6D28D9]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="text-[11px] font-bold bg-white border border-[#E2D2BC] rounded-md px-1.5 py-0.5 text-[#1E1B4B]"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversation Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FFFDF9]">
            {messages.map((msg) => {
              const isSaathi = msg.sender === 'saathi';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSaathi ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isSaathi
                        ? msg.isEmergencyAlert
                          ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-xs'
                          : 'bg-[#FEF7ED] border border-[#E7D7C1] text-[#1E1B4B] shadow-xs'
                        : 'bg-[#1E1B4B] text-white'
                    }`}
                  >
                    {isSaathi && msg.isEmergencyAlert && (
                      <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs mb-1.5 pb-1 border-b border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>EMERGENCY PROTOCOL DETECTED</span>
                      </div>
                    )}

                    <div className="space-y-1.5 leading-relaxed">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (!line.trim()) return <div key={lIdx} className="h-1" />;
                        const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
                        const contentToRender = isBullet ? line.trim().slice(2) : line;
                        const segments = contentToRender.split(/(\*\*.*?\*\*)/g);

                        return (
                          <div key={lIdx} className={isBullet ? 'flex items-start gap-1.5 ml-1' : ''}>
                            {isBullet && <span className="text-[#6D28D9] font-bold shrink-0 mt-0.5">•</span>}
                            <span>
                              {segments.map((seg, sIdx) => {
                                if (seg.startsWith('**') && seg.endsWith('**')) {
                                  return (
                                    <strong key={sIdx} className="font-bold text-[#1E1B4B]">
                                      {seg.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return seg;
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Emergency Callouts within Saathi's Message if emergency */}
                    {isSaathi && msg.isEmergencyAlert && (
                      <div className="flex gap-2 mt-3 pt-2 border-t border-rose-200">
                        <a
                          href="tel:112"
                          className="flex items-center gap-1 bg-rose-600 text-white px-2.5 py-1 rounded text-xs font-bold hover:bg-rose-700"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Call 112</span>
                        </a>
                        <a
                          href="tel:181"
                          className="flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded text-xs font-bold hover:bg-slate-800"
                        >
                          <PhoneCall className="w-3 h-3 text-amber-300" />
                          <span>Call 181 (Women)</span>
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-black/5 text-[10px] text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>{msg.timestamp}</span>
                        {isSaathi && (
                          <span className="text-[9px] font-semibold text-[#6D28D9] bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                            AI Powered
                          </span>
                        )}
                      </div>
                      {isSaathi && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:text-[#6D28D9] flex items-center gap-1 font-semibold cursor-pointer"
                          title="Read aloud in selected Indian language"
                        >
                          <Volume2 className="w-3 h-3 text-[#6D28D9]" />
                          <span>Read Aloud</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#FEF7ED] p-3 rounded-2xl border border-[#E7D7C1] max-w-[70%]">
                <RefreshCw className="w-3.5 h-3.5 text-[#6D28D9] animate-spin" />
                <span>TRINETRA Saathi is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          <div className="px-3 py-2 bg-[#FEF7ED] border-t border-[#E7D7C1] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                className="inline-block text-[11px] font-medium bg-white hover:bg-purple-50 text-[#1E1B4B] hover:text-[#6D28D9] px-2.5 py-1 rounded-full border border-[#E2D2BC] transition-colors shrink-0 cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Voice Recording Active Waveform */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-900 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span className="font-bold">Listening in {currentLangObj.name}... Speak now</span>
              </div>
              <button
                onClick={toggleVoiceInput}
                className="text-[11px] font-bold text-rose-700 underline cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#E7D7C1] flex items-center gap-2">
            {/* Microphone Button */}
            <button
              onClick={toggleVoiceInput}
              disabled={!speechSupported}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-[#FEF7ED] border-[#E2D2BC] text-[#1E1B4B] hover:bg-white'
              }`}
              title={speechSupported ? 'Speak in your language' : 'Speech recognition not supported in this browser'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#6D28D9]" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask in ${currentLangObj.nativeName}...`}
              className="flex-1 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl border border-gray-300 focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9] outline-hidden bg-[#FEF7ED]/50"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || loading}
              className="p-2.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-40 text-white shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
