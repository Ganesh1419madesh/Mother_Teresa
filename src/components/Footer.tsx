import React from 'react';
import { Link } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { GALLERY_ITEMS, TRUST_CERTIFICATES } from '../data/trustData';
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  Plus,
  ShieldCheck,
  ExternalLink,
  Award,
  ChevronRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { trustConfig } = useDonation();

  // Preview 5 small images in footer gallery + 1 "+" tile
  const previewImages = GALLERY_ITEMS.slice(0, 5);
  const remainingCount = Math.max(0, GALLERY_ITEMS.length - 5);

  return (
    <footer className="mt-auto py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* SECTION 1 (LEFT): Trust Info, Address, Phone, Email */}
          <div className="md:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
                <Heart className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-white leading-tight">
                  {trustConfig.name}
                </h4>
                <p className="text-[11px] text-emerald-400 font-medium">
                  Registered Non-Profit Charity &amp; Care Home
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated to compassionate rehabilitation of leprosy patients and nurturing home care and education for destitute children.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-tight">{trustConfig.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${trustConfig.contactPhone}`} className="text-slate-300 hover:text-emerald-400 transition-colors">
                  {trustConfig.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${trustConfig.contactEmail}`} className="text-slate-300 hover:text-emerald-400 transition-colors break-all">
                  {trustConfig.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* SECTION 2 (MIDDLE): Gallery Preview with Small Thumbnails and "+" icon */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Activities &amp; Gallery
              </h5>
              <Link
                to="/about#gallery"
                className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <span>View Full Gallery</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Moments from patient care, medical camps, and children's activities at our rehabilitation centre.
            </p>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {previewImages.map((img) => (
                <Link
                  key={img.id}
                  to="/about#gallery"
                  className="group relative aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/80 transition-all"
                  title={img.title}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                </Link>
              ))}

              {/* The "+" tile linking to About Page */}
              <Link
                to="/about#gallery"
                className="aspect-square rounded-lg bg-slate-900 border border-dashed border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/30 flex flex-col items-center justify-center text-center p-1 group transition-all"
                title="View more photos"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 flex items-center justify-center transition-colors mb-0.5">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 group-hover:text-emerald-300">
                  +{remainingCount} More
                </span>
              </Link>
            </div>
          </div>

          {/* SECTION 3 (RIGHT): Trust Approvals & Certificates */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Approvals &amp; Certificates
              </h5>
              <Link
                to="/about#certificates"
                className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Official government accreditations, tax exemptions, and statutory registrations.
            </p>

            <div className="space-y-2 pt-1">
              {TRUST_CERTIFICATES.slice(0, 4).map((cert) => (
                <Link
                  key={cert.id}
                  to="/about#certificates"
                  className="block p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/60 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {cert.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                      {cert.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-400 text-[10px]">
                      ID: {cert.registrationNumber}
                    </span>
                    <span className="text-emerald-400/90 text-[10px] font-medium">
                      {cert.validity}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Portal Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {trustConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">About the Trust</Link>
            <span>•</span>
            <Link to="/about#certificates" className="hover:text-white transition-colors">Statutory Approvals</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
