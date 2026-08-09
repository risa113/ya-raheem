import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Flame, Clock, Heart, Plus, Minus, Search, 
  Sparkles, CheckCircle2, Eye, Zap, Star, ArrowUpDown, Tag
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
    <section id="menu-section" className="py-8 sm:py-12 bg-lightbg dark:bg-darkbg overflow-x-hidden relative transition-colors">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-ios-lg flex items-center gap-2 text-xs font-black animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Added "{addedToast}" to cart!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" /> Popular Foods
            </div>
            <h2 className="text-xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight font-sans">
              Popular <span className="text-primary">Dishes & Menu</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold max-w-sm">
            Order fresh burgers, pizzas, shawarmas, and Mandi delivered fast to your location.
          </p>
        </div>

        {/* Category Horizontal iOS Filter Pills Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar touch-pan-x snap-x scroll-smooth">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-ios-orange'
                : 'bg-white dark:bg-secondary text-gray-700 dark:text-gray-300 border border-black/5 dark:border-white/10 hover:border-primary'
            }`}
          >
            🔥 All ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition flex items-center gap-2 shadow-sm ${
                  isSelected
                    ? 'bg-primary text-white shadow-ios-orange'
                    : 'bg-white dark:bg-secondary text-gray-700 dark:text-gray-300 border border-black/5 dark:border-white/10 hover:border-primary'
                }`}
              >
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                ) : (
                  <span className="text-sm">{cat.icon}</span>
                )}
                <span>{cat.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Chips & Sorting Row */}
        <div className="bg-white dark:bg-secondary p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-ios-card">
          
          {/* Toggles Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Pure Veg */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition ${
                isVegOnly 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'bg-secondary-soft dark:bg-darkbg border-black/5 dark:border-white/10 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm border border-emerald-500 flex items-center justify-center">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
              </span>
              <span>Pure Veg 🟢</span>
            </button>

            {/* Bestsellers */}
            <button
              onClick={() => setPopularOnly(!popularOnly)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition ${
                popularOnly 
                  ? 'bg-primary/10 border-primary text-primary font-extrabold'
                  : 'bg-secondary-soft dark:bg-darkbg border-black/5 dark:border-white/10 text-gray-500 dark:text-gray-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Bestsellers 🔥</span>
            </button>

            {/* Rating 4.5+ */}
            <button
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition ${
                minRating === 4.5 
                  ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                  : 'bg-secondary-soft dark:bg-darkbg border-black/5 dark:border-white/10 text-gray-500 dark:text-gray-400'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Ratings 4.5+ ⭐</span>
            </button>

          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-secondary-soft dark:bg-darkbg text-xs text-gray-900 dark:text-white border border-black/5 dark:border-white/10 rounded-2xl px-3 py-1.5 focus:border-primary focus:outline-none font-bold cursor-pointer"
              >
                <option value="default">Sort by: Relevance</option>
                <option value="rating">Rating: High to Low</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>

            {(selectedCategory !== 'all' || isVegOnly || popularOnly || searchQuery || minRating > 0 || sortBy !== 'default') && (
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
                className="text-primary hover:underline font-black text-xs"
              >
                Reset
              </button>
            )}
          </div>

        </div>

        {/* Product Grid - Matching iOS Food UI Kit Card Style */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-secondary rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/10 space-y-3 shadow-ios-card">
            <div className="text-5xl">🍔</div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">No Dishes Found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-sm mx-auto">
              Try resetting your filters or search for something else!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => {
              const qty = getItemQuantityInCart(product.id);
              const isWishlisted = wishlist.includes(product.id);
              const hasOffer = Boolean(product.offerPrice && product.offerPrice < product.price);
              const discountPercent = hasOffer ? Math.round(((product.price - (product.offerPrice || product.price)) / product.price) * 100) : 0;

              return (
                <div 
                  key={product.id}
                  className="bg-white dark:bg-secondary rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col group relative border border-black/5 dark:border-white/10 hover:border-primary/50 transition-all duration-300 shadow-ios-card"
                >
                  {/* Top Image Container */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-secondary-soft dark:bg-darkbg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Veg / Non-Veg Tag */}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-darkbg/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-black/5 dark:border-white/10 text-[10px] font-black shadow-sm">
                      <span className={`w-2.5 h-2.5 rounded-sm border ${product.isVeg ? 'border-emerald-500' : 'border-red-500'} flex items-center justify-center`}>
                        <span className={`w-1 h-1 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                      <span className={product.isVeg ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                        {product.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>

                    {/* Offer Badge */}
                    {hasOffer && (
                      <div className="absolute top-3 left-24 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-xl shadow-ios-orange flex items-center gap-0.5">
                        <Tag className="w-3 h-3" /> {discountPercent}% OFF
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                        isWishlisted ? 'bg-primary text-white' : 'bg-white/80 dark:bg-darkbg/80 text-gray-600 dark:text-gray-300 hover:text-primary'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute bottom-3 left-3 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating || 4.7}</span>
                    </div>

                    {/* Quick Eye View */}
                    <button
                      onClick={() => setActiveProductDetail(product)}
                      className="absolute bottom-3 right-3 bg-white/80 dark:bg-darkbg/80 hover:bg-primary text-gray-800 dark:text-white hover:text-white p-2 rounded-xl backdrop-blur-md text-xs font-bold transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    
                    <div className="space-y-1">
                      <h3 
                        onClick={() => setActiveProductDetail(product)}
                        className="font-black text-gray-900 dark:text-white text-base hover:text-primary transition cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 font-medium">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400 font-bold">
                        <span>Prep Time:</span>
                        <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{product.prepTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Price and Circular Orange Add Button matching UI Kit Image 1 & 3 & 5 */}
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        {hasOffer ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-primary">₹{product.offerPrice}</span>
                            <span className="text-xs line-through text-gray-400">₹{product.price}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-black text-gray-900 dark:text-white">₹{product.price}</span>
                        )}
                      </div>

                      {/* Vibrant Circular Orange Plus Button */}
                      {!product.availability ? (
                        <span className="text-[10px] text-danger font-black bg-danger/10 px-2 py-1 rounded-xl">
                          Sold Out
                        </span>
                      ) : qty === 0 ? (
                        <button
                          onClick={() => handleAddToCartWithToast(product)}
                          className="w-9 h-9 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-ios-orange transition transform active:scale-95 shrink-0"
                          title="Add item"
                        >
                          <Plus className="w-5 h-5 stroke-[3]" />
                        </button>
                      ) : (
                        <div className="flex items-center bg-primary/10 border border-primary/40 rounded-full px-2 py-1 shrink-0">
                          <button
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="w-6 h-6 rounded-full bg-white dark:bg-darkbg text-gray-900 dark:text-white flex items-center justify-center text-xs font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-black text-primary">{qty}</span>
                          <button
                            onClick={() => updateQuantity(product.id, qty + 1)}
                            className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
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
