import React, { useEffect } from 'react';
import { LogOut, AlertTriangle, ShieldCheck, ExternalLink, X } from 'lucide-react';

interface QuickExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickExitModal: React.FC<QuickExitModalProps> = ({ isOpen, onClose }) => {
  const handleImmediateEscape = () => {
    // Replace window location to neutral page
    window.location.replace('https://www.google.com/search?q=weather+today');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Escape key twice in quick succession or alt+x
      if (e.key === 'Escape' && isOpen) {
        handleImmediateEscape();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-rose-300 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E1B4B]">
                Immediate Safe Exit
              </h3>
              <span className="text-[11px] text-gray-500">
                Leaves this site immediately
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Action Button */}
        <button
          onClick={handleImmediateEscape}
          className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit to Google Weather Right Now</span>
        </button>

        {/* Safety & Monitoring Notice */}
        <div className="p-4 bg-[#FEF7ED] rounded-xl border border-[#E7D7C1] space-y-2 text-xs text-gray-700 leading-relaxed">
          <div className="font-bold text-[#1E1B4B] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Monitored Device Notice</span>
          </div>
          <p>
            Quick Exit immediately navigates away from TRINETRA to prevent someone looking over your shoulder.
          </p>
          <p className="text-[11px] text-gray-600">
            <strong>Warning:</strong> Quick Exit <em>cannot erase your browser history</em>. If someone checks your device history or router logs later, remember to clear your browsing history or use Private/Incognito mode.
          </p>
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-gray-400">Press Esc to exit immediately</span>
          <button
            onClick={onClose}
            className="font-bold text-gray-600 hover:text-gray-900"
          >
            Stay on TRINETRA
          </button>
        </div>
      </div>
    </div>
  );
};
