import React, { useState, useEffect, useRef } from 'react';
import { useStore, ThemePalette } from '../context/StoreContext';
import { 
  Flame, ShoppingBag, User, Search, Clock, 
  MapPin, Heart, Shield, PhoneCall, Sparkles, LogOut, X, ChevronDown, Check, ArrowRight, Palette
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTheme, setActiveTheme,
    viewMode, setViewMode, 
    customerTab, setCustomerTab, 
    cart, setIsCartOpen, 
    searchQuery, setSearchQuery, 
    wishlist, 
    isLoggedIn, userName, userRole, logoutUser, setIsAuthModalOpen,
    isRestaurantOpen, settings, orders, setActiveOrder, products, addToCart, setActiveProductDetail
  } = useStore();

  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('Bazar, Melapalayam, Tirunelveli – 627005');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.offerPrice || item.product.price) * item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  // Search matching products autocomplete
  const searchResults = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const availableAreas = [
    'Bazar, Melapalayam, Tirunelveli – 627005',
    'High Ground, Palayamkottai, Tirunelveli – 627002',
    'Tirunelveli Town, Near Swami Temple – 627006',
    'Vannarpettai, Tirunelveli – 627003',
    'Perumalpuram, Tirunelveli – 627007',
  ];

  const themeOptions: { id: ThemePalette; name: string; icon: string; bg: string; border: string }[] = [
    { id: 'emerald', name: 'Royal Emerald & Gold', icon: '👑', bg: 'from-emerald-500 to-amber-500', border: 'border-emerald-500' },
    { id: 'saffron', name: 'Saffron & Flame Sunset', icon: '🌇', bg: 'from-amber-500 to-orange-600', border: 'border-amber-500' },
    { id: 'crimson', name: 'Crimson & Rose Gold', icon: '🍷', bg: 'from-rose-600 to-amber-400', border: 'border-rose-600' },
    { id: 'amethyst', name: 'Midnight Amethyst', icon: '🔮', bg: 'from-purple-600 to-amber-400', border: 'border-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-darkbg/95 backdrop-blur-xl border-b border-white/10 transition-all shadow-xl">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary to-primary/20 border-b border-primary/20 text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between text-gray-300 font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRestaurantOpen ? 'bg-success' : 'bg-danger'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isRestaurantOpen ? 'bg-success' : 'bg-danger'}`}></span>
          </span>
          <span className="text-white font-bold tracking-wide">
            {isRestaurantOpen ? '🟢 Kitchen LIVE • Delivering Hot Midnight Feasts!' : '🌙 Opens Daily 7:00 PM – 2:00 AM (Booking Open)'}
          </span>
        </div>

        {/* Location & Theme Picker Header Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Theme Palette Switcher Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setShowThemeModal(!showThemeModal)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-white transition text-[11px] sm:text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30"
              title="Change Color Theme Palette"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Theme:</span>
              <span className="capitalize font-black text-amber-300">
                {themeOptions.find(t => t.id === activeTheme)?.name.split(' ')[0] || 'Royal'}
              </span>
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </button>

            {showThemeModal && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-secondary/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-2xl p-2 z-[100] space-y-1.5">
                <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Select Elegant Theme</span>
                  <span className="text-xs">🎨</span>
                </div>
                {themeOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTheme(t.id);
                      setShowThemeModal(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center justify-between transition border ${
                      activeTheme === t.id
                        ? 'bg-primary/20 border-primary text-white'
                        : 'bg-darkbg/60 border-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{t.icon}</span>
                      <span>{t.name}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${t.bg} border ${t.border} shrink-0`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 text-primary-light hover:text-white transition text-[11px] sm:text-xs font-semibold bg-white/5 hover:bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10"
          >
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[200px]">{selectedAddress.split(',')[0]}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          <a 
            href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
            className="hidden lg:flex items-center gap-1 hover:text-white transition text-xs font-medium"
          >
            <PhoneCall className="w-3.5 h-3.5 text-primary" /> {settings.phone}
          </a>

          {/* Admin Switch */}
          <button
            onClick={() => setViewMode(viewMode === 'customer' ? 'admin' : 'customer')}
            className="flex items-center gap-1 bg-primary/20 hover:bg-primary text-primary hover:text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold transition border border-primary/40 whitespace-nowrap"
          >
            <Shield className="w-3 h-3" />
            <span>{viewMode === 'customer' ? 'Admin Portal' : 'Customer View'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Swiggy/Zomato Brand Logo */}
          <div 
            onClick={() => setCustomerTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-white font-sans">
                  MIDNIGHT<span className="text-primary">FUEL</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                  SWIGGY & ZOMATO PRO
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-gray-400 font-medium tracking-wide">Tirunelveli's #1 Midnight Food App</p>
            </div>
          </div>

          {/* Autocomplete Search Bar - Swiggy Style */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Mandi, Biryani, Shawarma, Burgers..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (customerTab !== 'menu' && e.target.value.trim().length > 2) {
                    setCustomerTab('menu');
                  }
                }}
                className="w-full bg-secondary/90 text-sm text-white placeholder-gray-400 rounded-2xl pl-10 pr-9 py-2.5 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-secondary/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
                  Matching Dishes
                </div>
                {searchResults.map(prod => (
                  <div 
                    key={prod.id}
                    onClick={() => {
                      setActiveProductDetail(prod);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-snug">{prod.name}</h4>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">{prod.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-primary">₹{prod.offerPrice || prod.price}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod);
                        }}
                        className="bg-primary hover:bg-primary-hover text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition"
                      >
                        + ADD
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <button
              onClick={() => setCustomerTab('home')}
              className={`transition hover:text-primary ${customerTab === 'home' ? 'text-primary font-bold border-b-2 border-primary py-1' : 'text-gray-300'}`}
            >
              Home
            </button>
            <button
              onClick={() => setCustomerTab('menu')}
              className={`transition hover:text-primary ${customerTab === 'menu' ? 'text-primary font-bold border-b-2 border-primary py-1' : 'text-gray-300'}`}
            >
              Menu
            </button>
            <button
              onClick={() => setCustomerTab('offers')}
              className={`flex items-center gap-1 transition hover:text-primary ${customerTab === 'offers' ? 'text-primary font-bold border-b-2 border-primary py-1' : 'text-gray-300'}`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> Offers
            </button>
            <button
              onClick={() => setCustomerTab('about')}
              className={`transition hover:text-primary ${customerTab === 'about' ? 'text-primary font-bold border-b-2 border-primary py-1' : 'text-gray-300'}`}
            >
              About
            </button>
            <button
              onClick={() => setCustomerTab('contact')}
              className={`transition hover:text-primary ${customerTab === 'contact' ? 'text-primary font-bold border-b-2 border-primary py-1' : 'text-gray-300'}`}
            >
              Contact
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Live Tracking Pill */}
            {activeOrdersCount > 0 && (
              <button
                onClick={() => {
                  const active = orders.find(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
                  if (active) setActiveOrder(active);
                  setCustomerTab('orders');
                }}
                className="flex items-center gap-1.5 bg-primary/20 text-primary border border-primary/50 px-3 py-1.5 rounded-full text-xs font-extrabold animate-pulse"
              >
                <Clock className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Track Order ({activeOrdersCount})</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => setCustomerTab('wishlist')}
              className="relative p-2 text-gray-300 hover:text-primary transition rounded-full hover:bg-secondary/80"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {isLoggedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-light border border-white/10 px-3 py-1.5 rounded-2xl text-xs font-semibold text-white transition"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/30 text-primary flex items-center justify-center font-bold text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{userName}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-secondary/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-2xl p-2 z-[100] space-y-1">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{userName}</p>
                      <span className="text-[10px] text-primary font-bold uppercase">{userRole || 'Customer'}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveOrder(null);
                        setCustomerTab('orders');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-2 font-semibold"
                    >
                      <ShoppingBag className="w-4 h-4 text-primary" /> My Account & Orders
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger/20 rounded-xl transition flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveOrder(null);
                  setCustomerTab('orders');
                }}
                className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-light text-gray-200 border border-white/10 px-3 py-1.5 rounded-2xl text-xs font-semibold transition"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline text-xs">Account</span>
              </button>
            )}

            {/* Cart Button with Total Price */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-glow-sm hover:shadow-glow-primary transition transform hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">
                  <span>{totalCartCount}</span>
                  <span>•</span>
                  <span>₹{cartSubtotal}</span>
                </div>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Mandi, Biryani, Burgers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (customerTab !== 'menu') setCustomerTab('menu');
              }}
              className="w-full bg-secondary/90 text-sm text-white placeholder-gray-400 rounded-xl pl-9 pr-4 py-2 border border-white/10 focus:outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-secondary/95 border border-primary/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-base font-extrabold text-white">Select Delivery Location</h3>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              We currently deliver fresh midnight cravings to Tirunelveli city and nearby areas:
            </p>

            <div className="space-y-2">
              {availableAreas.map((area, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAddress(area);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition ${
                    selectedAddress === area 
                      ? 'bg-primary/10 border-primary text-primary font-bold'
                      : 'bg-darkbg border-white/10 text-gray-300 hover:border-primary/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-primary" /> {area}
                  </span>
                  {selectedAddress === area && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white py-3 rounded-full font-extrabold text-xs shadow-glow-sm"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


// Mobile Bottom Sticky Navigation Bar
export const MobileBottomNav: React.FC = () => {
  const { 
    customerTab, setCustomerTab, 
    cart, setIsCartOpen, 
    orders, isLoggedIn, setIsAuthModalOpen, viewMode 
  } = useStore();

  if (viewMode === 'admin') return null;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-secondary/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => setCustomerTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
          customerTab === 'home' ? 'text-primary font-bold scale-105' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setCustomerTab('menu')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
          customerTab === 'menu' ? 'text-primary font-bold scale-105' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Menu</span>
      </button>

      <button
        onClick={() => setCustomerTab('offers')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
          customerTab === 'offers' ? 'text-primary font-bold scale-105' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="text-[10px]">Offers</span>
      </button>

      <button
        onClick={() => setCustomerTab('orders')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
          customerTab === 'orders' ? 'text-primary font-bold scale-105' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Clock className="w-5 h-5" />
        <span className="text-[10px]">Orders</span>
        {activeOrdersCount > 0 && (
          <span className="absolute top-0 right-2 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
            {activeOrdersCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-400 hover:text-gray-200 transition"
      >
        <ShoppingBag className="w-5 h-5 text-primary" />
        <span className="text-[10px]">Cart</span>
        {totalCartCount > 0 && (
          <span className="absolute top-0 right-2 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {totalCartCount}
          </span>
        )}
      </button>

      <button
        onClick={() => {
          setActiveOrder(null);
          setCustomerTab('orders');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
          customerTab === 'orders' ? 'text-primary font-bold scale-105' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Account</span>
      </button>
    </nav>
  );
};

