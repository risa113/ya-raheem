import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, X, Plus, Minus, Trash2, Tag, 
  ArrowRight, AlertCircle, Sparkles, Check 
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

  const deliveryCharge = subtotal >= 600 ? 0 : settings.deliveryCharge;
  const tax = Math.round((subtotal * settings.taxPercentage) / 100);
  const grandTotal = Math.max(0, subtotal + deliveryCharge + tax - discount);
  const isBelowMin = subtotal > 0 && subtotal < settings.minOrderAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-darkbg border-l border-white/10 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-secondary">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Your Food Cart</h2>
                <p className="text-[11px] text-gray-400">{cart.length} unique items</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="text-4xl">🛒</div>
                <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Looks like you haven't added any midnight delicacies yet. Explore our Mandi and Biryani menu!
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-xs text-gray-400 pb-2 border-b border-white/5">
                  <span>Selected Dishes</span>
                  <button onClick={clearCart} className="text-danger hover:underline font-semibold">
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = item.product.offerPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="bg-secondary/80 border border-white/5 p-3 rounded-2xl flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
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
                            <span className="text-xs font-extrabold text-primary">₹{price * item.quantity}</span>
                            
                            <div className="flex items-center bg-darkbg border border-white/10 rounded-full px-1.5 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary transition text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition text-xs"
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
                <div className="bg-secondary/50 border border-white/10 p-3 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-primary" /> Apply Promo Code
                    </span>
                    <span className="text-[10px] text-primary">Codes: MIDNIGHT100, NIGHTOWL</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/40 px-3 py-2 rounded-xl text-xs text-primary font-bold">
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4" /> Code '{appliedCoupon.code}' Applied!
                      </span>
                      <button onClick={removeCoupon} className="text-xs text-gray-400 hover:text-white underline">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-darkbg text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-primary focus:outline-none uppercase"
                      />
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMsg && (
                    <p className={`text-[11px] font-semibold ${couponMsg.success ? 'text-success' : 'text-danger'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Breakdown & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-secondary/90 space-y-3">
              
              {/* Delivery Timing Warning */}
              {!isRestaurantOpen && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>We are currently closed for kitchen prep. Orders resume at 7:00 PM.</span>
                </div>
              )}

              {/* Minimum Order Warning */}
              {isBelowMin && (
                <div className="bg-danger/10 border border-danger/30 p-2.5 rounded-xl text-xs text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Minimum order value is ₹{settings.minOrderAmount}. Add ₹{settings.minOrderAmount - subtotal} more.</span>
                </div>
              )}

              {/* Price Calculation Table */}
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-success">FREE</strong> : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST & Restaurant Packaging ({settings.taxPercentage}%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-primary text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Proceed Button */}
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
                className={`w-full py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-glow-primary transition transform ${
                  isBelowMin || (!isRestaurantOpen && !settings.allowAnytimeOrdering)
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white hover:scale-[1.02]'
                }`}
              >
                <span>Proceed to Checkout (₹{grandTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
