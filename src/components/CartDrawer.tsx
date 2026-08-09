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
    { code: '#1243CD2', text: '25% OFF on orders > ₹299' },
    { code: 'MIDNIGHT100', text: '₹100 OFF on orders > ₹399' },
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
        <div className="w-screen max-w-md bg-white dark:bg-darkbg border-l border-black/5 dark:border-white/10 flex flex-col shadow-ios-lg transition-colors">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-secondary">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-ios-orange">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900 dark:text-white">Your Cart</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">{cart.length} items selected</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Bar */}
          {cart.length > 0 && (
            <div className="bg-emerald-500/10 p-3 border-b border-emerald-500/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-black">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> 
                  {isFreeDelivery ? '🎉 FREE Delivery Unlocked!' : `Add ₹${amountNeededForFreeDelivery} more for FREE Delivery!`}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-darkbg h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
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
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Your cart is empty</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto font-medium">
                  Explore our menu to satisfy your hunger cravings!
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-xs text-gray-400 pb-2 border-b border-gray-100 dark:border-white/5 font-bold">
                  <span>Selected Items</span>
                  <button onClick={clearCart} className="text-danger hover:underline font-black">
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = item.product.offerPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="bg-secondary-soft dark:bg-secondary border border-black/5 dark:border-white/10 p-3 rounded-2xl flex gap-3 shadow-sm">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">{item.product.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-danger p-0.5 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {item.notes && (
                            <p className="text-[10px] text-primary italic truncate font-bold">Note: {item.notes}</p>
                          )}

                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs font-black text-primary">₹{price * item.quantity}</span>
                            
                            <div className="flex items-center bg-white dark:bg-darkbg border border-black/5 dark:border-white/10 rounded-full px-2 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-5 h-5 rounded-full bg-gray-100 dark:bg-secondary text-gray-900 dark:text-white flex items-center justify-center text-xs font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-black text-gray-900 dark:text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-ios-orange"
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
                <div className="bg-secondary-soft dark:bg-secondary border border-black/5 dark:border-white/10 p-3.5 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-black text-gray-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-primary" /> Apply Promo Coupon
                    </span>
                  </div>

                  {/* Quick Apply Coupons */}
                  <div className="space-y-1.5">
                    {quickCoupons.map((c) => (
                      <div 
                        key={c.code} 
                        className="flex items-center justify-between bg-white dark:bg-darkbg p-2 rounded-xl border border-black/5 dark:border-white/10 text-xs"
                      >
                        <div>
                          <p className="font-black text-primary">{c.code}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{c.text}</p>
                        </div>
                        <button
                          onClick={() => handleQuickApply(c.code)}
                          className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-black transition"
                        >
                          APPLY
                        </button>
                      </div>
                    ))}
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-black">
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4" /> Coupon '{appliedCoupon.code}' Applied!
                      </span>
                      <button onClick={removeCoupon} className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline">
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
                        className="flex-1 bg-white dark:bg-darkbg text-xs text-gray-900 dark:text-white px-3 py-2 rounded-xl border border-black/5 dark:border-white/10 focus:border-primary focus:outline-none uppercase font-bold"
                      />
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow-ios-orange"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMsg && (
                    <p className={`text-[11px] font-bold ${couponMsg.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-danger'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Delivery Tip Option */}
                <div className="bg-secondary-soft dark:bg-secondary border border-black/5 dark:border-white/10 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-gray-900 dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-emerald-500" /> Tip Delivery Hero
                    </span>
                    <span className="text-[10px] text-gray-400">100% goes to driver</span>
                  </div>

                  <div className="flex gap-2">
                    {[0, 20, 30, 50].map((tip) => (
                      <button
                        key={tip}
                        type="button"
                        onClick={() => setSelectedTip(tip)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-black border transition ${
                          selectedTip === tip
                            ? 'bg-primary text-white border-primary shadow-ios-orange'
                            : 'bg-white dark:bg-darkbg border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {tip === 0 ? 'No Tip' : `₹${tip}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary Calculations */}
                <div className="bg-secondary-soft dark:bg-secondary border border-black/5 dark:border-white/10 p-4 rounded-2xl space-y-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-black">₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount</span>
                      <span className="font-black">-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryCharge === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong> : `₹${deliveryCharge}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Kitchen Charges</span>
                    <span>₹{tax}</span>
                  </div>

                  {selectedTip > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Driver Tip</span>
                      <span>₹{selectedTip}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-white/10 pt-2.5 flex justify-between text-sm font-black text-gray-900 dark:text-white">
                    <span>Total Amount</span>
                    <span className="text-primary text-base">₹{grandTotal}</span>
                  </div>
                </div>

                {isBelowMin && (
                  <div className="bg-danger/10 border border-danger/30 text-danger p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Minimum order amount is ₹{settings.minOrderAmount}. Add ₹{settings.minOrderAmount - subtotal} more.</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cart Footer Action */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-secondary space-y-2">
              <button
                disabled={isBelowMin}
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white font-black py-4 rounded-2xl text-sm shadow-ios-orange transition transform active:scale-95 flex items-center justify-between px-6 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>PROCEED TO CHECKOUT</span>
                <span className="flex items-center gap-1 font-black">
                  ₹{grandTotal} <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
