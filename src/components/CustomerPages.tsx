import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPicker } from './MapPicker';
import { LiveOrderTracker } from './LiveOrderTracker';
import { apiLogin, apiRegister, apiResetPassword } from '../services/api';
import { 
  PhoneCall, MessageCircle, MapPin, Clock, 
  Sparkles, Heart, RefreshCw, ShoppingBag, 
  User, CheckCircle2, Star, ShieldCheck, Flame, LogOut, Key, Mail, Lock, Check, AlertCircle, ArrowLeft 
} from 'lucide-react';

// Enhanced Clean Password Auth Modal (Username / Phone / Email + Password Login, Signup & Change Password)
export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser } = useStore();
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Login / Signup state
  const [identifier, setIdentifier] = useState<string>(''); // Username / Phone / Email
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier || !password) {
      setErrorMsg('Please enter your Username/Phone/Email and Password');
      return;
    }

    setLoading(true);
    const res = await apiLogin(identifier, password);
    setLoading(false);

    if (res.success) {
      loginUser(res.user.phone || identifier, res.user.fullName || identifier, res.user.role, res.user.email);
    } else {
      setErrorMsg(res.message || 'Invalid credentials');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !phone || !password) {
      setErrorMsg('Please enter your Full Name, Mobile Phone, and Password');
      return;
    }

    setLoading(true);
    const res = await apiRegister(name, phone, email, password);
    setLoading(false);

    if (res.success) {
      loginUser(res.user.phone, res.user.fullName, res.user.role, res.user.email);
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier || !newPassword) {
      setErrorMsg('Please enter your Phone/Email and New Password');
      return;
    }

    setLoading(true);
    const res = await apiResetPassword(identifier, newPassword);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setView('login');
        setPassword(newPassword);
        setSuccessMsg('');
      }, 2000);
    } else {
      setErrorMsg(res.message || 'Could not reset password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-darkbg border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-glow-sm">
            🔥
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {view === 'login' ? 'Login to Midnight Fuel' : view === 'signup' ? 'Create New Account' : 'Change / Reset Password'}
          </h3>
          <p className="text-xs text-gray-400">Save delivery addresses, earn rewards & track live orders</p>
        </div>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger/40 text-danger p-3 rounded-xl text-xs font-bold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1">
            <Check className="w-4 h-4 text-emerald-400" /> {successMsg}
          </div>
        )}

        {/* View 1: Sign In */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Username / Phone / Email *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 9080139363 or mohamed@gmail.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-secondary text-sm text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-300">Password *</label>
                <button
                  type="button"
                  onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary text-sm text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl text-sm transition shadow-glow-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating with MongoDB...' : 'Sign In to Account'}
            </button>

            <div className="text-center pt-2 border-t border-white/10">
              <span className="text-xs text-gray-400">Don't have an account? </span>
              <button
                type="button"
                onClick={() => { setView('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Sign Up Now
              </button>
            </div>
          </form>
        )}

        {/* View 2: Sign Up / Register */}
        {view === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mohamed Aslam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Mobile Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9080139363"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-secondary text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="e.g. user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Create Password *</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl text-sm transition shadow-glow-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Register & Create Account'}
            </button>

            <div className="text-center pt-2 border-t border-white/10">
              <span className="text-xs text-gray-400">Already registered? </span>
              <button
                type="button"
                onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* View 3: Change / Reset Password */}
        {view === 'forgot' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Your Mobile Phone or Email *</label>
              <input
                type="text"
                required
                placeholder="e.g. 9080139363 or user@gmail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-secondary text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Enter New Password *</label>
              <input
                type="password"
                required
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-secondary text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-success hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition shadow-glow-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Updating Password...' : 'Update & Reset Password'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs text-gray-400 hover:text-white underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

// Customer Orders Page with Ongoing vs History Tabs matching Phase 2 UI Kit
export const CustomerOrdersPage: React.FC = () => {
  const { 
    orders, activeOrder, setActiveOrder, setCustomerTab, addToCart, 
    isLoggedIn, userName, userPhone, userEmail, userRole, logoutUser, setIsAuthModalOpen 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');

  const ongoingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const historyOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');
  const displayedOrders = activeTab === 'ongoing' ? ongoingOrders : historyOrders;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">My Orders</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Track active orders & view order history</p>
        </div>

        <button
          onClick={() => setCustomerTab('menu')}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full text-xs font-black shadow-ios-orange transition"
        >
          + New Order
        </button>
      </div>

      {/* Ongoing vs History Tab Switcher matching Phase 2 UI Kit Image 2 & 5 */}
      <div className="flex bg-secondary-soft dark:bg-secondary border border-black/5 dark:border-white/10 p-1.5 rounded-full text-xs font-black text-gray-600 dark:text-gray-300">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 py-2.5 rounded-full transition ${
            activeTab === 'ongoing'
              ? 'bg-primary text-white shadow-ios-orange'
              : 'hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Ongoing ({ongoingOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-full transition ${
            activeTab === 'history'
              ? 'bg-primary text-white shadow-ios-orange'
              : 'hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          History ({historyOrders.length})
        </button>
      </div>

      {/* Embedded Live Order Tracker View if active order selected */}
      {activeOrder && (
        <div className="bg-white dark:bg-secondary p-4 sm:p-6 rounded-3xl space-y-4 border border-emerald-500/40 shadow-ios-card">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
            <h3 className="text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-pulse" /> Live Active Order (#{activeOrder.orderNumber})
            </h3>
            <button
              onClick={() => setActiveOrder(null)}
              className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold"
            >
              Close ✕
            </button>
          </div>
          <LiveOrderTracker />
        </div>
      )}

      {/* Orders List matching Phase 2 UI Kit Image 2 & 5 */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white dark:bg-secondary p-12 text-center space-y-3 rounded-3xl border border-black/5 dark:border-white/10 shadow-ios-card">
          <div className="text-5xl">📦</div>
          <h4 className="text-base font-black text-gray-900 dark:text-white">No {activeTab} orders found</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Order delicious meals from our menu now!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((ord) => (
            <div key={ord.id} className="bg-white dark:bg-secondary p-5 rounded-3xl space-y-4 border border-black/5 dark:border-white/10 shadow-ios-card">
              
              {/* Card Top Row */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={ord.items[0]?.product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"}
                    alt="Order Food"
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white">Uttora Coffee House / Bistro</h4>
                    <span className="text-[10px] text-gray-400 font-mono">#{ord.orderNumber} • {ord.orderTime}</span>
                  </div>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                  ord.status === 'Delivered'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : ord.status === 'Cancelled'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {ord.status}
                </span>
              </div>

              {/* Items Summary */}
              <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300 font-semibold">
                {ord.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantity}x {it.product.name}</span>
                    <span className="font-black text-gray-900 dark:text-white">₹{(it.product.offerPrice || it.product.price) * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons matching Phase 2 UI Kit */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5 gap-2 flex-wrap">
                <span className="text-base font-black text-primary">₹{ord.grandTotal}</span>
                
                <div className="flex items-center gap-2">
                  {ord.status !== 'Delivered' && ord.status !== 'Cancelled' ? (
                    <button
                      onClick={() => setActiveOrder(ord)}
                      className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-black shadow-ios-orange transition"
                    >
                      Track Order
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        ord.items.forEach(it => addToCart(it.product, it.quantity));
                        setCustomerTab('menu');
                      }}
                      className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-black shadow-ios-orange transition"
                    >
                      Re-Order
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// Wishlist Page
export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist, setCustomerTab } = useStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" /> Your Wishlist Favorites
        </h2>
        <span className="text-xs text-gray-400">{wishlistedProducts.length} items saved</span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3 rounded-2xl">
          <div className="text-4xl">❤️</div>
          <h3 className="text-base font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-400">Save dishes you love by tapping the heart icon on any food item!</p>
          <button
            onClick={() => setCustomerTab('menu')}
            className="bg-primary text-white font-bold px-6 py-2 rounded-full text-xs"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlistedProducts.map(p => (
            <div key={p.id} className="glass-card p-4 rounded-2xl flex gap-3">
              <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                  <span className="text-xs text-primary font-bold">₹{p.offerPrice || p.price}</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex-1"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="text-xs text-gray-400 hover:text-danger px-2 py-1.5 rounded-lg border border-white/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Offers Page (Disabled)
export const OffersPage: React.FC = () => {
  const { setCustomerTab } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
      <div className="text-4xl">🍽️</div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">Explore Our Delicious Menu</h2>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-medium max-w-sm mx-auto">
        All our dishes are prepared fresh with authentic ingredients. Order online now!
      </p>
      <button
        onClick={() => setCustomerTab('menu')}
        className="bg-primary hover:bg-primary-hover text-white font-black px-6 py-3 rounded-2xl text-xs uppercase shadow-ios-orange transition"
      >
        View Full Menu →
      </button>
    </div>
  );
};

// Contact Page
export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const rawPhone = settings.phone.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">Contact & Location</h2>
        <p className="text-gray-400 text-xs">Serving Tirunelveli Midnight Cravings Daily</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                📍
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400">RESTAURANT ADDRESS</h4>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  Bazar, Near Meera Broilers,<br />Melapalayam, Tirunelveli – 627005
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                📞
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400">PHONE & WHATSAPP</h4>
                <p className="text-sm font-extrabold text-white mt-0.5">{settings.phone}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ⏰
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400">OPERATIONAL TIMINGS</h4>
                <p className="text-xs font-semibold text-white mt-0.5">
                  📞 Order Booking: <strong>7:00 AM – 2:00 AM</strong>
                </p>
                <p className="text-xs font-semibold text-primary mt-1">
                  🍗 Hot Food Available: <strong>7:00 PM – 2:00 AM</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${rawPhone}`}
              className="bg-secondary hover:bg-secondary-light text-emerald-400 font-bold p-3 rounded-2xl border border-emerald-500/40 text-xs flex items-center justify-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4" /> Call Now
            </a>

            <a
              href={`https://wa.me/${rawPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Interactive Melapalayam Map</h3>
          <MapPicker
            mode="picker"
            initialLat={8.7075}
            initialLng={77.7280}
            height="340px"
          />
        </div>

      </div>
    </div>
  );
};

// About Page
export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs bg-primary/20 text-primary font-bold px-3 py-1 rounded-full border border-primary/40">
          OUR STORY
        </span>
        <h2 className="text-3xl font-extrabold text-white">About Midnight Fuel</h2>
        <p className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed">
          Midnight Fuel was born out of a single passionate mission: serving Tirunelveli with hot, fresh, halal food when every other restaurant is closed!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl text-center space-y-2">
          <div className="text-3xl">🍗</div>
          <h3 className="text-base font-bold text-white">Authentic Mandi</h3>
          <p className="text-xs text-gray-400">Authentic Yemeni Mandi prepared with aromatic spices and ghee basmati.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl text-center space-y-2">
          <div className="text-3xl">⚡</div>
          <h3 className="text-base font-bold text-white">Fast Night Express</h3>
          <p className="text-xs text-gray-400">Dedicated delivery fleet delivering across Melapalayam & Tirunelveli in ~30 mins.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl text-center space-y-2">
          <div className="text-3xl">🌙</div>
          <h3 className="text-base font-bold text-white">Open Till 2:00 AM</h3>
          <p className="text-xs text-gray-400">Never sleep hungry. Booking lines open from 7 AM, kitchen fires up at 7 PM.</p>
        </div>
      </div>
    </div>
  );
};

// Full User Account & Profile Hub Page
export const AccountPage: React.FC = () => {
  const { 
    isLoggedIn, userName, userPhone, userEmail, userRole, 
    logoutUser, setIsAuthModalOpen, setCustomerTab, setViewMode, orders, wishlist 
  } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Account Profile Header matching Phase 2 UI Kit */}
      <div className="bg-white dark:bg-secondary p-6 rounded-3xl border border-black/5 dark:border-white/10 relative overflow-hidden shadow-ios-card transition-colors">
        
        {isLoggedIn ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-ios-orange">
                {userName ? userName.charAt(0).toUpperCase() : '8'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">{userName || userPhone || 'Customer'}</h2>
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-0.5 rounded-full border border-primary/20 uppercase tracking-wide">
                    {userRole || 'ADMIN'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">📱 {userPhone || '8608724931'}</p>
                {userEmail && <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">✉️ {userEmail}</p>}
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="bg-red-500/10 hover:bg-red-500/20 text-danger border border-red-500/20 px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Welcome to Food App</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Log in or create an account to track orders, save favorite dishes & access member discounts!</p>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary hover:bg-primary-hover text-white font-black px-8 py-3 rounded-2xl text-sm shadow-ios-orange transition inline-flex items-center gap-2 uppercase tracking-wider"
            >
              <User className="w-4 h-4" /> Log In / Sign Up Now
            </button>
          </div>
        )}
      </div>

      {/* Account Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Orders Card */}
        <button
          onClick={() => setCustomerTab('orders')}
          className="bg-white dark:bg-secondary p-5 rounded-3xl text-left border border-black/5 dark:border-white/10 hover:border-primary transition group flex items-center justify-between shadow-ios-card"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition">My Orders</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{orders.length} order history & live tracking</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-primary font-black transition">→</span>
        </button>

        {/* Wishlist Card */}
        <button
          onClick={() => setCustomerTab('wishlist')}
          className="bg-white dark:bg-secondary p-5 rounded-3xl text-left border border-black/5 dark:border-white/10 hover:border-primary transition group flex items-center justify-between shadow-ios-card"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition">Saved Wishlist</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{wishlist.length} saved gourmet dishes</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-primary font-black transition">→</span>
        </button>

        {/* Catering & Bulk Orders */}
        <button
          onClick={() => setCustomerTab('catering-tirunelveli')}
          className="bg-white dark:bg-secondary p-5 rounded-3xl text-left border border-black/5 dark:border-white/10 hover:border-primary transition group flex items-center justify-between shadow-ios-card"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xl">
              👑
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition">Catering & Bulk Orders</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Book Arabian Mandi & Biryani for events</p>
            </div>
          </div>
          <span className="text-gray-400 group-hover:text-primary font-black transition">→</span>
        </button>

        {/* Store Admin Mode Switch */}
        <button
          onClick={() => setViewMode('admin')}
          className="bg-white dark:bg-secondary p-5 rounded-3xl text-left hover:border-primary transition group flex items-center justify-between border border-amber-500/30 shadow-ios-card"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold text-lg shadow-sm">
              👑
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-600 dark:text-amber-400">Kitchen & Admin Portal</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Switch to Store Manager & Orders Dashboard</p>
            </div>
          </div>
          <span className="text-amber-600 dark:text-amber-400 font-black text-xs bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Open ⚙️
          </span>
        </button>
      </div>

      {/* Support & Kitchen Contact */}
      <div className="bg-white dark:bg-secondary p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4 shadow-ios-card">
        <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" /> 24/7 Kitchen Support
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:+919080139363"
            className="bg-secondary-soft dark:bg-darkbg hover:bg-primary/10 border border-black/5 dark:border-white/10 p-3.5 rounded-2xl text-xs font-black text-gray-900 dark:text-white flex items-center justify-center gap-2 transition"
          >
            <PhoneCall className="w-4 h-4 text-primary" /> Call +91 90801 39363
          </a>
          <a
            href="https://wa.me/919080139363?text=Hi%20Food%20App%20Kitchen,%20I%20have%20an%20account%20query"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 p-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
};

// Promotional Hurry Offers Modal Overlay (Disabled)
export const HurryOffersModal: React.FC<{ isOpen: boolean; onClose: () => void }> = () => {
  return null;
};

// Location Access Prompt Modal (Matching Image 5 of UI Kit)
export const LocationAccessModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-secondary max-w-sm w-full rounded-3xl p-8 text-center space-y-6 shadow-ios-lg border border-black/5 dark:border-white/10 relative transition-colors">
        
        {/* Map pin vector artwork */}
        <div className="w-32 h-32 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center relative">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-ios-orange animate-pulse">
            <MapPin className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
            LOCATION ACCESS
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
            FOOD APP WILL ACCESS YOUR LOCATION ONLY WHILE USING THE APP TO DELIVER HOT MEALS TO YOUR DOORSTEP.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white font-black py-3.5 rounded-full text-xs shadow-ios-orange transition transform active:scale-95 uppercase tracking-wider"
        >
          ACCESS LOCATION
        </button>

        <button
          onClick={onClose}
          className="text-xs text-gray-400 font-bold hover:underline block mx-auto"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

