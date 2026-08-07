import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Clock, Heart, Plus, Minus, X, Check, Star, Zap } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProductDetail, setActiveProductDetail, 
    addToCart, buyNow, wishlist, toggleWishlist, reviews 
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  if (!activeProductDetail) return null;

  const product = activeProductDetail;
  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id && r.approved);
  const hasOffer = Boolean(product.offerPrice && product.offerPrice < product.price);

  const handleAdd = () => {
    addToCart(product, quantity, specialNotes);
    setActiveProductDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-darkbg border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveProductDetail(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 hover:bg-primary transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Header */}
        <div className="relative h-52 sm:h-72 w-full bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${product.isVeg ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
              {product.isVeg ? '🌱 VEG' : '🍖 NON-VEG'}
            </span>
            {product.popularBadge && (
              <span className="bg-amber-500 text-white px-2.5 py-1 rounded-md text-xs font-bold">
                ⭐ POPULAR
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{product.name}</h2>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mt-0.5">
                  Category: {product.category}
                </p>
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-full border transition ${
                  isWishlisted ? 'bg-primary border-primary text-white' : 'bg-secondary border-white/10 text-gray-400 hover:text-primary'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-secondary/80 border border-white/10 text-center text-xs">
            <div>
              <span className="text-gray-400 block text-[10px]">PREPARATION</span>
              <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> {product.prepTime}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">SPICINESS</span>
              <span className="font-bold text-white flex items-center justify-center gap-0.5 mt-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame key={i} className={`w-3.5 h-3.5 ${i < product.spicyLevel ? 'text-primary fill-primary' : 'text-gray-700'}`} />
                ))}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">RATING</span>
              <span className="font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {product.rating || 4.8} ({productReviews.length + 12})
              </span>
            </div>
          </div>

          {/* Special Customization Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Special Instructions / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra spicy, less mayo, serve hot salna separate"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-secondary text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Reviews section preview */}
          {productReviews.length > 0 && (
            <div className="space-y-2 border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Customer Reviews</h4>
              {productReviews.slice(0, 2).map(r => (
                <div key={r.id} className="bg-secondary/60 p-3 rounded-xl border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-semibold text-white">{r.customerName}</span>
                    <span className="text-amber-400">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-gray-300 italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-4">
            
            {/* Price */}
            <div>
              <span className="text-xs text-gray-400 block">Total Amount</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-primary">
                  ₹{(product.offerPrice || product.price) * quantity}
                </span>
                {hasOffer && (
                  <span className="text-sm line-through text-gray-500">
                    ₹{product.price * quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector + Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center bg-secondary border border-white/10 rounded-full px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="bg-secondary hover:bg-secondary-light text-gray-200 hover:text-white border border-white/20 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4 text-primary" /> Add to Cart
              </button>

              <button
                onClick={() => {
                  buyNow(product, quantity, specialNotes);
                  setActiveProductDetail(null);
                }}
                className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white font-extrabold px-5 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 shadow-glow-sm transition"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Buy Now
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
