import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Flame, ShoppingBag, User, Search, Clock, 
  MapPin, Heart, Shield, PhoneCall, Sparkles, LogOut, X, ChevronDown, Check, ArrowRight, Sun, Moon, Bell, Percent
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    themeMode, toggleThemeMode,
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
  const [selectedAddress, setSelectedAddress] = useState<string>('Halal Lab office, Bazar, Melapalayam');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
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
    'Halal Lab office, Bazar, Melapalayam – 627005',
    'High Ground, Palayamkottai, Tirunelveli – 627002',
    'Tirunelveli Town, Near Swami Temple – 627006',
    'Vannarpettai, Tirunelveli – 627003',
    'Perumalpuram, Tirunelveli – 627007',
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#14141E]/95 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-all shadow-ios-sm">
      
      {/* iOS Top Notification Bar */}
      <div className="bg-gradient-to-r from-orange-500/10 via-primary/20 to-orange-500/10 border-b border-primary/15 text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between text-gray-700 dark:text-gray-300 font-medium overflow-hidden gap-2">
        <div className="flex items-center gap-2 shrink min-w-0">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRestaurantOpen ? 'bg-emerald-500' : 'bg-red-500'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isRestaurantOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="font-bold tracking-wide truncate max-w-[130px] xs:max-w-[190px] sm:max-w-none text-gray-900 dark:text-white">
            {isRestaurantOpen ? '🟢 Kitchen LIVE • Express Hot Food Delivery!' : '🌙 Kitchen Opens 7:00 PM – 2:00 AM'}
          </span>
        </div>

        {/* Location & Theme Picker Header Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Light Mode / Dark Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className="flex items-center gap-1.5 transition text-[10px] sm:text-xs font-black bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-0.5 rounded-full border border-primary/30 shrink-0"
            title="Toggle Light or Dark Mode"
          >
            {themeMode === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-black text-primary hidden sm:inline">Light Mode ☀️</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-black text-primary hidden sm:inline">Dark Mode 🌙</span>
              </>
            )}
          </button>

          {/* Location Trigger Pill */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-primary transition text-[10px] sm:text-xs font-bold bg-black/5 dark:bg-white/5 hover:bg-black/10 px-2.5 py-0.5 rounded-full border border-black/5 dark:border-white/10 shrink-0"
          >
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[180px]">{selectedAddress.split(',')[0]}</span>
            <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
          </button>

          <a 
            href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
            className="hidden lg:flex items-center gap-1 hover:text-primary transition text-xs font-bold text-gray-700 dark:text-gray-300 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-primary" /> {settings.phone}
          </a>

          {/* Admin Switch */}
          <button
            onClick={() => setViewMode(viewMode === 'customer' ? 'admin' : 'customer')}
            className="hidden sm:flex items-center gap-1 bg-primary/10 hover:bg-primary text-primary hover:text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black transition border border-primary/30 whitespace-nowrap shrink-0"
          >
            <Shield className="w-3 h-3" />
            <span>{viewMode === 'customer' ? 'Admin Portal' : 'Customer View'}</span>
          </button>
        </div>
      </div>

      {/* Main iOS Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* iOS Brand Logo */}
          <div 
            onClick={() => setCustomerTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-ios-orange group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 dark:text-white font-sans">
                  Food<span className="text-primary">.</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] bg-primary/10 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                  iOS UI Kit
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Food Delivery App</p>
            </div>
          </div>

          {/* Location Header Dropdown (Matching UI Kit header "DELIVER TO") */}
          <div 
            onClick={() => setShowLocationModal(true)}
            className="hidden md:flex flex-col cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
              DELIVER TO <ChevronDown className="w-3 h-3 text-primary" />
            </span>
            <span className="text-xs font-extrabold text-gray-900 dark:text-white truncate max-w-[180px]">
              {selectedAddress.split(',')[0]}
            </span>
          </div>

          {/* Autocomplete Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search dishes, restaurants..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (customerTab !== 'menu' && e.target.value.trim().length > 2) {
                    setCustomerTab('menu');
                  }
                }}
                className="w-full bg-secondary-soft dark:bg-secondary text-sm text-gray-900 dark:text-white placeholder-gray-400 rounded-2xl pl-10 pr-9 py-2.5 border border-black/5 dark:border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-secondary border border-primary/30 rounded-2xl shadow-ios-lg p-2 z-50 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Matching Dishes
                </div>
                {searchResults.map(prod => (
                  <div 
                    key={prod.id}
                    onClick={() => {
                      setActiveProductDetail(prod);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-primary/10 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">{prod.name}</h4>
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
                        className="bg-primary hover:bg-primary-hover text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition shadow-sm"
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
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold">
            <button
              onClick={() => setCustomerTab('home')}
              className={`transition hover:text-primary ${customerTab === 'home' ? 'text-primary font-black border-b-2 border-primary py-1' : 'text-gray-600 dark:text-gray-300'}`}
            >
              Home
            </button>
            <button
              onClick={() => setCustomerTab('menu')}
              className={`transition hover:text-primary ${customerTab === 'menu' ? 'text-primary font-black border-b-2 border-primary py-1' : 'text-gray-600 dark:text-gray-300'}`}
            >
              All Categories
            </button>
            <button
              onClick={() => setCustomerTab('catering-tirunelveli')}
              className={`flex items-center gap-1 transition hover:text-primary ${customerTab === 'catering-tirunelveli' ? 'text-primary font-black border-b-2 border-primary py-1' : 'text-gray-600 dark:text-gray-300'}`}
            >
              👑 Catering & Bulk Orders
            </button>
            <button
              onClick={() => setCustomerTab('offers')}
              className={`flex items-center gap-1 transition hover:text-primary ${customerTab === 'offers' ? 'text-primary font-black border-b-2 border-primary py-1' : 'text-gray-600 dark:text-gray-300'}`}
            >
              <Percent className="w-4 h-4 text-primary" /> Offers
            </button>
            <button
              onClick={() => setCustomerTab('about')}
              className={`transition hover:text-primary ${customerTab === 'about' ? 'text-primary font-black border-b-2 border-primary py-1' : 'text-gray-600 dark:text-gray-300'}`}
            >
              About Us
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Notification Bell Badge */}
            <button
              onClick={() => setCustomerTab('offers')}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition rounded-full hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
              title="Notifications & Offers"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-ios-orange">
                2
              </span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setCustomerTab('wishlist')}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition rounded-full hover:bg-black/5 dark:hover:bg-white/5 shrink-0"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            {isLoggedIn ? (
              <div className="relative shrink-0" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 bg-secondary-soft dark:bg-secondary border border-black/5 dark:border-white/10 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl text-xs font-extrabold text-gray-900 dark:text-white transition"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs shadow-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{userName}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-secondary border border-primary/30 rounded-2xl shadow-ios-lg p-2 z-[100] space-y-1">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-white/10">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{userName}</p>
                      <span className="text-[10px] text-primary font-bold uppercase">{userRole || 'Customer'}</span>
                    </div>

                    <button
                      onClick={() => {
                        setCustomerTab('account');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-primary/10 rounded-xl transition flex items-center gap-2 font-bold"
                    >
                      <User className="w-4 h-4 text-primary" /> My Account & Profile
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger/10 rounded-xl transition flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1 bg-secondary-soft dark:bg-secondary hover:bg-primary/10 text-gray-800 dark:text-gray-200 border border-black/5 dark:border-white/10 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl text-xs font-bold transition shrink-0"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline text-xs">Log In</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-ios-orange hover:scale-105 transition transform shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="hidden xs:inline">Cart</span>
              {totalCartCount > 0 && (
                <div className="flex items-center gap-1 bg-white text-primary px-2 py-0.5 rounded-full text-[10px] font-black">
                  <span>{totalCartCount}</span>
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
              placeholder="Search dishes, restaurants..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (customerTab !== 'menu') setCustomerTab('menu');
              }}
              className="w-full bg-secondary-soft dark:bg-secondary text-sm text-gray-900 dark:text-white placeholder-gray-400 rounded-xl pl-9 pr-4 py-2 border border-black/5 dark:border-white/10 focus:outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-secondary border border-black/10 dark:border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-ios-lg">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">Deliver To</h3>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select your delivery location or address:
            </p>

            <div className="space-y-2">
              {availableAreas.map((area, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAddress(area);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition ${
                    selectedAddress === area 
                      ? 'bg-primary/10 border-primary text-primary font-black'
                      : 'bg-secondary-soft dark:bg-darkbg border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-primary'
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
              className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white py-3 rounded-full font-black text-xs shadow-ios-orange"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


// Mobile Bottom Navigation Bar matching iOS UI Kit style
export const MobileBottomNav: React.FC = () => {
  const { 
    customerTab, setCustomerTab, 
    cart, setIsCartOpen, 
    orders, viewMode 
  } = useStore();

  if (viewMode === 'admin') return null;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-secondary/95 backdrop-blur-xl border-t border-black/5 dark:border-white/10 px-2 py-1.5 pb-safe flex items-center justify-around shadow-ios-lg select-none">
      <button
        onClick={() => setCustomerTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition active:scale-95 ${
          customerTab === 'home' ? 'text-primary font-black scale-105' : 'text-gray-400'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setCustomerTab('menu')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition active:scale-95 ${
          customerTab === 'menu' ? 'text-primary font-black scale-105' : 'text-gray-400'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Menu</span>
      </button>

      <button
        onClick={() => setCustomerTab('offers')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition active:scale-95 ${
          customerTab === 'offers' ? 'text-primary font-black scale-105' : 'text-gray-400'
        }`}
      >
        <Percent className="w-5 h-5 text-primary" />
        <span className="text-[10px]">Offers</span>
      </button>

      <button
        onClick={() => setCustomerTab('orders')}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition active:scale-95 ${
          customerTab === 'orders' ? 'text-primary font-black scale-105' : 'text-gray-400'
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
        className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-gray-400 transition active:scale-95"
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
        onClick={() => setCustomerTab('account')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition active:scale-95 ${
          customerTab === 'account' ? 'text-primary font-black scale-105' : 'text-gray-400'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Account</span>
      </button>
    </nav>
  );
};
