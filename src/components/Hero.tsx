import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, ArrowRight, PhoneCall, Clock, Sparkles, ShieldCheck, Tag, Zap, ChevronLeft, ChevronRight, Star, ChevronRight as ChevronIcon } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCustomerTab, setSelectedCategory, settings, categories, products, setActiveProductDetail, addToCart } = useStore();
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);

  const heroBanners = [
    {
      id: 1,
      tag: 'ALL YOUR FAVORITES',
      title: 'Get all your loved foods in one place',
      subtitle: 'You just place the order we do the rest',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
      price: '₹140',
      oldPrice: '₹180',
      cat: 'pizza'
    },
    {
      id: 2,
      tag: 'BURGER BISTRO',
      title: 'Double Patty Melted Cheese Burger',
      subtitle: 'Served with crispy fries and dips',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
      price: '₹120',
      oldPrice: '₹150',
      cat: 'burger'
    },
    {
      id: 3,
      tag: 'YEMENI MANDI FEAST',
      title: 'Slow-Cooked Arabian Chicken Mandi',
      subtitle: 'Saffron spiced basmati rice with charcoal roasted chicken',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1000&q=80',
      price: '₹280',
      oldPrice: '₹350',
      cat: 'mandi'
    }
  ];

  const featuredRestaurants = [
    {
      id: 'r1',
      name: 'Rose Garden Restaurant',
      cuisine: 'Burger - Chicken - Rich - Wings',
      rating: '4.7',
      delivery: 'Free',
      time: '20 min',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'r2',
      name: 'Spicy Restaurant & Grill',
      cuisine: 'Arabian - Mandi - Kebabs',
      rating: '4.9',
      delivery: 'Free',
      time: '15 min',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'r3',
      name: 'Uttora Coffee House & Pizzeria',
      cuisine: 'Pizza - Pasta - Dessert',
      rating: '4.8',
      delivery: 'Free',
      time: '25 min',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
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
    <section className="relative overflow-hidden pt-4 pb-8 bg-lightbg dark:bg-darkbg border-b border-black/5 dark:border-white/5 transition-colors">
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* User Greeting Bar (Matching UI Kit header "Hey Halal, Good Afternoon!") */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Hey Halal, <span className="text-primary font-black">Good Afternoon!</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">What would you like to order today?</p>
          </div>

          <button
            onClick={() => setCustomerTab('menu')}
            className="hidden sm:flex items-center gap-1 text-xs font-black text-primary hover:underline"
          >
            <span>See All Dishes</span>
            <ChevronIcon className="w-4 h-4" />
          </button>
        </div>

        {/* All Categories Carousel - Matching Image 1 & 2 & 5 of UI Kit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-gray-900 dark:text-white tracking-wider">
              All Categories
            </h3>
            <span 
              onClick={() => setCustomerTab('menu')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 no-scrollbar touch-pan-x snap-x">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCustomerTab('menu');
                }}
                className="flex flex-col items-center group shrink-0"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-secondary p-1 border border-black/5 dark:border-white/10 group-hover:border-primary group-hover:shadow-ios-orange transition-all duration-300 transform group-hover:-translate-y-1 relative shrink-0 flex items-center justify-center overflow-hidden">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <span className="text-3xl">{cat.icon}</span>
                  )}
                </div>
                <span className="text-xs font-extrabold text-gray-900 dark:text-white mt-2 group-hover:text-primary transition">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">
                  Starting ₹{cat.id === 'mandi' ? '280' : cat.id === 'burger' ? '99' : '140'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Interactive Showcase Slider */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column Promotional Showcase Card */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-secondary border border-black/5 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-ios-card space-y-5 relative overflow-hidden">
              
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Flame className="w-4 h-4" /> {currentBanner.tag}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight font-sans">
                {currentBanner.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium leading-relaxed">
                {currentBanner.subtitle}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCustomerTab('menu')}
                  className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white font-black px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-ios-orange transition transform hover:scale-105"
                >
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-baseline gap-1.5 px-4 py-2 rounded-2xl bg-secondary-soft dark:bg-darkbg">
                  <span className="text-xl font-black text-primary">{currentBanner.price}</span>
                  <span className="text-xs line-through text-gray-400">{currentBanner.oldPrice}</span>
                </div>
              </div>

              {/* Banner slider indicators */}
              <div className="flex items-center gap-2 pt-2">
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBannerIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeBannerIndex === idx ? 'w-6 bg-primary' : 'w-2 bg-gray-300 dark:bg-white/20'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Right Column Banner Photo Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-ios-lg group border border-black/5 dark:border-white/10">
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-[260px] sm:h-[320px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-black uppercase text-primary tracking-wider">FEATURED DISH</span>
                <h3 className="text-lg font-black">{currentBanner.title}</h3>
              </div>
            </div>
          </div>

        </div>

        {/* Open Restaurants / Kitchens Cards - Matching Image 1 & 2 of UI Kit */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black uppercase text-gray-900 dark:text-white tracking-wider">
              Open Restaurants
            </h3>
            <span 
              onClick={() => setCustomerTab('menu')}
              className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((resto) => (
              <div
                key={resto.id}
                onClick={() => setCustomerTab('menu')}
                className="bg-white dark:bg-secondary border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-ios-card hover:border-primary/50 transition cursor-pointer group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={resto.image} 
                    alt={resto.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{resto.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-primary transition">
                    {resto.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {resto.cuisine}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-gray-700 dark:text-gray-300 pt-1 border-t border-gray-100 dark:border-white/5">
                    <span className="flex items-center gap-1 text-primary">
                      🛵 {resto.delivery}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {resto.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
