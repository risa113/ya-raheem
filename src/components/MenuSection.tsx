import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Flame, Clock, Heart, Plus, Minus, Search, 
  Sparkles, CheckCircle2, AlertCircle, Eye, Zap, Star, ArrowUpDown, Tag
} from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { 
    products, categories, 
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    isVegOnly, setIsVegOnly,
    popularOnly, setPopularOnly,
    priceRange, setPriceRange,
    cart, addToCart, updateQuantity,
    wishlist, toggleWishlist,
    setActiveProductDetail, buyNow
  } = useStore();

  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'priceLow' | 'priceHigh'>('default');
  const [minRating, setMinRating] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Filter & Sort logic
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (isVegOnly && !product.isVeg) return false;
    if (popularOnly && !product.popularBadge) return false;
    const finalPrice = product.offerPrice || product.price;
    if (finalPrice > priceRange) return false;
    if (minRating > 0 && (product.rating || 4.5) < minRating) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(q) || 
             product.description.toLowerCase().includes(q) ||
             product.category.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    const priceA = a.offerPrice || a.price;
    const priceB = b.offerPrice || b.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'priceLow') return priceA - priceB;
    if (sortBy === 'priceHigh') return priceB - priceA;
    return 0;
  });

  const getItemQuantityInCart = (productId: string) => {
    const found = cart.find(item => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  const handleAddToCartWithToast = (product: Product) => {
    addToCart(product);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <section id="menu-section" className="py-8 sm:py-14 bg-darkbg overflow-x-hidden relative">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-extrabold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Added "{addedToast}" to cart!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-xs font-black px-4 py-1 rounded-full border border-amber-500/40 uppercase tracking-widest shadow-glow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> 👑 Midnight Gourmet Explorer
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Explore <span className="text-gradient-gold">Luxury Night Feasts</span>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm font-medium">
            Slow-cooked Yemeni Mandi, Dum Biryani & Shawarmas cooked fresh to order in Melapalayam.
          </p>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition border ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black border-amber-400 shadow-glow-gold'
                : 'bg-secondary text-gray-300 border-white/10 hover:border-amber-500/50'
            }`}
          >
            🍽️ All Dishes ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-black border-amber-400 shadow-glow-gold'
                    : 'bg-secondary text-gray-300 border-white/10 hover:border-amber-500/50'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black font-extrabold' : 'bg-white/10 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Swiggy / Zomato Filter Chips & Sorting Row */}
        <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-300">
          
          {/* Swiggy Toggles Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Pure Veg */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                isVegOnly 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold'
                  : 'bg-secondary border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm border border-emerald-500 flex items-center justify-center">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
              </span>
              <span>Pure Veg 🟢</span>
            </button>

            {/* Bestseller */}
            <button
              onClick={() => setPopularOnly(!popularOnly)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                popularOnly 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-extrabold'
                  : 'bg-secondary border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bestsellers 🔥</span>
            </button>

            {/* Rating 4.5+ */}
            <button
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                minRating === 4.5 
                  ? 'bg-primary/20 border-primary text-primary font-extrabold'
                  : 'bg-secondary border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Ratings 4.5+ ⭐</span>
            </button>

          </div>

          {/* Sort Dropdown & Max Price */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-secondary text-xs text-white border border-white/10 rounded-xl px-2.5 py-1.5 focus:border-primary focus:outline-none font-semibold cursor-pointer"
              >
                <option value="default">Sort by: Relevance</option>
                <option value="rating">Rating: High to Low</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'all' || isVegOnly || popularOnly || priceRange < 1500 || searchQuery || minRating > 0 || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setIsVegOnly(false);
                  setPopularOnly(false);
                  setPriceRange(1500);
                  setSearchQuery('');
                  setMinRating(0);
                  setSortBy('default');
                }}
                className="text-primary hover:underline font-extrabold text-xs"
              >
                Reset All
              </button>
            )}

          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl space-y-3">
            <div className="text-5xl">🍗</div>
            <h3 className="text-lg font-bold text-white">No Dishes Found</h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-sm mx-auto">
              Try resetting your filters or search for something else like Mandi or Biryani!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const qty = getItemQuantityInCart(product.id);
              const isWishlisted = wishlist.includes(product.id);
              const hasOffer = Boolean(product.offerPrice && product.offerPrice < product.price);
              const discountPercent = hasOffer ? Math.round(((product.price - (product.offerPrice || product.price)) / product.price) * 100) : 0;

              return (
                <div 
                  key={product.id}
                  className="glass-card rounded-3xl overflow-hidden flex flex-col group relative border border-white/10 hover:border-primary/50 transition-all duration-300"
                >
                  {/* Top Image Box */}
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Veg / Non-Veg Indicator */}
                    <div className="absolute top-3 left-3 bg-darkbg/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10 text-[10px] font-black">
                      <span className={`w-3 h-3 rounded-sm border ${product.isVeg ? 'border-emerald-500' : 'border-red-500'} flex items-center justify-center`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                      <span className={product.isVeg ? 'text-emerald-400' : 'text-red-400'}>
                        {product.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {hasOffer && (
                      <div className="absolute top-3 left-24 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-0.5">
                        <Tag className="w-3 h-3" /> {discountPercent}% OFF
                      </div>
                    )}

                    {/* Rating Pill - Swiggy Style */}
                    <div className="absolute bottom-3 left-3 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating || 4.9}</span>
                      <span className="text-[9px] opacity-85">({product.reviewsCount || 120}+)</span>
                    </div>

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                        isWishlisted ? 'bg-primary text-white' : 'bg-darkbg/80 text-gray-300 hover:text-primary'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Quick View Details Button */}
                    <button
                      onClick={() => setActiveProductDetail(product)}
                      className="absolute bottom-3 right-3 bg-darkbg/80 hover:bg-primary text-white p-2 rounded-xl backdrop-blur-md text-xs font-medium flex items-center gap-1 transition"
                      title="Quick View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    
                    <div className="space-y-1.5">
                      <h3 
                        onClick={() => setActiveProductDetail(product)}
                        className="font-extrabold text-white text-base hover:text-primary transition cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Spicy Meter & Prep Time */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400 font-semibold">
                        <div className="flex items-center gap-1">
                          <span>Spice:</span>
                          <span className="flex">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Flame 
                                key={i} 
                                className={`w-3 h-3 ${i < product.spicyLevel ? 'text-primary fill-primary' : 'text-gray-700'}`} 
                              />
                            ))}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-300">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{product.prepTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Price & Swiggy Add/Buy Buttons */}
                    <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2">
                        {/* Price */}
                        <div>
                          {hasOffer ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-black text-amber-400">₹{product.offerPrice}</span>
                              <span className="text-xs line-through text-gray-500">₹{product.price}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-black text-white">₹{product.price}</span>
                          )}
                        </div>

                        {/* Add To Cart Counter / Button */}
                        {!product.availability ? (
                          <span className="text-[11px] text-danger font-extrabold bg-danger/10 px-2.5 py-1 rounded-xl">
                            Sold Out
                          </span>
                        ) : qty === 0 ? (
                          <button
                            onClick={() => handleAddToCartWithToast(product)}
                            className="bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/50 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition shadow-glow-sm"
                          >
                            <Plus className="w-4 h-4" /> ADD
                          </button>
                        ) : (
                          <div className="flex items-center bg-secondary border border-amber-500/60 rounded-xl px-1.5 py-0.5 shadow-glow-sm">
                            <button
                              onClick={() => updateQuantity(product.id, qty - 1)}
                              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-black text-white flex items-center justify-center transition text-xs font-bold"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-black text-amber-400">{qty}</span>
                            <button
                              onClick={() => updateQuantity(product.id, qty + 1)}
                              className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center transition text-xs font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Buy Now Button (Instant Order Checkout) */}
                      {product.availability && (
                        <button
                          onClick={() => buyNow(product)}
                          className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow-gold hover:scale-[1.02] transition"
                        >
                          <Zap className="w-3.5 h-3.5 text-black fill-black" />
                          <span>Buy Now (Instant Order)</span>
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

