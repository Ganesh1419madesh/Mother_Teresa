import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { buildUpiUri, generateUpiQrCode } from '../utils/upi';
import {
  ArrowLeft,
  Check,
  Copy,
  Smartphone,
  FileCheck2,
  Clock,
  AlertTriangle,
  QrCode,
  Heart
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';
import { TrustConfigModal } from '../components/TrustConfigModal';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    amount,
    transactionRef,
    trustConfig,
    paymentInitiated,
    setPaymentInitiated,
    utrNumber,
    setUtrNumber,
    saveCompletedDonation,
  } = useDonation();

  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [receiptModalOpen, setReceiptModalOpen] = useState<boolean>(false);
  const [utrError, setUtrError] = useState<string>('');
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const paymentConfigured =
    !trustConfig.isDemoPlaceholder &&
    trustConfig.upiId !== 'aashrayatrust@upi';

  // Require the minimum donation amount even for direct payment-page visits.
  useEffect(() => {
    if (!amount || amount < 10) {
      navigate('/');
    }
  }, [amount, navigate]);

  // Detect mobile user agent
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobileDevice(isMobile);
  }, []);

  // Build the UPI intent link
  const note = `Donation to ${trustConfig.name.slice(0, 30)} - Ref ${transactionRef}`;
  const upiIntentUri = buildUpiUri({
    pa: trustConfig.upiId,
    pn: trustConfig.payeeName,
    am: amount,
    cu: 'INR',
    tn: note,
    tr: transactionRef,
  });

  useEffect(() => {
    let cancelled = false;
    setQrCodeDataUrl('');

    generateUpiQrCode(upiIntentUri)
      .then((dataUrl) => {
        if (!cancelled) {
          setQrCodeDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrCodeDataUrl('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [upiIntentUri]);

  // Copy helpers
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(trustConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(amount));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Launch mobile UPI intent
  const handleOpenUpiApp = () => {
    setPaymentInitiated(true);
    // Direct browser navigation to upi:// protocol
    window.location.href = upiIntentUri;
  };

  // Handle donor submitting UTR reference for verification
  const handleVerifyUtr = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr) {
      setUtrError('Please enter your 12-digit UPI Reference / UTR Number.');
      return;
    }
    if (cleanUtr.length < 8) {
      setUtrError('UTR numbers are typically 12 alphanumeric characters.');
      return;
    }

    setUtrError('');
    saveCompletedDonation();
    setReceiptModalOpen(true);
  };

  return (
    <div className="payment-theme min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 bg-slate-950 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Amount</span>
          </Link>

          <span className="text-xs font-mono text-slate-500">
            Ref: <strong className="text-slate-300">{transactionRef}</strong>
          </span>
        </div>

        {/* Top Header Card */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
            {trustConfig.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Complete Your Donation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Scan using any UPI application or tap below if you are on a mobile device.
          </p>

          {/* Prominent Donation Amount Highlight */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl sm:rounded-full shadow-inner">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-medium">
              Donation Amount:
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">
              ₹{amount.toLocaleString('en-IN')}
            </span>
            <button
              onClick={handleCopyAmount}
              className="text-emerald-300 hover:text-white p-1 rounded transition-colors"
              title="Copy amount"
            >
              {copiedAmount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MAIN PAYMENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: QR Code & Mobile Launch */}
          <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center shadow-xl">
            {paymentConfigured ? (
              <>
                {/* Amount-specific UPI QR code */}
                <div className="relative p-4 bg-white rounded-2xl shadow-2xl border-4 border-emerald-400/30 max-w-[280px] sm:max-w-[300px] mx-auto group">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt={`UPI payment QR for ${trustConfig.payeeName}`}
                      className="w-60 h-60 object-contain mx-auto"
                    />
                  ) : (
                    <p role="status" className="w-60 h-60 flex items-center justify-center text-sm text-slate-600">
                      Generating payment QR...
                    </p>
                  )}
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Scan with any UPI Payment App
                  </p>
                  <p className="text-xs text-slate-400">
                    Google Pay · PhonePe · Paytm · BHIM · Amazon Pay · CRED
                  </p>
                </div>

                <div className="w-full mt-6 space-y-2">
                  <button
                    onClick={handleOpenUpiApp}
                    className="w-full py-3.5 px-5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/20"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay with UPI App (₹{amount.toLocaleString('en-IN')})</span>
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    {isMobileDevice
                      ? 'Opens your default UPI application automatically.'
                      : 'On mobile? Tap the button above to pay directly.'}
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full rounded-xl border border-amber-700/60 bg-amber-950/40 p-5 text-left">
                <h2 className="text-sm font-semibold text-amber-200">Payments are not configured</h2>
                <p className="mt-2 text-xs leading-relaxed text-amber-100/80">
                  Enter an active, bank-linked UPI ID and its registered payee name to create a usable payment QR.
                </p>
                <button
                  type="button"
                  onClick={() => setConfigModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300"
                >
                  <QrCode className="h-4 w-4" />
                  Configure payment details
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Clean Unified Payee Details & Voucher Generator */}
          <div className="md:col-span-5 space-y-5">
            {/* Payee Info & 1-Click Copy */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                Direct Payee Details
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Verified Payee:</span>
                  <span className="font-semibold text-white truncate max-w-[190px]">
                    {trustConfig.payeeName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">UPI ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-emerald-300 text-xs">
                      {trustConfig.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Copy recipient UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Donation Voucher Slip Claim */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white">
                  Get Official Donation Receipt
                </h2>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                After completing the payment in your UPI app, enter your 12-digit transaction UTR reference number to generate your official acknowledgment receipt voucher.
              </p>

              {/* Form to enter UTR / Reference */}
              <form onSubmit={handleVerifyUtr} className="space-y-3">
                <div>
                  <label
                    htmlFor="utr-input"
                    className="block text-[11px] font-medium text-slate-300 mb-1"
                  >
                    UPI Reference / UTR Number:
                  </label>
                  <input
                    id="utr-input"
                    type="text"
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                      setUtrError('');
                    }}
                    placeholder="e.g. 427819234812"
                    maxLength={16}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {utrError && (
                    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{utrError}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Generate Donation Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      saveCompletedDonation();
                      setReceiptModalOpen(true);
                    }}
                    className="w-full py-2 text-center text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Skip UTR &amp; View Acknowledgment Slip →
                  </button>
                </div>
              </form>

              {/* Status Note */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Ref: <strong className="text-slate-400 font-mono">{transactionRef}</strong></span>
                <span className="text-emerald-400/90 font-medium">100% Tax Deductible</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrustConfigModal isOpen={configModalOpen} onClose={() => setConfigModalOpen(false)} />

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />
    </div>
  );
};
