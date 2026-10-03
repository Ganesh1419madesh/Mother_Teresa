import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { Heart, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenReceiptModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReceiptModal }) => {
  const { trustConfig, lastDonationReceipt } = useDonation();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/75 border-b border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Trust Name Wordmark */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-serif font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap truncate max-w-[240px] sm:max-w-none"
        >
          {trustConfig.name}
        </Link>

        {/* Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs lg:text-sm font-medium text-slate-300">
          <Link
            to="/"
            className={`hover:text-emerald-400 transition-colors ${
              location.pathname === '/' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Home
          </Link>
          <a
            href="#causes"
            className="hover:text-emerald-400 transition-colors"
          >
            Our Causes
          </a>
          <a
            href="#impact"
            className="hover:text-emerald-400 transition-colors"
          >
            Community Impact
          </a>
          <a
            href="#faq"
            className="hover:text-emerald-400 transition-colors"
          >
            FAQs
          </a>
          {lastDonationReceipt && (
            <button
              onClick={onOpenReceiptModal}
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Donation Receipt
            </button>
          )}
        </nav>

        {/* Primary Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </Link>
          {location.pathname !== '/payment' ? (
            <Link
              to="/payment"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm hover:shadow-emerald-950/40 whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Donate Now</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
