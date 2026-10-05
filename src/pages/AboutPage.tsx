import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { GALLERY_ITEMS, TRUST_CERTIFICATES, GalleryItem, TrustCertificate } from '../data/trustData';
import {
  Heart,
  ArrowLeft,
  ShieldCheck,
  Award,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { trustConfig } = useDonation();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewCertModal, setViewCertModal] = useState<TrustCertificate | null>(null);

  // Scroll to hash target on mount if hash provided (e.g., #certificates or #gallery)
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  const categories = ['All', 'Rehabilitation', 'Child Care', 'Community Service', 'Medical Camps'];

  const filteredImages = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Banner Navigation */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-14 sm:top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <a href="#about-info" className="text-slate-400 hover:text-white transition-colors hidden sm:inline">
              About
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a href="#gallery" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium">
              Gallery ({GALLERY_ITEMS.length})
            </a>
            <span className="text-slate-700">•</span>
            <a href="#certificates" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium">
              Certificates &amp; Approvals
            </a>
          </div>
        </div>
      </div>

      {/* Hero / Header Section */}
      <section id="about-info" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-emerald-950/20 via-slate-950/80 to-slate-950 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dedicated Non-Profit Humanitarian Trust</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                {trustConfig.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                Founded on principles of selfless service, compassionate rehabilitation, and unwavering dedication, our organization provides continuous medical care, shelter, psychological support, and vocational empowerment to individuals recovering from leprosy, alongside comprehensive care, nutrition, and schooling for underprivileged children.
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="w-full md:w-80 shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Non-Profit</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{trustConfig.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`tel:${trustConfig.contactPhone}`} className="hover:text-emerald-300 transition-colors">
                    {trustConfig.contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${trustConfig.contactEmail}`} className="hover:text-emerald-300 transition-colors break-all">
                    {trustConfig.contactEmail}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>UPI ID: <strong className="text-emerald-300 font-mono">{trustConfig.upiId}</strong></span>
                <span className="text-emerald-400 font-medium">100% Tax Exempt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Gallery Header & Filter Pills */}
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                <ImageIcon className="w-4 h-4" />
                <span>Activities &amp; Community Gallery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1.5">
                Our Work in Pictures
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Glimpses of daily patient rehabilitation, children's joyful moments, community meals, and grassroots service initiatives.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                    selectedCategory === cat
                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3] cursor-pointer shadow-md hover:border-emerald-500/60 hover:shadow-emerald-500/10 transition-all duration-300"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    {img.category}
                  </span>
                  <p className="text-xs text-white font-medium line-clamp-1">
                    {img.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No photos found in this category.
            </div>
          )}
        </div>
      </section>

      {/* CERTIFICATES & APPROVALS SECTION */}
      <section id="certificates" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Statutory Compliance &amp; Approvals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1.5">
              Official Trust Accreditations &amp; Registrations
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Our trust operates under strict regulatory compliance with full registration under the Indian Trusts Act, Income Tax Department (12A &amp; 80G), NITI Aayog NGO Darpan, and CSR-1.
            </p>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRUST_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-[11px] font-bold text-emerald-400">
                      {cert.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {cert.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  {/* Details Box */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Reg / Cert No:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-300 text-xs">
                          {cert.registrationNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(cert.registrationNumber, cert.id)}
                          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                          title="Copy Certificate Number"
                        >
                          {copiedId === cert.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Authority:</span>
                      <span className="text-slate-300 font-medium text-right truncate max-w-[170px]" title={cert.authority}>
                        {cert.authority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Issue / Status:</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {cert.validity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setViewCertModal(cert)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Certificate Info</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] text-slate-500">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM DONATE CALLOUT */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-slate-900 to-slate-900/60 border border-emerald-800/40 rounded-2xl p-8 shadow-2xl">
          <Heart className="w-8 h-8 text-emerald-400 mx-auto fill-emerald-400/20" />
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-3">
            Support the Mother Teresa Leprosy Rehabilitation Centre
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
            Your generous gift directly provides nutritious meals, medical rehabilitation, and quality schooling for our community members.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/payment"
              className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Donate Online via UPI</span>
            </Link>
            <Link
              to="/"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox / Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/80">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  {selectedImage.category}
                </span>
                <h4 className="text-sm font-bold text-white">{selectedImage.title}</h4>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-2 sm:p-4 flex items-center justify-center bg-slate-950">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Certificate Detail Modal */}
      {viewCertModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={() => setViewCertModal(null)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">{viewCertModal.name}</span>
              </div>
              <button
                onClick={() => setViewCertModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="text-slate-400 leading-relaxed">{viewCertModal.description}</p>
              
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration Number:</span>
                  <span className="font-mono font-bold text-emerald-400">{viewCertModal.registrationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="text-slate-200 text-right">{viewCertModal.authority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issued Date:</span>
                  <span className="text-slate-200">{viewCertModal.issuedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Validity:</span>
                  <span className="text-emerald-400 font-semibold">{viewCertModal.validity}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewCertModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Non-Redundant Footer for About Page */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <span className="text-slate-300 font-medium">{trustConfig.name}</span>
          </div>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span>•</span>
            <Link to="/payment" className="hover:text-emerald-400 transition-colors">Donate</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-emerald-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
