import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import pillar1Img from '../assets/images/a.jpeg';
import pillar2Img from '../assets/images/b.jpg';
import pillar3Img from '../assets/images/c.png';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, setAmount, donorInfo, setDonorInfo, trustConfig, generateNewRef } = useDonation();

  // Handle smooth scroll when landing on page with a hash (e.g. /#causes)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          const headerOffset = 70;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }, 150);
      }
    }
  }, [location.hash]);

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
      <section id="home" className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
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

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Where Your Donation Goes
            </h2>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
              Transforming Lives in Our Communities
            </h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Every single rupee contributed goes directly towards ground-level operations, medical healing, and compassionate community service.
            </p>
          </div>

          {/* Pillar Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Pillar 1 – Child Nutrition & Shishu Bhawan */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-700/60 transition-all duration-300 shadow-lg hover:shadow-emerald-900/30 hover:shadow-xl flex flex-col">
              <div className="relative h-56 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
                <img
                  src="/gallery/14.jpeg"
                  alt="Daily nutritious meal serving at care home"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-emerald-400/40">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="bg-slate-900 px-5 py-5 flex flex-col flex-1 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-200">
                  Child Nutrition &amp; Shishu Bhawan Care
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  Operating community kitchens providing hygienic, wholesome daily hot meals and clean shelter for destitute children and families.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Programme
                </div>
              </div>
            </div>

            {/* Pillar 2 – Leprosy Rehabilitation & Medical Aid */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-700/60 transition-all duration-300 shadow-lg hover:shadow-emerald-900/30 hover:shadow-xl flex flex-col">
              <div className="relative h-56 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
                <img
                  src="/gallery/1.jpg"
                  alt="Leprosy rehabilitation and medical patient care"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-emerald-400/40">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="bg-slate-900 px-5 py-5 flex flex-col flex-1 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-200">
                  Leprosy Rehabilitation &amp; Medical Aid
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  Providing daily specialized ulcer dressing, customized MCR footwear, physiotherapy, and dignified healthcare for leprosy patients.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Programme
                </div>
              </div>
            </div>

            {/* Pillar 3 – Education & Vocational Training */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-700/60 transition-all duration-300 shadow-lg hover:shadow-emerald-900/30 hover:shadow-xl flex flex-col sm:col-span-2 lg:col-span-1">
              <div className="relative h-56 sm:h-52 lg:h-56 overflow-hidden flex-shrink-0">
                <img
                  src="/gallery/11.jpg"
                  alt="Education kits and vocational skill training"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-emerald-400/40">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="bg-slate-900 px-5 py-5 flex flex-col flex-1 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-200">
                  Education Kits &amp; Vocational Training
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  Equipping children with textbooks, backpacks, and schooling, while providing vocational craft workshops for self-reliant livelihoods.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Programme
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMUNITY IMPACT HIGHLIGHT */}
      <section id="impact" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Transparency &amp; Direct Impact
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Every Rupee Reaches Those in Need
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Donations to <strong className="text-white">{trustConfig.name}</strong> go directly to ground programs without administrative delays or intermediary cuts. We work side-by-side with our beneficiaries to ensure immediate relief, healing, and lasting dignity.
            </p>

            <div className="space-y-3.5 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">100% Direct Ground Utilization:</strong> Every contribution directly funds essential food grains, medical bandages, and student school supplies.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Govt. Registered &amp; 80G Tax Deductible:</strong> Statutory compliance with 12A, 80G tax exemptions, and NITI Aayog NGO Darpan registration.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Zero-Fee UPI &amp; Instant Receipt:</strong> Direct real-time bank settlement with an instantly downloadable donation acknowledgment slip.
                </span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
            <img
              src="/gallery/2.jpg"
              alt="Community volunteers serving nutritious meals"
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                100% On-Ground Service
              </span>
              <p className="text-sm font-serif text-white mt-1">
                Serving nutritious daily meals, medical care, and children's shelter with love and dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Clear &amp; Transparent
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-semibold text-white mb-1.5">
                Are donations eligible for Section 80G Tax Deductions?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes. Mother Teresa's Leprosy Rehabilitation Centre &amp; Shishu Bhawan is a registered charitable trust under Section 12A and Section 80G of the Income Tax Act. Indian donors can claim tax deductions on their contributions.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-semibold text-white mb-1.5">
                How do I receive my official donation acknowledgment receipt?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Immediately after completing your UPI payment, you can generate and download your verified donation receipt voucher slip on this platform, containing your unique transaction reference number and trust registration details.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-semibold text-white mb-1.5">
                Does 100% of my donation go directly to the trust?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes. All UPI transfers settle directly and instantly into the trust's verified bank account with zero platform fees and zero third-party commissions. Every rupee supports daily meals, patient medication, and child education.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-semibold text-white mb-1.5">
                Which UPI payment applications are supported?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You can donate using any standard UPI app including Google Pay, PhonePe, Paytm, BHIM UPI, Amazon Pay, CRED, or your bank's mobile banking app.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-semibold text-white mb-1.5">
                Can I visit the rehabilitation centre or sponsor a meal in person?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes, visitors and well-wishers are warmly invited to visit our care campus, interact with our community, or sponsor special occasion meals. Please see our contact phone and address on the <a href="/about" className="text-emerald-400 hover:underline">About Us page</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
