import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { Heart, ShieldCheck, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenReceiptModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReceiptModal }) => {
  const { trustConfig, lastDonationReceipt } = useDonation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<string>('home');

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll spy to highlight current section in navigation
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['home', 'causes', 'impact', 'faq'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      // Bottom of page check (ensures FAQ is highlighted when scrolled to bottom)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('faq');
        return;
      }

      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  interface NavItem {
    label: string;
    to: string;
    hash?: string;
    isRoute: boolean;
  }

  const navLinks: NavItem[] = [
    { label: 'Home', to: '/', hash: 'home', isRoute: true },
    { label: 'Our Causes', to: '/#causes', hash: 'causes', isRoute: false },
    { label: 'Community Impact', to: '/#impact', hash: 'impact', isRoute: false },
    { label: 'FAQs', to: '/#faq', hash: 'faq', isRoute: false },
    { label: 'About Us', to: '/about', isRoute: true },
  ];

  const isLinkActive = (link: NavItem) => {
    if (location.pathname === '/about' && link.to === '/about') {
      return true;
    }
    if (location.pathname === '/' || location.pathname === '') {
      if (link.hash && link.hash === activeSection) {
        return true;
      }
      if (link.to === '/' && activeSection === 'home') {
        return true;
      }
    }
    return false;
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavItem
  ) => {
    if (link.hash) {
      if (location.pathname === '/') {
        e.preventDefault();
        const target = document.getElementById(link.hash);
        if (target) {
          const headerOffset = 70;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          setActiveSection(link.hash);
        }
      }
    } else if (link.to === '/') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Main header row */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand / Trust Name — 2-line stacked logo so the full title is always visible on every screen */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0 py-1"
              title={trustConfig.name}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-slate-950 text-slate-950" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm md:text-[15px] font-serif font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors leading-tight">
                  Mother Teresa's
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-emerald-400/90 tracking-tight leading-tight">
                  Leprosy Rehabilitation Centre &amp; Shishu Bhawan
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-medium text-slate-300 shrink-0">
              {navLinks.map((link) => {
                const active = isLinkActive(link);
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`hover:text-emerald-400 transition-colors whitespace-nowrap ${
                      active ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {lastDonationReceipt && (
                <button
                  onClick={onOpenReceiptModal}
                  className="text-slate-300 hover:text-emerald-400 transition-colors whitespace-nowrap"
                >
                  Donation Receipt
                </button>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Desktop-only admin link */}
              <Link
                to="/admin/login"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-colors whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>

              {/* Donate button */}
              {location.pathname !== '/payment' ? (
                <Link
                  to="/payment"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm hover:shadow-emerald-950/40 whitespace-nowrap"
                >
                  <Heart className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Donate</span>
                </Link>
              ) : (
                <Link
                  to="/"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Back to Home
                </Link>
              )}

              {/* Hamburger — visible below lg */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            style={{ animation: 'headerFadeIn 0.2s ease-out' }}
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="absolute right-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col"
            style={{ animation: 'headerSlideIn 0.25s ease-out' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 h-14 sm:h-16 border-b border-slate-800">
              <span className="text-sm font-serif font-bold text-white">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const active = isLinkActive(link);
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={(e) => handleNavClick(e, link)}
                      className={`block px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'text-emerald-400 bg-emerald-950/40 font-semibold'
                          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {lastDonationReceipt && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenReceiptModal?.();
                    }}
                    className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    Donation Receipt
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-slate-800" />

              {/* Admin link */}
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Admin Login
              </Link>
            </nav>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-slate-800">
              <Link
                to={location.pathname === '/payment' ? '/' : '/payment'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/15"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                {location.pathname === '/payment' ? 'Back to Home' : 'Donate Now'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframe styles for drawer animation */}
      <style>{`
        @keyframes headerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes headerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
