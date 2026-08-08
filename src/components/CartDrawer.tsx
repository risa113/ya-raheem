import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, X, Plus, Minus, Trash2, Tag, 
  ArrowRight, AlertCircle, Sparkles, Check, Truck, HeartHandshake 
} from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { 
    cart, removeFromCart, updateQuantity, clearCart,
    isCartOpen, setIsCartOpen,
    appliedCoupon, applyCoupon, removeCoupon,
    settings, isRestaurantOpen,
    isLoggedIn, setIsAuthModalOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState<string>('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [selectedTip, setSelectedTip] = useState<number>(20);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.offerPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountValue;
    } else {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
  }

  const freeDeliveryThreshold = 600;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const amountNeededForFreeDelivery = freeDeliveryThreshold - subtotal;
  const deliveryCharge = isFreeDelivery ? 0 : settings.deliveryCharge;

  const tax = Math.round((subtotal * settings.taxPercentage) / 100);
  const grandTotal = Math.max(0, subtotal + deliveryCharge + tax + selectedTip - discount);
  const isBelowMin = subtotal > 0 && subtotal < settings.minOrderAmount;

  const quickCoupons = [
    { code: 'MIDNIGHT100', text: '₹100 OFF on orders > ₹399' },
    { code: 'NIGHTOWL', text: '20% OFF on orders > ₹500' },
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const handleQuickApply = (code: string) => {
    const res = applyCoupon(code);
    setCouponMsg({ success: res.success, text: res.message });
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black/75 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-darkbg border-l border-white/10 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-secondary">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-glow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Your Swiggy Food Cart</h2>
                <p className="text-[11px] text-gray-400 font-semibold">{cart.length} item types selected</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Swiggy Style Free Delivery Progress Bar */}
          {cart.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-950/60 to-secondary p-3 border-b border-emerald-500/30 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400 font-extrabold">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> 
                  {isFreeDelivery ? '🎉 Congratulations! FREE Delivery Unlocked!' : `Add ₹${amountNeededForFreeDelivery} more for FREE Delivery!`}
                </span>
                <span>₹{subtotal} / ₹{freeDeliveryThreshold}</span>
              </div>
              <div className="w-full bg-darkbg/80 h-2 rounded-full overflow-hidden border border-emerald-500/20">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="text-5xl">🛒</div>
                <h3 className="text-lg font-extrabold text-white">Your cart is empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Explore our Arabian Mandi and spicy Biryani menu to satisfy your midnight hunger!
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-xs text-gray-400 pb-2 border-b border-white/5 font-semibold">
                  <span>Selected Dishes</span>
                  <button onClick={clearCart} className="text-danger hover:underline font-extrabold">
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = item.product.offerPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="bg-secondary/90 border border-white/10 p-3 rounded-2xl flex gap-3 shadow-md">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-extrabold text-white truncate">{item.product.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-500 hover:text-danger p-0.5 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {item.notes && (
                            <p className="text-[10px] text-amber-400 italic truncate">Note: {item.notes}</p>
                          )}

                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs font-black text-primary">₹{price * item.quantity}</span>
                            
                            <div className="flex items-center bg-darkbg border border-white/10 rounded-xl px-1.5 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-5 h-5 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-primary transition text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-black text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-5 h-5 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code Section */}
                <div className="bg-secondary/80 border border-white/10 p-3.5 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-black text-white">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-primary" /> Apply Promo Code
                    </span>
                  </div>

                  {/* One-Click Available Coupons */}
                  <div className="space-y-1.5">
                    {quickCoupons.map((c) => (
                      <div 
                        key={c.code} 
                        className="flex items-center justify-between bg-darkbg/80 p-2 rounded-xl border border-white/10 text-xs"
                      >
                        <div>
                          <p className="font-black text-primary">{c.code}</p>
                          <p className="text-[10px] text-gray-400">{c.text}</p>
                        </div>
                        <button
                          onClick={() => handleQuickApply(c.code)}
                          className="bg-primary/20 hover:bg-primary text-primary hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-black transition"
                        >
                          APPLY
                        </button>
                      </div>
                    ))}
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/40 px-3 py-2 rounded-xl text-xs text-emerald-400 font-extrabold">
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4" /> Code '{appliedCoupon.code}' Applied!
                      </span>
                      <button onClick={removeCoupon} className="text-xs text-gray-400 hover:text-white underline">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Or enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-darkbg text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-primary focus:outline-none uppercase font-bold"
                      />
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMsg && (
                    <p className={`text-[11px] font-bold ${couponMsg.success ? 'text-emerald-400' : 'text-danger'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Delivery Partner Tip Option */}
                <div className="bg-secondary/80 border border-white/10 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-white">
                    <span className="flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-emerald-400" /> Tip Your Delivery Hero
                    </span>
                    <span className="text-[10px] text-gray-400">100% goes to driver</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 20, 30, 50].map(tip => (
                      <button
                        key={tip}
                        onClick={() => setSelectedTip(tip)}
                        className={`flex-1 py-1.5 rounded-xl border text-xs font-extrabold transition ${
                          selectedTip === tip
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-darkbg border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {tip === 0 ? 'None' : `₹${tip}`}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Price Summary & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-secondary/95 space-y-3 shadow-2xl">
              
              {!isRestaurantOpen && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Kitchen opens at 7:00 PM. Pre-orders allowed.</span>
                </div>
              )}

              {isBelowMin && (
                <div className="bg-danger/10 border border-danger/30 p-2.5 rounded-xl text-xs text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Minimum order is ₹{settings.minOrderAmount}. Add ₹{settings.minOrderAmount - subtotal} more.</span>
                </div>
              )}

              {/* Bill Details Table */}
              <div className="space-y-1.5 text-xs text-gray-300 font-medium">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-bold text-white">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-400 font-extrabold">FREE</strong> : `₹${deliveryCharge}`}</span>
                </div>
                {selectedTip > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Delivery Tip</span>
                    <span>₹{selectedTip}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>GST & Packaging ({settings.taxPercentage}%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                  <span>To Pay</span>
                  <span className="text-primary text-xl font-black">₹{grandTotal}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                disabled={isBelowMin || (!isRestaurantOpen && !settings.allowAnytimeOrdering)}
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsCartOpen(false);
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className={`w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-glow-primary transition transform ${
                  isBelowMin || (!isRestaurantOpen && !settings.allowAnytimeOrdering)
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white hover:scale-[1.02]'
                }`}
              >
                <span>Proceed to Checkout (₹{grandTotal})</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

