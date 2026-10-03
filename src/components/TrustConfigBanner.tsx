import React, { useState } from 'react';
import { useDonation } from '../context/DonationContext';
import { AlertCircle, Sliders, Check, Copy } from 'lucide-react';
import { TrustConfigModal } from './TrustConfigModal';

export const TrustConfigBanner: React.FC = () => {
  const { trustConfig } = useDonation();
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyUpiId = () => {
    navigator.clipboard.writeText(trustConfig.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (dismissed) {
    return (
      <div className="bg-slate-950/90 border-b border-slate-800 text-[11px] text-slate-400 py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            Payment recipient: <strong className="text-emerald-400">{trustConfig.payeeName}</strong>
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-emerald-400 hover:text-emerald-300 underline font-medium"
        >
          Change UPI ID / Details
        </button>
        <TrustConfigModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    );
  }

  return (
    <>
      <aside 
        aria-label="Configuration notice"
        className="bg-amber-950/60 border-b border-amber-800/60 text-amber-200 text-xs py-2 px-4 relative z-40 transition-colors"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2 leading-tight">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong className="text-amber-300 font-semibold">
                {trustConfig.isDemoPlaceholder ? 'Important Notice:' : 'Payment recipient:'}
              </strong>{' '}
              {trustConfig.isDemoPlaceholder
                ? 'UPI payments are not configured.'
                : `${trustConfig.payeeName}. Confirm the recipient in your payment app.`}
              {trustConfig.isDemoPlaceholder && (
                <span className="hidden md:inline text-amber-300/80 ml-1.5">
                  (Replace with your registered Trust UPI ID in <code className="text-xs">src/config/trustConfig.ts</code>)
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={copyUpiId}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-900 border border-amber-700/60 text-[11px] font-medium text-amber-200 transition-colors"
              title="Copy current UPI ID"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy UPI'}</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-semibold transition-colors shadow-sm"
            >
              <Sliders className="w-3 h-3" />
              <span>Configure UPI ID</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-400 hover:text-white text-xs px-1.5 py-0.5"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      </aside>

      <TrustConfigModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
