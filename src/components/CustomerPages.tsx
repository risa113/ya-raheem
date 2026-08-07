import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPicker } from './MapPicker';
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

// Customer Orders & Profile Page with Logout Option
export const CustomerOrdersPage: React.FC = () => {
  const { 
    orders, setActiveOrder, setCustomerTab, addToCart, 
    isLoggedIn, userName, userPhone, userEmail, userRole, logoutUser, setIsAuthModalOpen 
  } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      {/* Account Details & User Info Profile Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl space-y-4 shadow-2xl border border-primary/30">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 text-white flex items-center justify-center font-extrabold text-xl sm:text-3xl shadow-glow-sm">
              {userName ? userName.charAt(0).toUpperCase() : '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-extrabold text-white">{userName || 'Guest Customer'}</h2>
                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded font-bold uppercase">
                  {userRole || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                📞 {userPhone || '+91 90801 39363'} {userEmail ? `• ✉️ ${userEmail}` : ''}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">📍 Default Location: Melapalayam, Tirunelveli</p>
            </div>
          </div>

          {/* Account Login / Logout Action Buttons */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={logoutUser}
                className="flex items-center gap-1.5 bg-danger/20 hover:bg-danger text-danger hover:text-white border border-danger/40 px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Log Out Account
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-glow-sm"
                >
                  <Key className="w-4 h-4" /> Sign In / Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Account Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 text-center text-xs">
          <div className="bg-secondary/70 p-2.5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Orders</span>
            <span className="text-sm sm:text-base font-extrabold text-white">{orders.length}</span>
          </div>
          <div className="bg-secondary/70 p-2.5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Account Status</span>
            <span className={`text-xs sm:text-sm font-extrabold ${isLoggedIn ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isLoggedIn ? '🟢 Verified' : '🟡 Guest'}
            </span>
          </div>
          <div className="bg-secondary/70 p-2.5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">Zone</span>
            <span className="text-xs sm:text-sm font-extrabold text-primary">Melapalayam</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" /> My Order History
        </h3>

        {orders.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-3 rounded-2xl">
            <div className="text-4xl">📜</div>
            <h4 className="text-base font-bold text-white">No Orders Placed Yet</h4>
            <p className="text-xs text-gray-400">Order Mandi or Biryani now to see your order history here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="glass-card p-5 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs text-primary font-bold">Order #{ord.orderNumber}</span>
                    <span className="text-[11px] text-gray-400 ml-3">{ord.orderTime}</span>
                  </div>
                  <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase">
                    {ord.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  {ord.items.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.quantity}x {it.product.name}</span>
                      <span className="font-bold text-white">₹{(it.product.offerPrice || it.product.price) * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 gap-2">
                  <span className="text-sm font-extrabold text-white">Grand Total: ₹{ord.grandTotal}</span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        ord.items.forEach(it => addToCart(it.product, it.quantity));
                      }}
                      className="bg-secondary border border-white/10 hover:border-primary text-gray-200 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-primary" /> Order Again
                    </button>

                    <button
                      onClick={() => {
                        setActiveOrder(ord);
                        setCustomerTab('orders');
                      }}
                      className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-glow-sm"
                    >
                      Track Live
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
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

// Offers Page
export const OffersPage: React.FC = () => {
  const { coupons, setCustomerTab } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full border border-amber-500/40">
          ✨ MIDNIGHT DEALS
        </span>
        <h2 className="text-3xl font-extrabold text-white">Midnight Coupons & Offers</h2>
        <p className="text-gray-400 text-xs">Apply promo codes at checkout to save on your orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coupons.map(c => (
          <div key={c.id} className="glass-card p-5 rounded-2xl border-l-4 border-l-primary space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-lg font-black text-white tracking-widest bg-primary/20 text-primary border border-primary/40 px-3 py-1 rounded-lg inline-block">
                  {c.code}
                </span>
                <p className="text-xs font-bold text-gray-200 mt-2">
                  {c.discountType === 'fixed' ? `Flat ₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            <p className="text-[11px] text-gray-400">
              Valid on orders above ₹{c.minOrderAmount}. Expires {c.expiryDate}.
            </p>

            <button
              onClick={() => setCustomerTab('menu')}
              className="text-xs font-bold text-primary hover:underline block"
            >
              Use Code Now →
            </button>
          </div>
        ))}
      </div>
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
          <p className="text-xs text-gray-400">Slow-cooked Yemeni mandi with charred spiced meats and ghee basmati.</p>
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
