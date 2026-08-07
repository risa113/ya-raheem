import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Flame, ShoppingBag, User, Search, Clock, 
  MapPin, Heart, Shield, PhoneCall, Sparkles, LogOut 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    viewMode, setViewMode, 
    customerTab, setCustomerTab, 
    cart, setIsCartOpen, 
    searchQuery, setSearchQuery, 
    wishlist, 
    isLoggedIn, userName, userRole, logoutUser, setIsAuthModalOpen,
    isRestaurantOpen, settings, orders, setActiveOrder
  } = useStore();

  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <header className="sticky top-0 z-50 bg-darkbg/95 backdrop-blur-md border-b border-white/10 transition-all">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary to-primary/20 border-b border-primary/30 text-[11px] sm:text-xs py-1.5 px-2.5 sm:px-4 text-center flex items-center justify-between text-gray-300 font-medium">
        <div className="hidden md:flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRestaurantOpen ? 'bg-success' : 'bg-danger'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isRestaurantOpen ? 'bg-success' : 'bg-danger'}`}></span>
          </span>
          <span className="text-white font-semibold">
            {isRestaurantOpen ? '🟢 Kitchen LIVE - Delivering Now!' : '🌙 Opens Daily 7:00 PM – 2:00 AM (Booking Open)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4 mx-0">
          <span className="flex items-center gap-1 text-primary-light truncate max-w-[200px] sm:max-w-none text-[10px] sm:text-xs">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary shrink-0" />
            <span className="truncate">Melapalayam, Tirunelveli</span>
          </span>
          <a 
            href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
            className="hidden md:flex items-center gap-1 hover:text-white transition text-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-primary" /> {settings.phone}
          </a>
        </div>

        {/* View Mode Toggle (Customer vs Admin Mode) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setViewMode(viewMode === 'customer' ? 'admin' : 'customer')}
            className="flex items-center gap-1 bg-primary/20 hover:bg-primary text-primary hover:text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition border border-primary/40 whitespace-nowrap"
          >
            <Shield className="w-3 h-3" />
            <span>{viewMode === 'customer' ? 'Admin Portal' : 'Customer'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setCustomerTab('home')}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white font-sans">
                  MIDNIGHT<span className="text-primary">FUEL</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  NIGHTS
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-gray-400 font-medium tracking-wide">Fresh • Hot • Fast | 7 PM - 2 AM</p>
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Mandi, Biryani, Shawarma, Burgers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (customerTab !== 'menu') setCustomerTab('menu');
                }}
                className="w-full bg-secondary/80 text-sm text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-2 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
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
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Offers
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

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Active Order Tracker Button */}
            {activeOrdersCount > 0 && (
              <button
                onClick={() => {
                  const active = orders.find(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
                  if (active) setActiveOrder(active);
                  setCustomerTab('orders');
                }}
                className="hidden sm:flex items-center gap-1.5 bg-secondary hover:bg-secondary-light text-primary border border-primary/30 px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse"
              >
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Tracking ({activeOrdersCount})</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={() => setCustomerTab('wishlist')}
              className="relative p-1.5 sm:p-2 text-gray-300 hover:text-primary transition rounded-full hover:bg-secondary/60"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Profile / Login & Logout Dropdown */}
            {isLoggedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-light border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-white transition"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/30 text-primary flex items-center justify-center font-bold text-[10px] sm:text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{userName}</span>
                </button>

                {/* Profile Popup Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-secondary/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-2xl p-2.5 z-[100] space-y-1">
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
                      <ShoppingBag className="w-3.5 h-3.5 text-primary" /> My Account & Orders
                    </button>

                    <button
                      onClick={() => {
                        logoutUser();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger/20 rounded-xl transition flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
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
                className="flex items-center gap-1 bg-secondary hover:bg-secondary-light text-gray-200 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-[11px] sm:text-xs">Account</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold flex items-center gap-1 sm:gap-2 shadow-glow-sm hover:shadow-glow-primary transition transform hover:scale-105"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-white text-primary font-black px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px]">
                  {totalCartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar Row */}
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
              className="w-full bg-secondary/90 text-sm text-white placeholder-gray-400 rounded-full pl-9 pr-4 py-2 border border-white/10 focus:outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
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

