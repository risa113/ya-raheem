import React from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, ArrowRight, PhoneCall, Clock, Sparkles, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCustomerTab, settings } = useStore();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-darkbg border-b border-white/5">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Gang Badge */}
            <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 bg-secondary/80 border border-primary/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md shadow-glass max-w-full">
              <span className="text-xs sm:text-base font-extrabold whitespace-nowrap">Gang 🫂🫶</span>
              <span className="hidden sm:inline-block h-3.5 w-px bg-white/20" />
              <span className="text-[10px] sm:text-xs font-bold text-primary tracking-wide uppercase whitespace-nowrap">Tirunelveli Midnight Cravings</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
              MIDNIGHT <span className="text-gradient-orange">FUEL</span>
            </h1>

            {/* Tagline & Subheading */}
            <p className="text-sm sm:text-xl font-semibold text-gray-200 leading-normal">
              Daily Orders Available <span className="text-primary">•</span> Fresh <span className="text-primary">•</span> Hot <span className="text-primary">•</span> Fast
            </p>

            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 bg-secondary/90 border border-white/10 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-xl text-xs sm:text-sm font-medium text-gray-300 max-w-full">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse shrink-0" />
                <span>Open Every Night: <strong className="text-white font-bold">7:00 PM – 2:00 AM</strong></span>
              </div>
              <span className="text-[10px] sm:text-xs text-primary-light">(Booking opens from 7:00 AM)</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Serving Tirunelveli's ultimate midnight feast. Slow-cooked Arabian Mandi, spicy dum biryani, jumbo shawarmas, crispy parottas, and monster burgers delivered piping hot right to your door.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full">
              <button
                onClick={() => setCustomerTab('menu')}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white font-bold px-7 py-3 rounded-full text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-glow-primary hover:scale-105 transition transform"
              >
                <span>Order Food Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setCustomerTab('menu')}
                  className="flex-1 sm:flex-initial bg-secondary/90 hover:bg-secondary-light text-white font-semibold px-5 py-3 rounded-full text-xs sm:text-base border border-white/10 hover:border-primary/50 transition backdrop-blur-md text-center"
                >
                  View Menu
                </button>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex-1 sm:flex-initial bg-secondary/90 hover:bg-secondary-light text-emerald-400 font-semibold px-4 py-3 rounded-full text-xs sm:text-base border border-emerald-500/30 flex items-center justify-center gap-1.5 hover:border-emerald-500 transition whitespace-nowrap"
                >
                  <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 sm:pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-[11px] sm:text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span>100% Halal Prepared</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>30-Min Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span>Hot Thermal Sealed Box</span>
              </div>
            </div>

          </div>

          {/* Right Column Visual Showcase Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glass Image Container */}
              <div className="glass-panel p-3 rounded-3xl relative overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1000&q=80"
                  alt="Midnight Mandi Special"
                  className="w-full h-[380px] sm:h-[440px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay Glass Floating Tag */}
                <div className="absolute top-6 right-6 bg-darkbg/85 backdrop-blur-md border border-primary/50 text-white p-3 rounded-2xl shadow-glass flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                    🔥
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-300">Midnight Special</p>
                    <p className="text-sm font-extrabold text-primary">Chicken Mandi Full</p>
                  </div>
                </div>

                {/* Bottom Offer Pill */}
                <div className="absolute bottom-6 left-6 right-6 bg-darkbg/90 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] bg-primary text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      POPULAR DISH
                    </span>
                    <p className="text-base font-bold text-white mt-0.5">Special Midnight Feast</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs line-through text-gray-500 mr-1.5">₹490</span>
                    <span className="text-lg font-extrabold text-primary">₹420</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
