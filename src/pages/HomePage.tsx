import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '../context/DonationContext';
import { DONATION_PRESETS } from '../config/trustConfig';
import { 
  ArrowRight, 
  CheckCircle, 
  Heart, 
  Users, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import heroImage from '../assets/images/hero_charity_community_1790573703674.jpg';
import handsImage from '../assets/images/trust_community_hands_1790573720859.jpg';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { amount, setAmount, donorInfo, setDonorInfo, trustConfig, generateNewRef } = useDonation();

  const [inputVal, setInputVal] = useState<string>(amount > 0 ? String(amount) : '10');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(
    !DONATION_PRESETS.some((p) => p.amount === amount)
  );
  const [showDonorNote, setShowDonorNote] = useState<boolean>(false);

  const handlePresetSelect = (presetAmount: number) => {
    setInputVal(String(presetAmount));
    setAmount(presetAmount);
    setIsCustom(false);
    setErrorMsg('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setInputVal(raw);
    setIsCustom(true);
    const num = Number(raw);
    if (!raw || num < 10) {
      setErrorMsg('Minimum donation amount is ₹10');
    } else {
      setErrorMsg('');
      setAmount(num);
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = Number(inputVal);
    if (!finalAmount || finalAmount < 10) {
      setErrorMsg('Minimum donation amount is ₹10');
      return;
    }

    setAmount(finalAmount);
    generateNewRef();
    navigate('/payment');
  };

  // Find corresponding impact description
  const activePreset = DONATION_PRESETS.find((p) => p.amount === Number(inputVal));
  const currentImpactDescription = activePreset
    ? activePreset.impact
    : Number(inputVal) >= 10000
    ? 'Provides extensive community medical camps and long-term education support.'
    : Number(inputVal) >= 1000
    ? 'Supports critical nutrition, winter care essentials, and children learning materials.'
    : 'Every rupee directly translates to warm meals and essential sustenance for someone in need.';

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col">
      {/* 
        HERO SECTION:
        - Full-screen high-quality background image
        - Dark transparent overlay
        - Display the Trust name prominently
        - Short meaningful message: "Your small contribution can make a meaningful difference."
        - Supporting text: "Give what you can. Every contribution helps us support people and build a better community."
      */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Background Image Container with Zero-Broken-Image fallback */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Community volunteers serving and supporting families in need"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000 hover:scale-100"
          />
          {/* Multi-layered dark transparent overlay for readability and contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/95" />
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/50 to-slate-950/90" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto w-full pt-4 pb-8 flex flex-col items-center text-center">
          {/* Prominent Trust Name */}
          <div className="mb-4">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-emerald-400 font-mono">
              Leprosy Rehabilitation & Child Care
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-1.5 tracking-tight drop-shadow-sm max-w-4xl mx-auto leading-tight">
              {trustConfig.name}
            </h1>
            <p lang="ta" className="text-base sm:text-lg md:text-xl font-medium text-emerald-100/90 max-w-4xl mx-auto mt-3 leading-relaxed">
              அன்னை தெரசா குழந்தைகள் மற்றும் தொழு நோயாளிகளுக்கான காப்பகம் மற்றும் மறுவாழ்வு மையங்கள்
            </p>
          </div>

          {/* Meaningful Messages required by prompt */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-amber-200/95 max-w-2xl mx-auto font-serif tracking-normal leading-snug drop-shadow-md">
            "Care with dignity. Hope for every child."
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {trustConfig.tagline}
          </p>

          {/* DONATION CARD CONTAINER */}
          <div className="mt-8 w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all hover:border-slate-600">
            <form onSubmit={handleDonateSubmit} className="space-y-5">
              {/* Presets Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider text-left mb-2.5">
                  Select Donation Amount (₹ INR)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {DONATION_PRESETS.map((preset) => {
                    const isSelected = !isCustom && Number(inputVal) === preset.amount;
                    return (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => handlePresetSelect(preset.amount)}
                        className={`py-2 px-1 text-sm font-semibold rounded-lg transition-all border ${
                          isSelected
                            ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md font-bold'
                            : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700/80 hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Input */}
              <div className="text-left">
                <label
                  htmlFor="donation-amount-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Or enter any custom amount (minimum ₹10):
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-xl font-bold text-emerald-400 font-mono">₹</span>
                  </div>
                  <input
                    id="donation-amount-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputVal}
                    onChange={handleInputChange}
                    placeholder="Enter amount (e.g. 500)"
                    aria-label="Donation amount in Indian Rupees"
                    className="block w-full rounded-xl bg-slate-950 border border-slate-700 pl-10 pr-4 py-3.5 text-xl font-bold font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                {errorMsg && (
                  <p className="mt-2 text-xs font-medium text-red-400 flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </div>

              {/* Impact Callout */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-left flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <strong className="text-emerald-300">Direct Impact:</strong> {currentImpactDescription}
                </div>
              </div>

              {/* Optional Donor Information (Name & Message) */}
              <div className="text-left pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDonorNote(!showDonorNote)}
                  className="text-xs text-slate-400 hover:text-emerald-400 font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {showDonorNote ? '− Hide optional donor info' : '+ Add your name / dedication message (Optional)'}
                  </span>
                </button>

                {showDonorNote && (
                  <div className="mt-3 space-y-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={donorInfo.name || ''}
                          onChange={(e) => setDonorInfo({ name: e.target.value })}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">
                          Email (for donation acknowledgment)
                        </label>
                        <input
                          type="email"
                          value={donorInfo.email || ''}
                          onChange={(e) => setDonorInfo({ email: e.target.value })}
                          placeholder="donor@example.com"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        Dedication / Note of Support
                      </label>
                      <input
                        type="text"
                        value={donorInfo.message || ''}
                        onChange={(e) => setDonorInfo({ message: e.target.value })}
                        placeholder="In honor of... / Best wishes to the team"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Prominent Donate Now Button */}
              <button
                type="submit"
                disabled={Boolean(errorMsg) || !inputVal || Number(inputVal) <= 0}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/20 group"
              >
                <span>Donate ₹{Number(inputVal) > 0 ? Number(inputVal).toLocaleString('en-IN') : '0'} Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Instant UPI QR
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                  100% Direct Support
                </span>
                <span>·</span>
                <span>Zero Hidden Fees</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS OF CAUSE */}
      <section id="causes" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Where Your Donation Goes
            </h2>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
              Transforming Lives in Our Communities
            </h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Every single rupee contributed goes directly towards ground-level operations and compassionate community service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">
                Child Nutrition & Daily Meals
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operating community kitchens providing wholesome, nutritious daily meals to underprivileged children and families in need.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">
                Education Kits & School Supplies
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering children with textbooks, backpacks, stationery, and learning tools to encourage continuous education and a brighter future.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">
                Elderly Care & Emergency Relief
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Providing health checkups, medicine kits, warm clothing, and emergency aid for elderly citizens and vulnerable individuals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY IMPACT HIGHLIGHT */}
      <section id="impact" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Direct Community Service
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Hands Joined for Real Change
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Donations to <strong className="text-white">{trustConfig.name}</strong> go directly to ground programs without administrative delays. We work side-by-side with local communities to provide immediate relief and long-term support.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">100% Direct Utilization:</strong> Contributions fund food, medical supplies, and education kits directly.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Instant UPI Settlement:</strong> Real-time transfer to trust accounts without third-party deductions.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Voucher Slip:</strong> Instantly view your donation acknowledgment slip.
                </span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
            <img
              src={handsImage}
              alt="Community hands united in support"
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                100% Direct Delivery
              </span>
              <p className="text-sm font-serif text-white mt-1">
                Direct community mobilization with minimal overhead costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-white mb-1.5">
                How does UPI donation work?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                UPI (Unified Payments Interface) allows real-time fund transfers directly from your bank account through any authorized UPI app (Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay). It is zero-fee and settles directly to the trust's account.
              </p>
            </div>

            

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5">
              <h4 className="text-sm font-semibold text-white mb-1.5">
                How is the UPI ID configured?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Currently, the platform uses a placeholder UPI ID which you can update in or via the top configuration banner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-serif font-bold text-white">{trustConfig.name}</p>
            
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
            <a href="#causes" className="hover:text-white transition-colors">Our Causes</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
