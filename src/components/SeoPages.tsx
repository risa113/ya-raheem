import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Flame, Clock, MapPin, PhoneCall, Star, Sparkles, 
  ShieldCheck, CheckCircle2, ChevronRight, MessageCircle, HelpCircle, ExternalLink, Zap, Heart, Tag
} from 'lucide-react';

// Common SEO Banner Header Component
const SeoHeader: React.FC<{ title: string; subtitle: string; tag: string }> = ({ title, subtitle, tag }) => {
  return (
    <div className="bg-gradient-to-r from-primary/20 via-secondary to-secondary border-b border-primary/30 py-8 px-4 text-center space-y-3">
      <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-xs font-black px-3.5 py-1 rounded-full border border-primary/40 uppercase tracking-widest">
        <Sparkles className="w-3.5 h-3.5" /> {tag}
      </span>
      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">{title}</h1>
      <p className="text-gray-300 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
    </div>
  );
};

// Google Business Profile Review Strategy Banner Component
export const GoogleReviewBanner: React.FC = () => {
  const { settings } = useStore();
  const googleReviewUrl = `https://search.google.com/local/writereview?placeid=ChIJMidnightFuelMelapalayam`;

  return (
    <div className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-secondary to-secondary flex flex-col sm:flex-row items-center justify-between gap-4 my-8 shadow-xl">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl shrink-0">
          ⭐
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white">Loved your Midnight Feast?</h3>
          <p className="text-xs text-gray-300">
            Share your experience on Google! Mention your favorite Mandi, Biryani or 2 AM delivery in Tirunelveli & Melapalayam.
          </p>
        </div>
      </div>

      <a
        href={googleReviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold px-5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shrink-0 transition"
      >
        <span>Leave Google Review</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};

// 1. Dedicated Mandi Page (/mandi-tirunelveli)
export const MandiSeoPage: React.FC = () => {
  const { products, addToCart, setCustomerTab } = useStore();
  const mandiProducts = products.filter(p => p.category === 'mandi');

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="TIRUNELVELI MANDI SPECIALIST"
        title="Best Arabian Mandi in Tirunelveli | Mandi Delivery"
        subtitle="Order authentic slow-cooked Yemeni Chicken Mandi, Royal Mutton Mandi, and Tirunelveli Beef Mandi. Cooked fresh with pure ghee, aromatic basmati, and hot red salsa. Delivered till 2 AM in Melapalayam & Tirunelveli."
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* SEO Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-primary space-y-1">
            <h3 className="font-extrabold text-white text-sm">🍗 Slow-Cooked Chicken Mandi</h3>
            <p className="text-gray-400">Marinated for 12 hours and cooked over charcoal. Served with garlic toum and red salsa.</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-amber-500 space-y-1">
            <h3 className="font-extrabold text-white text-sm">🍖 Royal Mutton Mandi</h3>
            <p className="text-gray-400">Mouth-melting tender lamb shoulder pieces over saffron-infused ghee mandi rice.</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 space-y-1">
            <h3 className="font-extrabold text-white text-sm">⚡ 25-Min Express Mandi Delivery</h3>
            <p className="text-gray-400">Thermal sealed insulated box keeps Mandi piping hot right to your doorstep until 2 AM.</p>
          </div>
        </div>

        {/* Mandi Menu Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" /> Arabian Mandi Specials Menu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mandiProducts.map(p => (
              <div key={p.id} className="glass-card rounded-3xl overflow-hidden border border-white/10 p-4 space-y-3 flex flex-col justify-between">
                <img src={p.image} alt={`${p.name} Tirunelveli`} className="w-full h-48 rounded-2xl object-cover" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-white text-base">{p.name}</h3>
                    <span className="bg-emerald-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-lg">⭐ {p.rating || 4.9}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xl font-black text-primary">₹{p.offerPrice || p.price}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-primary hover:bg-primary-hover text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-glow-sm transition"
                  >
                    + ADD MANDI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <GoogleReviewBanner />
      </div>
    </div>
  );
};

// 2. Dedicated Biryani Page (/biryani-tirunelveli)
export const BiryaniSeoPage: React.FC = () => {
  const { products, addToCart } = useStore();
  const biryaniProducts = products.filter(p => p.category === 'biryani');

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="TIRUNELVELI BIRYANI HUB"
        title="Dum Biryani Delivery in Tirunelveli & Melapalayam"
        subtitle="Savor aromatic Seeraga Samba and Hyderabadi Basmati Dum Biryani cooked with original Tirunelveli spices. Served hot with boiled egg, onion raita, and spicy brinjal salna."
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {biryaniProducts.map(p => (
            <div key={p.id} className="glass-card rounded-3xl overflow-hidden border border-white/10 p-4 space-y-3 flex flex-col justify-between">
              <img src={p.image} alt={`${p.name} Tirunelveli`} className="w-full h-48 rounded-2xl object-cover" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-base">{p.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xl font-black text-primary">₹{p.offerPrice || p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-primary hover:bg-primary-hover text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-glow-sm transition"
                >
                  + ADD BIRYANI
                </button>
              </div>
            </div>
          ))}
        </div>

        <GoogleReviewBanner />
      </div>
    </div>
  );
};

// 3. Dedicated Midnight Food Page (/midnight-food-tirunelveli)
export const MidnightFoodSeoPage: React.FC = () => {
  const { products, addToCart, settings } = useStore();

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="OPEN NIGHTLY 7:00 PM – 2:00 AM"
        title="Late Night Food Delivery in Tirunelveli"
        subtitle="Craving food after midnight? Midnight Fuel delivers piping hot Mandi, Dum Biryani, Jumbo Shawarma, Crisp Parottas, and Monster Burgers until 2:00 AM across Melapalayam and Tirunelveli city."
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Operating Timings Feature Box */}
        <div className="glass-panel p-6 rounded-3xl border border-primary/40 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary font-black text-xs px-3 py-1 rounded-full uppercase">
            <Clock className="w-4 h-4 animate-pulse" /> Operating Hours & Booking
          </div>
          <h2 className="text-2xl font-black text-white">Never Sleep Hungry in Tirunelveli</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="bg-secondary p-3 rounded-2xl border border-white/10">
              <span className="text-gray-400 block text-xs">ORDER BOOKING</span>
              <strong className="text-white text-base">7:00 AM – 2:00 AM</strong>
            </div>
            <div className="bg-secondary p-3 rounded-2xl border border-white/10">
              <span className="text-gray-400 block text-xs">KITCHEN DELIVERY</span>
              <strong className="text-primary text-base">7:00 PM – 2:00 AM</strong>
            </div>
          </div>
        </div>

        {/* Featured Midnight Dishes */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-white">Popular 2 AM Night Cravings</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map(p => (
              <div key={p.id} className="glass-card p-3 rounded-2xl space-y-2">
                <img src={p.image} alt={p.name} className="w-full h-36 rounded-xl object-cover" />
                <h4 className="font-extrabold text-white text-xs truncate">{p.name}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-primary">₹{p.offerPrice || p.price}</span>
                  <button onClick={() => addToCart(p)} className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                    + ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <GoogleReviewBanner />
      </div>
    </div>
  );
};

// 4. Dedicated Melapalayam Local Location Page (/food-delivery-melapalayam)
export const MelapalayamSeoPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="LOCAL MELAPALAYAM 627005"
        title="Food Delivery in Melapalayam, Tirunelveli"
        subtitle="Located at Bazar, Near Meera Broilers, Melapalayam, Tirunelveli – 627005. Express 20-minute delivery to all streets in Melapalayam including Bazar, High Ground, Mosque Street, and main road."
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-black text-white">Why Order from Midnight Fuel Melapalayam?</h2>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Fastest Local Delivery:</strong> Under 20 minutes across Melapalayam 627005.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>100% Halal Ingredients:</strong> Freshly slaughtered chicken, mutton & beef cooked daily.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Night Owl Headquarters:</strong> Serving hot food until 2:00 AM every night.</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="bg-primary hover:bg-primary-hover text-white font-extrabold px-6 py-3 rounded-2xl text-xs inline-flex items-center gap-2 shadow-glow-sm"
              >
                <PhoneCall className="w-4 h-4" /> Call Melapalayam Kitchen ({settings.phone})
              </a>
            </div>
          </div>

          <div className="glass-card p-4 rounded-3xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Melapalayam Hub Coordinates</h3>
            <p className="text-xs font-bold text-white mb-2">📍 Bazar, Near Meera Broilers, Melapalayam, Tirunelveli – 627005</p>
            <div className="h-60 rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-xs text-gray-400">
              🗺️ GPS Pin: 8.7075 N, 77.7280 E (Melapalayam)
            </div>
          </div>
        </div>

        <GoogleReviewBanner />
      </div>
    </div>
  );
};

