import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Clock, Heart, Plus, Minus, X, Check, Star, Zap, ChevronLeft } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProductDetail, setActiveProductDetail, 
    addToCart, buyNow, wishlist, toggleWishlist, reviews 
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('14"');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  if (!activeProductDetail) return null;

  const product = activeProductDetail;
  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id && r.approved);
  const hasOffer = Boolean(product.offerPrice && product.offerPrice < product.price);

  const availableSizes = ['10"', '14"', '16"'];
  const ingredients = [
    { name: 'Flour Base', icon: '🌾' },
    { name: 'Fresh Chicken', icon: '🍗' },
    { name: 'Red Chili', icon: '🌶️' },
    { name: 'Garlic Butter', icon: '🧄' },
    { name: 'Mozzarella', icon: '🧀' },
  ];

  const handleAdd = () => {
    addToCart(product, quantity, `Size: ${selectedSize}. ${specialNotes}`.trim());
    setActiveProductDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-secondary border border-black/5 dark:border-white/10 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-ios-lg relative transition-colors">
        
        {/* Dish Image Header with Top Navigation Bar */}
        <div className="relative h-64 sm:h-80 w-full bg-secondary-soft dark:bg-darkbg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* iOS Top Bar (Back Arrow + Heart) */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => setActiveProductDetail(null)}
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-darkbg/90 text-gray-900 dark:text-white flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition ${
                isWishlisted ? 'bg-primary text-white' : 'bg-white/90 dark:bg-darkbg/90 text-gray-600 dark:text-gray-300 hover:text-primary'
              }`}
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${product.isVeg ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
              {product.isVeg ? '🌱 VEG' : '🍖 NON-VEG'}
            </span>
            {product.popularBadge && (
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-black shadow-ios-orange">
                ⭐ BESTSELLER
              </span>
            )}
          </div>
        </div>

        {/* Content Body matching UI Kit Image 3 & 5 */}
        <div className="p-5 sm:p-7 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs text-primary font-black uppercase tracking-wider mb-1">
              <span>📍 Uttora Coffee House & Kitchen</span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{product.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed font-medium">
              {product.description || "Prosciutto e funghi is a delicious dish topped with fresh tomato sauce, melted mozzarella, and oregano."}
            </p>
          </div>

          {/* Rating, Delivery, Prep Bar */}
          <div className="flex items-center gap-6 text-xs font-bold text-gray-700 dark:text-gray-300 pb-3 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{product.rating || 4.7}</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span>🛵 Free Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 text-primary" />
              <span>{product.prepTime}</span>
            </div>
          </div>

          {/* Size Selector Pills (10", 14", 16") */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-900 dark:text-white tracking-wider">
              SIZE:
            </label>
            <div className="flex items-center gap-3">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-12 rounded-full font-black text-xs transition border flex items-center justify-center ${
                    selectedSize === sz
                      ? 'bg-primary text-white border-primary shadow-ios-orange scale-105'
                      : 'bg-secondary-soft dark:bg-darkbg text-gray-700 dark:text-gray-300 border-black/5 dark:border-white/10 hover:border-primary'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients Row with Cute Icons matching UI Kit Image 3 & 5 */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-900 dark:text-white tracking-wider">
              INGREDIENTS
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {ingredients.map((ing, idx) => (
                <div 
                  key={idx} 
                  className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-primary/20 flex items-center justify-center text-xl shrink-0"
                  title={ing.name}
                >
                  {ing.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Customization Note */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra cheese, less spicy..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full bg-secondary-soft dark:bg-darkbg text-xs text-gray-900 dark:text-white px-4 py-3 rounded-2xl border border-black/5 dark:border-white/10 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Modal Footer Price, Counter & ADD TO CART button */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Price</span>
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  ₹{(product.offerPrice || product.price) * quantity}
                </span>
              </div>

              {/* Quantity Counter (- 2 +) */}
              <div className="flex items-center bg-secondary-soft dark:bg-darkbg border border-black/5 dark:border-white/10 rounded-full px-3 py-1.5 gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-white dark:bg-secondary text-gray-900 dark:text-white flex items-center justify-center font-bold text-sm shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-ios-orange"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Full-width vibrant orange ADD TO CART button */}
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover text-white font-black py-4 rounded-2xl text-sm shadow-ios-orange transition transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>ADD TO CART</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
