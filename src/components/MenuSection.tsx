import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Flame, Clock, Heart, Plus, Minus, Search, 
  Sparkles, CheckCircle2, AlertCircle, Eye, Zap 
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

  // Filter logic
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (isVegOnly && !product.isVeg) return false;
    if (popularOnly && !product.popularBadge) return false;
    const finalPrice = product.offerPrice || product.price;
    if (finalPrice > priceRange) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(q) || 
             product.description.toLowerCase().includes(q) ||
             product.category.toLowerCase().includes(q);
    }
    return true;
  });

  const getItemQuantityInCart = (productId: string) => {
    const found = cart.find(item => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu-section" className="py-8 sm:py-12 bg-darkbg overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5" /> Midnight Menu
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore Our <span className="text-gradient-orange">Night Feasts</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Cooked fresh to order. Filter by category, spice level, or veg preference.
          </p>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
              selectedCategory === 'all'
                ? 'bg-primary text-white border-primary shadow-glow-sm'
                : 'bg-secondary text-gray-300 border-white/10 hover:border-primary/50'
            }`}
          >
            🍽️ All Items ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-glow-sm'
                    : 'bg-secondary text-gray-300 border-white/10 hover:border-primary/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-gray-300">
          
          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Veg Only */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVegOnly}
                onChange={(e) => setIsVegOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-secondary text-emerald-500 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm border border-emerald-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                </span>
                Veg Only
              </span>
            </label>

            {/* Popular Only */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={popularOnly}
                onChange={(e) => setPopularOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-secondary text-primary focus:ring-primary"
              />
              <span className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Popular Specials
              </span>
            </label>

          </div>

          {/* Price Filter Slider */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span>Max Price: <strong className="text-primary font-bold">₹{priceRange}</strong></span>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="accent-primary w-32 cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== 'all' || isVegOnly || popularOnly || priceRange < 1500 || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setIsVegOnly(false);
                setPopularOnly(false);
                setPriceRange(1500);
                setSearchQuery('');
              }}
              className="text-primary hover:underline font-bold text-xs"
            >
              Reset Filters
            </button>
          )}

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl space-y-3">
            <div className="text-4xl">🍗</div>
            <h3 className="text-lg font-bold text-white">No Dishes Found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Try resetting your filters or search for something else like Mandi or Biryani!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const qty = getItemQuantityInCart(product.id);
              const isWishlisted = wishlist.includes(product.id);
              const hasOffer = Boolean(product.offerPrice && product.offerPrice < product.price);

              return (
                <div 
                  key={product.id}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col group relative"
                >
                  {/* Top Image Box */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Veg / Non-Veg Badge */}
                    <div className="absolute top-3 left-3 bg-darkbg/90 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10 text-[10px] font-bold">
                      <span className={`w-3 h-3 rounded-sm border ${product.isVeg ? 'border-emerald-500' : 'border-red-500'} flex items-center justify-center`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                      <span className={product.isVeg ? 'text-emerald-400' : 'text-red-400'}>
                        {product.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>

                    {/* Popular Tag */}
                    {product.popularBadge && (
                      <div className="absolute top-3 right-12 bg-gradient-to-r from-amber-500 to-primary text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> POPULAR
                      </div>
                    )}

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

                    {/* Quick View Button */}
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
                      <div className="flex items-center justify-between gap-2">
                        <h3 
                          onClick={() => setActiveProductDetail(product)}
                          className="font-bold text-white text-base hover:text-primary transition cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Spicy Meter & Prep Time */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
                        {/* Spicy Level */}
                        <div className="flex items-center gap-1" title={`Spicy level: ${product.spicyLevel}/3`}>
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

                        {/* Prep Time */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          <span>{product.prepTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Price & Add To Cart / Buy Now Action Buttons */}
                    <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2">
                        {/* Price */}
                        <div>
                          {hasOffer ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-extrabold text-primary">₹{product.offerPrice}</span>
                              <span className="text-xs line-through text-gray-500">₹{product.price}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-extrabold text-white">₹{product.price}</span>
                          )}
                        </div>

                        {/* Add To Cart Button / Counter */}
                        {!product.availability ? (
                          <span className="text-[11px] text-danger font-bold bg-danger/10 px-2 py-1 rounded">
                            Sold Out
                          </span>
                        ) : qty === 0 ? (
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-secondary hover:bg-secondary-light text-gray-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <Plus className="w-3.5 h-3.5 text-primary" /> Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center bg-secondary border border-primary/50 rounded-xl px-1 py-0.5">
                            <button
                              onClick={() => updateQuantity(product.id, qty - 1)}
                              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-primary text-white flex items-center justify-center transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-extrabold text-primary">{qty}</span>
                            <button
                              onClick={() => updateQuantity(product.id, qty + 1)}
                              className="w-6 h-6 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Buy Now Button (Instant Order Checkout) */}
                      {product.availability && (
                        <button
                          onClick={() => buyNow(product)}
                          className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary-hover hover:to-orange-700 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow-sm hover:scale-[1.02] transition"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
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
