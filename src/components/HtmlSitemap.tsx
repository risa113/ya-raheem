import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, MapPin, Utensils, HelpCircle, ShieldCheck, Tag } from 'lucide-react';

export const HtmlSitemap: React.FC = () => {
  const { setCustomerTab, products, setActiveProductDetail } = useStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary to-secondary border-b border-primary/30 py-8 px-4 text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-xs font-black px-3.5 py-1 rounded-full border border-primary/40 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> HTML SITEMAP INDEX
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">MidnightFuelss Site Architecture</h1>
        <p className="text-gray-300 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
          Complete directory of all indexable commercial pages, dish categories, location guides, and customer support resources for MidnightFuelss in Tirunelveli & Melapalayam.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Section 1: Priority Commercial Pages */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Utensils className="w-5 h-5 text-amber-400" /> Commercial & Dish Pages
          </h2>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li>
              <button onClick={() => setCustomerTab('mandi-tirunelveli')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                👉 Best Arabian Mandi in Tirunelveli
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('biryani-tirunelveli')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                👉 Hyderabadi Dum Biryani Delivery Tirunelveli
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('shawarma-tirunelveli')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                👉 Juicy Chicken Shawarma Delivery Tirunelveli
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('pizza-tirunelveli')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                👉 Late Night Wood-Fired Pizza Tirunelveli
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('fried-chicken-tirunelveli')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                👉 Crispy Fried Chicken & Burgers Tirunelveli
              </button>
            </li>
          </ul>
        </div>

        {/* Section 2: Local SEO Locations */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <MapPin className="w-5 h-5 text-amber-400" /> Service Area Locations
          </h2>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li>
              <button onClick={() => setCustomerTab('food-delivery-melapalayam')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                📍 Food Delivery in Melapalayam (627005)
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('midnight-food-tirunelveli')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                📍 Late Night Food Delivery Tirunelveli Town
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('food-delivery-melapalayam')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                📍 Palayamkottai & High Ground Night Delivery
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('food-delivery-melapalayam')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                📍 Perumalpuram & Vannarpettai Midnight Feasts
              </button>
            </li>
          </ul>
        </div>

        {/* Section 3: Customer Support & Legal */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-5 h-5 text-amber-400" /> Customer Support & Legal
          </h2>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li>
              <button onClick={() => setCustomerTab('faq')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                ℹ️ Frequently Asked Questions (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('menu')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                🍔 Complete Food Menu & Pricing
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('contact')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                📞 Contact Kitchen & Location Map
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('privacy-policy')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                📜 Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setCustomerTab('terms')} className="hover:text-amber-400 font-bold transition flex items-center gap-2">
                📜 Terms & Conditions
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Full Menu Product Directory */}
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-amber-400" /> Full Gourmet Menu Items Directory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {products.map(p => (
            <div 
              key={p.id}
              onClick={() => setActiveProductDetail(p)}
              className="glass-card p-3 rounded-2xl border border-white/10 hover:border-amber-400 cursor-pointer transition flex items-center gap-3"
            >
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div>
                <h3 className="font-extrabold text-white truncate max-w-[160px]">{p.name}</h3>
                <p className="text-amber-400 font-bold">₹{p.offerPrice || p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
