import React from 'react';
import { useDonation } from '../context/DonationContext';
import { Heart, X } from 'lucide-react';
import { DonationSession } from '../types/donation';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation?: DonationSession | null;
}

function numberToWordsINR(amount: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (amount === 0) return 'Zero Rupees';

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    const unit = n % 10;
    return `${tens[Math.floor(n / 10)]} ${unit ? units[unit] : ''}`.trim();
  }

  let result = '';
  const crore = Math.floor(amount / 10000000);
  const lakh = Math.floor((amount % 10000000) / 100000);
  const thousand = Math.floor((amount % 100000) / 1000);
  const hundred = Math.floor((amount % 1000) / 100);
  const rest = amount % 100;

  if (crore) result += `${convertTwoDigits(crore)} Crore `;
  if (lakh) result += `${convertTwoDigits(lakh)} Lakh `;
  if (thousand) result += `${convertTwoDigits(thousand)} Thousand `;
  if (hundred) result += `${units[hundred]} Hundred `;
  if (rest) result += `${convertTwoDigits(rest)} `;

  return `${result.trim()} Rupees Only`;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, donation }) => {
  const { trustConfig, lastDonationReceipt } = useDonation();
  const activeDonation = donation || lastDonationReceipt;

  if (!isOpen || !activeDonation) return null;

  const formattedDate = new Date(activeDonation.timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-title"
        className="relative w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 my-8 border border-slate-200"
      >
        {/* Top Actions (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
            <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>Donation Acknowledgment Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
              aria-label="Close receipt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="donation-receipt-content" className="mt-4 space-y-5 text-slate-800">
          {/* Trust Header */}
          <div className="text-center pb-4 border-b border-slate-200">
            <h1 id="receipt-title" className="text-2xl font-serif font-bold text-slate-950">
              {trustConfig.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{trustConfig.address}</p>
            <div className="mt-2 text-[11px] text-slate-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
              <span><strong>Email:</strong> {trustConfig.contactEmail}</span>
              <span><strong>Phone:</strong> {trustConfig.contactPhone}</span>
            </div>
          </div>

          {/* Receipt Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg text-xs border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Receipt Number</span>
              <span className="font-mono font-bold text-slate-900">{activeDonation.transactionRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Date of Issuance</span>
              <span className="font-medium text-slate-900">{formattedDate}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Payment Mode</span>
              <span className="font-medium text-slate-900">UPI Digital Transfer</span>
            </div>
          </div>

          {/* Donor & Amount Details */}
          <div className="space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
              <span className="text-slate-500">Received With Thanks From:</span>
              <span className="font-semibold text-slate-900 text-sm">
                {activeDonation.donor.name || 'Well-wisher & Donor'}
              </span>
            </div>

            {activeDonation.donor.email && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Donor Email:</span>
                <span className="font-medium text-slate-900">
                  {activeDonation.donor.email}
                </span>
              </div>
            )}

            {activeDonation.donor.message && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Dedication / Message:</span>
                <span className="italic text-slate-700">
                  "{activeDonation.donor.message}"
                </span>
              </div>
            )}

            {activeDonation.utrNumber && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">UPI Reference / UTR Number:</span>
                <span className="font-mono font-semibold text-emerald-800">
                  {activeDonation.utrNumber}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">The Sum of:</span>
              <span className="font-semibold text-slate-900 italic">
                {numberToWordsINR(activeDonation.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 bg-emerald-50 px-3 rounded-lg border border-emerald-200">
              <span className="font-medium text-emerald-950">Total Amount Contributed:</span>
              <span className="text-xl font-bold font-mono text-emerald-900">
                ₹{activeDonation.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Appreciation Note */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-[11px] text-emerald-950 leading-relaxed">
            <strong>Gratitude Note:</strong> We sincerely thank you for supporting {trustConfig.name}. Your generous contribution directly funds food relief, youth education supplies, and community welfare programs.
          </div>

          {/* Signature / Footer */}
          <div className="pt-4 flex items-end justify-between text-xs">
            <div className="space-y-1 text-slate-500 text-[11px]">
              <p>For questions or assistance:</p>
              <p className="font-medium text-slate-700">{trustConfig.contactEmail} · {trustConfig.contactPhone}</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate-400 pb-1 mb-1 text-center font-serif text-[11px] text-slate-500 italic">
                Authorized Signatory
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                For {trustConfig.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
