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
  Sparkles,
  FileText,
  Download,
  ExternalLink,
  Eye
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
              Our trust operates under strict regulatory compliance with official statutory registrations under the Indian Trusts Act, Income Tax Department (12A &amp; 80G Tax Exemption), FCRA, and PAN.
            </p>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRUST_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
              >
                {/* Certificate Thumbnail Preview */}
                <div
                  onClick={() => setViewCertModal(cert)}
                  className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer border-b border-slate-800/80 group-hover:opacity-95"
                >
                  <img
                    src={cert.previewImage}
                    alt={cert.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end justify-between p-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-800/80 text-[11px] font-bold text-emerald-300">
                      {cert.badge}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700">
                      {cert.totalPages} {cert.totalPages === 1 ? 'Page' : 'Pages'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        {cert.code}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {cert.validity}
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Issuing Authority:</span>
                      <span className="text-slate-300 font-medium text-right truncate max-w-[170px]" title={cert.authority}>
                        {cert.authority}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => setViewCertModal(cert)}
                        className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open PDF</span>
                      </a>
                    </div>
                  </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
          onClick={() => setViewCertModal(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">{viewCertModal.name}</h4>
                  <p className="text-[11px] text-emerald-400 font-medium">{viewCertModal.badge}</p>
                </div>
              </div>
              <button
                onClick={() => setViewCertModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <p className="text-xs text-slate-300 leading-relaxed">
                {viewCertModal.description}
              </p>

              {/* Certificate Image Preview */}
              <div className="bg-slate-950 rounded-xl p-2 sm:p-4 border border-slate-800 flex items-center justify-center overflow-hidden">
                <img
                  src={viewCertModal.previewImage}
                  alt={viewCertModal.name}
                  className="max-h-[55vh] w-auto max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
                />
              </div>

              {/* Metadata details */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Code:</span>
                  <span className="font-mono font-bold text-emerald-400">{viewCertModal.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="text-slate-200 text-right">{viewCertModal.authority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Validity / Status:</span>
                  <span className="text-emerald-400 font-semibold">{viewCertModal.validity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Document Pages:</span>
                  <span className="text-slate-200">{viewCertModal.totalPages} {viewCertModal.totalPages === 1 ? 'Page' : 'Pages'}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setViewCertModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={viewCertModal.pdfUrl}
                  download
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PDF</span>
                </a>

                <a
                  href={viewCertModal.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full PDF in New Tab</span>
                </a>
              </div>
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
