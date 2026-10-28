import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { usePortfolioStore } from '../../lib/store';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PasscodeModal({ isOpen, onClose, onSuccess }: PasscodeModalProps) {
  const { state } = usePortfolioStore();
  const primaryColor = state.settings.customColors.primary;

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Accepted passcodes: '2101' (email), 'santhosh', 'admin', '1234'
    const validCodes = ['2101', 'santhosh', 'admin', '1234'];
    if (validCodes.includes(pin.trim().toLowerCase())) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#121216] border border-[#27272A] p-6 sm:p-8 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#18181F] text-[#9E9EA7] hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-display font-extrabold text-2xl text-white">
          Admin Studio Access
        </h3>
        <p className="text-xs text-[#A1A1AA] mt-1 mb-6">
          Enter master PIN to customize colors, theme, projects, and 20 client logos.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="Enter PIN (Default: 2101)"
              className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-[#27272A] text-white text-center tracking-widest text-lg focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Incorrect PIN. Try: 2101 or santhosh</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Admin Studio</span>
          </button>

          <p className="text-[11px] font-mono text-[#71717A]">
            Quick tip: Default passcode is <strong className="text-white">2101</strong>
          </p>
        </form>
      </div>
    </div>
  );
}

