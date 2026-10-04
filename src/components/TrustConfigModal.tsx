import React, { useState } from 'react';
import { useDonation } from '../context/DonationContext';
import { TRUST_CONFIG } from '../config/trustConfig';
import { Check, Copy, HelpCircle, RefreshCw, X } from 'lucide-react';

interface TrustConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrustConfigModal: React.FC<TrustConfigModalProps> = ({ isOpen, onClose }) => {
  const { trustConfig, updateTrustConfig, resetTrustConfig } = useDonation();

  const [name, setName] = useState(trustConfig.name);
  const [upiId, setUpiId] = useState(trustConfig.upiId);
  const [payeeName, setPayeeName] = useState(trustConfig.payeeName);
  const [contactEmail, setContactEmail] = useState(trustConfig.contactEmail);
  const [contactPhone, setContactPhone] = useState(trustConfig.contactPhone);
  const [address, setAddress] = useState(trustConfig.address);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrustConfig({
      name: name.trim(),
      upiId: upiId.trim(),
      payeeName: payeeName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      address: address.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    resetTrustConfig();
    setName(TRUST_CONFIG.name);
    setUpiId(TRUST_CONFIG.upiId);
    setPayeeName(TRUST_CONFIG.payeeName);
    setContactEmail(TRUST_CONFIG.contactEmail);
    setContactPhone(TRUST_CONFIG.contactPhone);
    setAddress(TRUST_CONFIG.address);
  };

  const copyConfigSnippet = () => {
    const snippet = `// In src/config/trustConfig.ts
export const TRUST_CONFIG = {
  name: "${name}",
  upiId: "${upiId}", // Your real Trust UPI ID
  payeeName: "${payeeName}",
  contactEmail: "${contactEmail}",
  contactPhone: "${contactPhone}",
  address: "${address}",
};`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="trust-config-title"
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 id="trust-config-title" className="text-xl font-semibold text-white">
              Trust & UPI Configuration
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter the active UPI account that should receive donations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Payment setup:</strong> Use a bank-linked UPI ID and the exact payee name registered to that account. This app cannot verify the bank registration or account name; scan the QR and confirm the recipient in your UPI app before accepting payments. You can save these details here or permanently update them in{' '}
            <code className="bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-amber-300">src/config/trustConfig.ts</code>.
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Trust UPI ID (VPA) <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourtrust@okhdfcbank or trust@sbi"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              The QR and payment link use this VPA. It must be active and able to receive UPI payments.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Trust / Payee Legal Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="e.g. Mother Teresa's Leprosy Rehabilitation Centre"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Display Name on Website
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mother Teresa's Leprosy Rehabilitation Centre & Shishu Bhawan"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="care@trust.org"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Office Location / Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address / City"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={copyConfigSnippet}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied code!' : 'Copy Code'}
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors font-semibold"
              >
                {savedSuccess ? 'Saved!' : 'Apply Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
