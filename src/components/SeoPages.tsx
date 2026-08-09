import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Flame, Clock, MapPin, PhoneCall, Star, Sparkles, 
  ShieldCheck, CheckCircle2, ChevronRight, MessageCircle, HelpCircle, ExternalLink, Zap, Heart, Tag
} from 'lucide-react';

// Common SEO Banner Header Component matching iOS UI Kit style
const SeoHeader: React.FC<{ title: string; subtitle: string; tag: string }> = ({ title, subtitle, tag }) => {
  return (
    <div className="bg-white dark:bg-secondary border-b border-black/5 dark:border-white/10 py-10 px-4 text-center space-y-3 transition-colors shadow-ios-sm">
      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" /> {tag}
      </span>
      <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight font-sans">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed font-medium">{subtitle}</p>
    </div>
  );
};

// Google Business Profile Review Strategy Banner Component matching Food Delivery iOS UI Kit
export const GoogleReviewBanner: React.FC = () => {
  const { settings } = useStore();
  const googleReviewUrl = `https://search.google.com/local/writereview?placeid=ChIJMidnightFuelMelapalayam`;

  return (
    <div className="bg-white dark:bg-secondary p-6 rounded-3xl border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 my-8 shadow-ios-card transition-colors">
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-2xl shrink-0">
          ⭐
        </div>
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-white">Loved your Midnight Feast?</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Share your experience on Google! Mention your favorite Mandi, Biryani or 2 AM delivery in Tirunelveli & Melapalayam.
          </p>
        </div>
      </div>

      <a
        href={googleReviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-ios-orange shrink-0 transition uppercase tracking-wider"
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
          <div className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 border-l-4 border-l-primary space-y-1 shadow-ios-card">
            <h3 className="font-black text-gray-900 dark:text-white text-sm">👑 Royal Charcoal Grilled Chicken Mandi</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Marinated for 12 hours and cooked over charcoal. Served with garlic toum and red salsa.</p>
          </div>

          <div className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 border-l-4 border-l-amber-500 space-y-1 shadow-ios-card">
            <h3 className="font-black text-gray-900 dark:text-white text-sm">🍖 Royal Mutton Mandi</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Mouth-melting tender lamb shoulder pieces over saffron-infused ghee mandi rice.</p>
          </div>

          <div className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 border-l-4 border-l-emerald-500 space-y-1 shadow-ios-card">
            <h3 className="font-black text-gray-900 dark:text-white text-sm">⚡ 25-Min Express Mandi Delivery</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Thermal sealed box keeps Mandi piping hot right to your doorstep until 2 AM.</p>
          </div>
        </div>

        {/* Mandi Menu Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" /> Arabian Mandi Specials Menu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mandiProducts.map(p => (
              <div key={p.id} className="bg-white dark:bg-secondary rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 p-4 space-y-3 flex flex-col justify-between shadow-ios-card">
                <img 
                  src={p.image} 
                  alt={`${p.name} - Authentic Arabian Mandi in Melapalayam Tirunelveli`} 
                  loading="lazy"
                  className="w-full h-48 rounded-2xl object-cover" 
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 dark:text-white text-base">{p.name}</h3>
                    <span className="bg-emerald-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-lg">⭐ {p.rating || 4.9}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-medium">{p.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                  <span className="text-xl font-black text-primary">₹{p.offerPrice || p.price}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-primary hover:bg-primary-hover text-white font-black px-4 py-2 rounded-xl text-xs shadow-ios-orange transition"
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
            <div key={p.id} className="bg-white dark:bg-secondary rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 p-4 space-y-3 flex flex-col justify-between shadow-ios-card">
              <img src={p.image} alt={`${p.name} Tirunelveli`} className="w-full h-48 rounded-2xl object-cover" />
              <div className="space-y-1">
                <h3 className="font-black text-gray-900 dark:text-white text-base">{p.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-medium">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                <span className="text-xl font-black text-primary">₹{p.offerPrice || p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-primary hover:bg-primary-hover text-white font-black px-4 py-2 rounded-xl text-xs shadow-ios-orange transition"
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
  const { products, addToCart } = useStore();

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="OPEN NIGHTLY 7:00 PM – 2:00 AM"
        title="Late Night Food Delivery in Tirunelveli"
        subtitle="Craving food after midnight? Food App delivers piping hot Mandi, Dum Biryani, Jumbo Shawarma, Crisp Parottas, and Monster Burgers until 2:00 AM across Melapalayam and Tirunelveli city."
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Operating Timings Feature Box */}
        <div className="bg-white dark:bg-secondary p-6 rounded-3xl border border-primary/30 space-y-4 text-center shadow-ios-card">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-black text-xs px-3 py-1 rounded-full uppercase">
            <Clock className="w-4 h-4 animate-pulse" /> Operating Hours & Booking
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Never Sleep Hungry in Tirunelveli</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="bg-secondary-soft dark:bg-darkbg p-4 rounded-2xl border border-black/5 dark:border-white/10">
              <span className="text-gray-400 block text-xs font-bold">ORDER BOOKING</span>
              <strong className="text-gray-900 dark:text-white text-base">7:00 AM – 2:00 AM</strong>
            </div>
            <div className="bg-secondary-soft dark:bg-darkbg p-4 rounded-2xl border border-black/5 dark:border-white/10">
              <span className="text-gray-400 block text-xs font-bold">KITCHEN DELIVERY</span>
              <strong className="text-primary text-base">7:00 PM – 2:00 AM</strong>
            </div>
          </div>
        </div>

        {/* Featured Midnight Dishes */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">Popular 2 AM Night Cravings</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map(p => (
              <div key={p.id} className="bg-white dark:bg-secondary p-3.5 rounded-2xl space-y-2 border border-black/5 dark:border-white/10 shadow-ios-card">
                <img src={p.image} alt={p.name} className="w-full h-36 rounded-xl object-cover" />
                <h4 className="font-black text-gray-900 dark:text-white text-xs truncate">{p.name}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-primary">₹{p.offerPrice || p.price}</span>
                  <button onClick={() => addToCart(p)} className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-xl shadow-ios-orange">
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
          <div className="bg-white dark:bg-secondary p-6 rounded-3xl space-y-4 border border-black/5 dark:border-white/10 shadow-ios-card">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Why Order from Food App Melapalayam?</h2>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Fastest Local Delivery:</strong> Under 20 minutes across Melapalayam 627005.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>100% Halal Ingredients:</strong> Freshly slaughtered chicken, mutton & beef cooked daily.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Night Owl Headquarters:</strong> Serving hot food until 2:00 AM every night.</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="bg-primary hover:bg-primary-hover text-white font-black px-6 py-3 rounded-2xl text-xs inline-flex items-center gap-2 shadow-ios-orange"
              >
                <PhoneCall className="w-4 h-4" /> Call Melapalayam Kitchen ({settings.phone})
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-secondary p-4 rounded-3xl border border-black/5 dark:border-white/10 shadow-ios-card">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-2">Melapalayam Hub Coordinates</h3>
            <p className="text-xs font-black text-gray-900 dark:text-white mb-2">📍 Bazar, Near Meera Broilers, Melapalayam, Tirunelveli – 627005</p>
            <div className="h-60 rounded-2xl bg-secondary-soft dark:bg-darkbg border border-black/5 dark:border-white/10 flex items-center justify-center text-xs text-gray-500 font-bold">
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
            <div key={p.id} className="bg-white dark:bg-secondary rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 p-4 space-y-3 flex flex-col justify-between shadow-ios-card">
              <img src={p.image} alt={`${p.name} Tirunelveli`} className="w-full h-48 rounded-2xl object-cover" />
              <div className="space-y-1">
                <h3 className="font-black text-gray-900 dark:text-white text-base">{p.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-medium">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                <span className="text-xl font-black text-primary">₹{p.offerPrice || p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-primary hover:bg-primary-hover text-white font-black px-4 py-2 rounded-xl text-xs shadow-ios-orange transition"
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

// FAQ Page
export const FaqSeoPage: React.FC = () => {
  const faqs = [
    {
      q: 'What are the delivery timings of Food App in Tirunelveli?',
      a: 'We operate nightly from 7:00 PM to 2:00 AM for live instant delivery across Melapalayam and Tirunelveli. Pre-bookings can be placed anytime from 7:00 AM onwards.'
    },
    {
      q: 'Is all food 100% Halal certified?',
      a: 'Yes, 100% Halal. All chicken, mutton, and beef are slaughtered according to strict Halal procedures daily.'
    },
    {
      q: 'Which locations in Tirunelveli do you deliver to?',
      a: 'We provide 20-minute delivery to Melapalayam (627005), High Ground, Palayamkottai (627002), Vannarpettai (627003), Tirunelveli Town (627006), and Perumalpuram (627007).'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We accept Cash on Delivery (COD) as well as instant Online UPI (GPay, PhonePe, Paytm), Credit Cards, Debit Cards, and Net Banking.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="CUSTOMER SUPPORT & HELP"
        title="Frequently Asked Questions (FAQ)"
        subtitle="Got questions about our late night food delivery, Halal certification, or menu? Find instant answers below."
      />

      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 space-y-2 shadow-ios-card">
            <h3 className="font-black text-gray-900 dark:text-white text-base flex items-start gap-2">
              <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{f.q}</span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed pl-7 font-medium">
              {f.a}
            </p>
          </div>
        ))}

        <GoogleReviewBanner />
      </div>
    </div>
  );
};

// Legal Pages (Privacy & Terms)
export const LegalPages: React.FC<{ mode: 'privacy' | 'terms' }> = ({ mode }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white dark:bg-secondary p-6 sm:p-8 rounded-3xl border border-black/5 dark:border-white/10 space-y-4 shadow-ios-card">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          {mode === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          {mode === 'privacy'
            ? 'Midnight Fuel respects your privacy. We collect your delivery address and contact information solely to fulfill your food orders and provide live GPS driver tracking updates.'
            : 'By using Midnight Fuel, you agree to comply with our terms regarding late night orders, delivery area limits (Tirunelveli & Melapalayam), and order cancellation policies.'
          }
        </p>
      </div>
    </div>
  );
};

// 6. Dedicated Catering & Bulk Orders SEO Page (/catering-tirunelveli)
export const CateringSeoPage: React.FC = () => {
  const { settings } = useStore();
  const [paxCount, setPaxCount] = useState<number>(100);
  const [selectedPackage, setSelectedPackage] = useState<'silver' | 'gold' | 'platinum'>('gold');

  const packagePrices = {
    silver: 350,
    gold: 550,
    platinum: 850
  };

  const estimatedTotal = paxCount * packagePrices[selectedPackage];

  const cateringWaUrl = `https://wa.me/919080139363?text=${encodeURIComponent(
    `Hello Midnight Fuel Catering Team! I want a quote for my event in Tirunelveli/Melapalayam:\n- Guests: ${paxCount} Pax\n- Package: ${selectedPackage.toUpperCase()} Package (₹${packagePrices[selectedPackage]}/plate)\n- Estimated Total: ₹${estimatedTotal}\nPlease contact me!`
  )}`;

  return (
    <div className="space-y-8 pb-12">
      <SeoHeader 
        tag="TIRUNELVELI & MELAPALAYAM #1 CATERING SPECIALIST"
        title="Arabian Mandi & Dum Biryani Catering Services in Tirunelveli"
        subtitle="Make your Wedding, Sunnat Function, Birthday Party, or Corporate Event unforgettable with authentic Arabian Mandi & Dum Biryani Catering in Melapalayam & Tirunelveli. Live Charcoal Mandi Cooking, Giant Arabian Thaal Platter Setup, and 100% Halal certified bulk orders."
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Catering Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 border-l-4 border-l-primary space-y-1 shadow-ios-card">
            <div className="text-2xl">🔥</div>
            <h3 className="font-black text-gray-900 dark:text-white text-sm">Live Mandi Charcoal Station</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Authentic Yemeni Pit Mandi cooked live at your event venue in Tirunelveli.</p>
          </div>

          <div className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 border-l-4 border-l-amber-500 space-y-1 shadow-ios-card">
            <div className="text-2xl">🍽️</div>
            <h3 className="font-black text-gray-900 dark:text-white text-sm">Royal Arabian Thaal Setup</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Traditional 4-person sharing jumbo brass Mandi Thaal platters for authentic dining.</p>
          </div>

          <div className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 border-l-4 border-l-emerald-500 space-y-1 shadow-ios-card">
            <div className="text-2xl">📦</div>
            <h3 className="font-black text-gray-900 dark:text-white text-sm">Thermal Insulated Hot Delivery</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Piping hot food delivered in sealed thermal food warmers anywhere in Tirunelveli.</p>
          </div>

          <div className="bg-white dark:bg-secondary p-5 rounded-3xl border border-black/5 dark:border-white/10 border-l-4 border-l-blue-500 space-y-1 shadow-ios-card">
            <div className="text-2xl">📜</div>
            <h3 className="font-black text-gray-900 dark:text-white text-sm">100% Halal Certified</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Pure Ghee, premium Seeraga Samba / Basmati rice, and fresh Halal meats.</p>
          </div>
        </div>

        {/* Catering Packages Grid */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Catering Package Tiers</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Choose your preferred menu package or customize for your event</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Silver Package */}
            <div className={`bg-white dark:bg-secondary rounded-3xl border p-6 space-y-5 shadow-ios-card flex flex-col justify-between transition ${
              selectedPackage === 'silver' ? 'border-primary ring-2 ring-primary/20' : 'border-black/5 dark:border-white/10'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-500/10 text-gray-600 dark:text-gray-300 font-black px-3 py-1 rounded-full uppercase">Silver Package</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">₹350 <span className="text-xs text-gray-400 font-normal">/ plate</span></span>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Mini Mandi & Biryani Feast</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ideal for Sunnat functions, office parties & family gatherings (50-100 guests).</p>
                <ul className="text-xs space-y-2 text-gray-700 dark:text-gray-300 font-semibold pt-2">
                  <li className="flex items-center gap-2">✓ Yemeni Chicken Mandi Rice</li>
                  <li className="flex items-center gap-2">✓ Juicy Charcoal Grilled Chicken (1 Piece)</li>
                  <li className="flex items-center gap-2">✓ Authentic Garlic Toum Dip</li>
                  <li className="flex items-center gap-2">✓ Spicy Red Salsa Sauce</li>
                  <li className="flex items-center gap-2">✓ Cold Drinks / Soft Beverage</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedPackage('silver')}
                className={`w-full py-3 rounded-2xl text-xs font-black transition uppercase tracking-wider ${
                  selectedPackage === 'silver' ? 'bg-primary text-white shadow-ios-orange' : 'bg-secondary-soft dark:bg-darkbg text-gray-900 dark:text-white border border-black/5 dark:border-white/10'
                }`}
              >
                {selectedPackage === 'silver' ? 'Selected Package ✓' : 'Select Silver Package'}
              </button>
            </div>

            {/* Gold Package */}
            <div className={`bg-white dark:bg-secondary rounded-3xl border p-6 space-y-5 shadow-ios-card flex flex-col justify-between relative transition ${
              selectedPackage === 'gold' ? 'border-primary ring-2 ring-primary/30 shadow-ios-orange' : 'border-primary/50'
            }`}>
              <div className="absolute -top-3 right-6 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-ios-orange">
                Most Popular
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-primary/10 text-primary font-black px-3 py-1 rounded-full uppercase">Gold Royal Combo</span>
                  <span className="text-2xl font-black text-primary">₹550 <span className="text-xs text-gray-400 font-normal">/ plate</span></span>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Royal Mandi & Dum Biryani Combo</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Perfect for Engagement, Valima & Large Family Events (100-500 guests).</p>
                <ul className="text-xs space-y-2 text-gray-700 dark:text-gray-300 font-semibold pt-2">
                  <li className="flex items-center gap-2 text-primary font-black">✓ Full Arabian Chicken Mandi</li>
                  <li className="flex items-center gap-2">✓ Seeraga Samba Dum Biryani</li>
                  <li className="flex items-center gap-2">✓ Beef Chukka / Mutton Kabab Side</li>
                  <li className="flex items-center gap-2">✓ Onion Raita & Brinjal Dalcha</li>
                  <li className="flex items-center gap-2">✓ Sweet Bread Halwa / Gulab Jamun</li>
                  <li className="flex items-center gap-2">✓ Arabian Thaal Platter Setup Included</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedPackage('gold')}
                className={`w-full py-3 rounded-2xl text-xs font-black transition uppercase tracking-wider ${
                  selectedPackage === 'gold' ? 'bg-primary text-white shadow-ios-orange' : 'bg-secondary-soft dark:bg-darkbg text-gray-900 dark:text-white border border-black/5 dark:border-white/10'
                }`}
              >
                {selectedPackage === 'gold' ? 'Selected Package ✓' : 'Select Gold Package'}
              </button>
            </div>

            {/* Platinum Package */}
            <div className={`bg-white dark:bg-secondary rounded-3xl border p-6 space-y-5 shadow-ios-card flex flex-col justify-between transition ${
              selectedPackage === 'platinum' ? 'border-primary ring-2 ring-primary/20' : 'border-black/5 dark:border-white/10'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-amber-500/10 text-amber-500 font-black px-3 py-1 rounded-full uppercase">Platinum Wedding</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">₹850 <span className="text-xs text-gray-400 font-normal">/ plate</span></span>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Grand Marriage Mandi Feast</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ultimate Royal Wedding Catering with Live Chefs & Full Whole Lamb Mandi (500+ guests).</p>
                <ul className="text-xs space-y-2 text-gray-700 dark:text-gray-300 font-semibold pt-2">
                  <li className="flex items-center gap-2 text-amber-500 font-black">★ Live Pit Whole Lamb / Whole Chicken Mandi</li>
                  <li className="flex items-center gap-2">✓ Royal Mutton Dum Biryani</li>
                  <li className="flex items-center gap-2">✓ Jumbo Pepper BBQ Grill Chicken</li>
                  <li className="flex items-center gap-2">✓ Arabic Creamy Toum, Mayonnaise & Hummus</li>
                  <li className="flex items-center gap-2">✓ Tender Coconut Milk Pudding / Kheer</li>
                  <li className="flex items-center gap-2">✓ Live Uniformed Chef Service Team</li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedPackage('platinum')}
                className={`w-full py-3 rounded-2xl text-xs font-black transition uppercase tracking-wider ${
                  selectedPackage === 'platinum' ? 'bg-primary text-white shadow-ios-orange' : 'bg-secondary-soft dark:bg-darkbg text-gray-900 dark:text-white border border-black/5 dark:border-white/10'
                }`}
              >
                {selectedPackage === 'platinum' ? 'Selected Package ✓' : 'Select Platinum Package'}
              </button>
            </div>

          </div>
        </div>

        {/* Interactive Event Cost Calculator & Instant Quote */}
        <div className="bg-white dark:bg-secondary p-6 sm:p-8 rounded-3xl border border-black/5 dark:border-white/10 space-y-6 shadow-ios-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Instant Event Catering Estimator</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Adjust guest count to get an instant quote for your wedding or function</p>
            </div>
            <span className="text-xs bg-primary/10 text-primary font-black px-3.5 py-1.5 rounded-full uppercase">
              Tirunelveli & Melapalayam
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-900 dark:text-white block">
                Number of Guests (Pax): <span className="text-primary text-base font-black">{paxCount} Guests</span>
              </label>
              
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={paxCount}
                onChange={(e) => setPaxCount(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-secondary-soft dark:bg-darkbg rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                <span>50 Pax</span>
                <span>250 Pax</span>
                <span>500 Pax</span>
                <span>1000 Pax</span>
                <span>2000+ Pax</span>
              </div>
            </div>

            <div className="bg-secondary-soft dark:bg-darkbg p-5 rounded-2xl border border-black/5 dark:border-white/10 space-y-3 text-center sm:text-right">
              <div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">ESTIMATED EVENT COST</span>
                <span className="text-3xl sm:text-4xl font-black text-primary">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">({paxCount} Guests × ₹{packagePrices[selectedPackage]} / plate)</span>
              </div>

              <a
                href={cateringWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl text-xs inline-flex items-center justify-center gap-2 shadow-sm transition uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" /> Get Instant Quote on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <GoogleReviewBanner />

      </div>
    </div>
  );
};