// 5. Dedicated Dishes Pages (Shawarma, Pizza, Fried Chicken)
export const DishCategorySeoPage: React.FC<{ categoryKey: string; title: string; subtitle: string }> = ({ categoryKey, title, subtitle }) => {
  const { products, addToCart } = useStore();
  const categoryProducts = products.filter(p => p.category === categoryKey);

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag={`${categoryKey.toUpperCase()} SPECIALIST`}
        title={title}
        subtitle={subtitle}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryProducts.map(p => (
            <div key={p.id} className="glass-card rounded-3xl overflow-hidden border border-white/10 p-4 space-y-3 flex flex-col justify-between">
              <img src={p.image} alt={`${p.name} Tirunelveli`} className="w-full h-48 rounded-2xl object-cover" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-base">{p.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xl font-black text-primary">₹{p.offerPrice || p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-primary hover:bg-primary-hover text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-glow-sm transition"
                >
                  + ADD ITEM
                </button>
              </div>
            </div>
          ))}
        </div>

        <GoogleReviewBanner />
      </div>
    </div>
  );
};

// 6. Frequently Asked Questions Page (/faq)
export const FaqSeoPage: React.FC = () => {
  const faqs = [
    {
      q: 'What are Midnight Fuel opening hours in Tirunelveli?',
      a: 'We are open for late-night hot food delivery every night from 7:00 PM to 2:00 AM. Pre-order booking line opens daily from 7:00 AM.'
    },
    {
      q: 'Where is Midnight Fuel located in Melapalayam?',
      a: 'Our main kitchen is located at Bazar, Near Meera Broilers, Melapalayam, Tirunelveli – 627005.'
    },
    {
      q: 'Is all food 100% Halal certified?',
      a: 'Yes, 100% of our chicken, mutton, and beef dishes are prepared using strictly Halal certified ingredients.'
    },
    {
      q: 'What is the delivery time for Arabian Mandi and Biryani?',
      a: 'Average delivery time is 20-30 minutes across Melapalayam, Palayamkottai, and Tirunelveli city.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, and NetBanking via Razorpay.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="HELP & FAQS"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about food delivery, Mandi pre-orders, delivery areas in Tirunelveli, and late-night timings."
      />

      <div className="max-w-4xl mx-auto px-4 space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl space-y-2 border border-white/10">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary shrink-0" /> {faq.q}
            </h3>
            <p className="text-xs text-gray-300 pl-7 leading-relaxed">{faq.a}</p>
          </div>
        ))}

        <GoogleReviewBanner />
      </div>
    </div>
  );
};

// 7. Privacy Policy & Terms Pages
export const LegalPages: React.FC<{ mode: 'privacy' | 'terms' }> = ({ mode }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black text-white">
        {mode === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
      </h1>
      <div className="glass-card p-6 rounded-3xl text-xs text-gray-300 space-y-4 leading-relaxed border border-white/10">
        <p>
          Welcome to <strong>Midnight Fuel</strong> (Melapalayam, Tirunelveli). We value your privacy and are committed to protecting your personal data when ordering food.
        </p>
        <h3 className="font-extrabold text-white text-sm">1. Data Collection</h3>
        <p>We collect customer contact information (Name, Mobile Phone Number, Delivery Address, Pincode) solely for fulfilling food orders and delivery dispatch.</p>
        <h3 className="font-extrabold text-white text-sm">2. Payments & Security</h3>
        <p>All online transactions are encrypted via official Razorpay SSL gateways. We do not store credit card CVV numbers.</p>
      </div>
    </div>
  );
};
