import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, ArrowRight, PhoneCall, Clock, Sparkles, ShieldCheck, Tag, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCustomerTab, setSelectedCategory, settings, categories, products } = useStore();
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);

  const heroBanners = [
    {
      id: 1,
      tag: 'MIDNIGHT CRAVINGS SPECIAL',
      title: 'Slow-Cooked Yemeni Chicken Mandi',
      subtitle: 'Flat ₹100 OFF with Code: MIDNIGHT100',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1000&q=80',
      price: '₹420',
      oldPrice: '₹490',
      cat: 'mandi'
    },
    {
      id: 2,
      tag: 'TIRUNELVELI DUM BIRYANI',
      title: 'Royal Mutton Dum Biryani + Salna',
      subtitle: 'Cooked fresh with pure ghee & saffron rice',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
      price: '₹320',
      oldPrice: '₹360',
      cat: 'biryani'
    },
    {
      id: 3,
      tag: 'FEAST FOR THE GANG 🫂',
      title: 'Midnight Fuel Mega Combo Box',
      subtitle: 'Full Mandi + Shawarma + Parottas + Mojito',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      price: '₹899',
      oldPrice: '₹1100',
      cat: 'combo'
    }
  ];

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const currentBanner = heroBanners[activeBannerIndex];

  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:py-16 bg-darkbg border-b border-white/5">
      {/* Background Ambient Blur Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Swiggy/Zomato Style Top Circular Cuisine Avatars Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> WHAT'S ON YOUR MIND?
            </h3>
            <span className="text-[11px] text-primary font-bold hover:underline cursor-pointer" onClick={() => setCustomerTab('menu')}>
              View All Cuisines →
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCustomerTab('menu');
                }}
                className="flex flex-col items-center gap-2 group shrink-0"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-secondary-light to-secondary p-1 border border-white/10 group-hover:border-primary group-hover:shadow-glow-sm transition transform group-hover:scale-105 flex items-center justify-center relative">
                  <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                  <span className="absolute -bottom-1 bg-primary text-white text-[9px] font-black px-1.5 py-0.2 rounded-full opacity-0 group-hover:opacity-100 transition">
                    ORDER
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white transition">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Banner Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Gang Badge */}
            <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 bg-secondary/90 border border-primary/40 px-4 py-2 rounded-full backdrop-blur-md shadow-glass max-w-full">
              <span className="text-xs sm:text-sm font-black text-white">Tirunelveli Midnight Cravings 🫂</span>
              <span className="hidden sm:inline-block h-3.5 w-px bg-white/20" />
              <span className="text-[10px] sm:text-xs font-extrabold text-primary tracking-wide uppercase">
                ⚡ 25-Min Delivery
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-none font-sans">
              MIDNIGHT <span className="text-gradient-orange">FUEL</span>
            </h1>

            {/* Subheading & Timings */}
            <p className="text-sm sm:text-xl font-bold text-gray-200 leading-normal">
              Order Fresh Arabian Mandi, Dum Biryani & Shawarmas Delivered Nightly!
            </p>

            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 bg-secondary/90 border border-white/10 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary animate-pulse shrink-0" />
                <span>Open Nightly: <strong className="text-white font-bold">7:00 PM – 2:00 AM</strong></span>
              </div>
              <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                Pre-booking open from 7:00 AM
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2 w-full">
              <button
                onClick={() => setCustomerTab('menu')}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-glow-primary hover:scale-105 transition transform"
              >
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>Order Food Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setCustomerTab('offers')}
                  className="flex-1 sm:flex-initial bg-secondary/90 hover:bg-secondary-light text-white font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/10 hover:border-primary/50 transition backdrop-blur-md flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Use Coupon Codes</span>
                </button>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex-1 sm:flex-initial bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 font-bold px-4 py-3.5 rounded-2xl text-xs sm:text-sm border border-emerald-500/30 flex items-center justify-center gap-1.5 hover:border-emerald-500 transition whitespace-nowrap"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call Kitchen</span>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-[11px] sm:text-xs text-gray-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Halal Prepared</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>⭐ 4.9 Super Rated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-primary" />
                <span>Thermal Sealed Box</span>
              </div>
            </div>

          </div>

          {/* Right Column Interactive Promotional Showcase Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="glass-panel p-3 rounded-3xl relative overflow-hidden shadow-2xl group border border-primary/30">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="w-full h-[360px] sm:h-[420px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Tag */}
                <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {currentBanner.tag}
                </div>

                {/* Slider Navigation Arrows */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setActiveBannerIndex((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1))}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length)}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Offer Info Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-darkbg/90 backdrop-blur-xl border border-white/15 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-400 font-extrabold">{currentBanner.subtitle}</p>
                    <h4 className="text-base font-extrabold text-white mt-0.5 leading-snug">{currentBanner.title}</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs line-through text-gray-500 mr-1.5">{currentBanner.oldPrice}</span>
                    <span className="text-xl font-black text-primary">{currentBanner.price}</span>
                  </div>
                </div>

              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 mt-3">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBannerIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeBannerIndex === idx ? 'w-6 bg-primary' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

