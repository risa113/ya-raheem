import React from 'react';
import { useStore } from '../context/StoreContext';
import { PhoneCall, MessageCircle } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { settings } = useStore();
  const rawPhone = settings.phone.replace(/[^0-9]/g, '');

  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent('Hello Midnight Fuel! I want to order food or inquire about catering.')}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col gap-3">
      {/* Floating Call Button */}
      <a
        href={`tel:${rawPhone}`}
        className="w-13 h-13 rounded-full bg-secondary border border-emerald-500/50 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center shadow-lg hover:scale-110 transition transform group relative"
        title="Call Midnight Fuel"
      >
        <PhoneCall className="w-6 h-6" />
        <span className="absolute right-14 bg-secondary text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Call +91 90801 39363
        </span>
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition transform group relative animate-bounce"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-14 bg-secondary text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
          WhatsApp Order 💬
        </span>
      </a>
    </div>
  );
};
