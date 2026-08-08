import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar, MobileBottomNav } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveOrderTracker } from './components/LiveOrderTracker';
import { FloatingActions } from './components/FloatingActions';
import { 
  AuthModal, CustomerOrdersPage, WishlistPage, OffersPage, ContactPage, AboutPage 
} from './components/CustomerPages';
import { 
  MandiSeoPage, BiryaniSeoPage, MidnightFoodSeoPage, MelapalayamSeoPage, 
  DishCategorySeoPage, FaqSeoPage, LegalPages, GoogleReviewBanner 
} from './components/SeoPages';
import { 
  AdminLayout, AdminDashboardView, AdminOrdersView, 
  AdminKitchenView, AdminProductsView, AdminCategoriesView, AdminSettingsView, AdminCustomersView 
} from './components/AdminComponents';
import { Flame, MapPin, PhoneCall, Clock, ShieldCheck, ExternalLink, Star } from 'lucide-react';

const HomepageSeoContent: React.FC = () => {
  const { setCustomerTab } = useStore();

  return (
    <section className="bg-secondary/40 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* H1 & H2 SEO Structure Requested by User */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs bg-primary/20 text-primary font-black px-3.5 py-1 rounded-full border border-primary/30 uppercase tracking-widest">
            🔥 TIRUNELVELI'S #1 LATE NIGHT FOOD HUB
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Late Night Food Delivery in Tirunelveli
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Midnight Fuel is Melapalayam's premier late-night food destination, serving slow-cooked Arabian Mandi, authentic Hyderabadi Dum Biryani, jumbo shawarmas, and wood-fired pizzas until 2:00 AM every night.
          </p>
        </div>

        {/* H2 Keyword Clusters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setCustomerTab('mandi-tirunelveli')}
            className="glass-card p-6 rounded-3xl space-y-2 border border-white/10 hover:border-primary cursor-pointer transition group"
          >
            <div className="text-3xl">🍗</div>
            <h2 className="text-lg font-extrabold text-white group-hover:text-primary transition">
              Mandi & Biryani Delivery in Tirunelveli
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Order Chicken Mandi, Mutton Mandi, Beef Mandi, and Seeraga Samba Dum Biryani cooked with fresh spices and served hot.
            </p>
            <span className="text-xs text-primary font-extrabold block pt-2 group-hover:underline">
              Explore Mandi Menu →
            </span>
          </div>

          <div 
            onClick={() => setCustomerTab('midnight-food-tirunelveli')}
            className="glass-card p-6 rounded-3xl space-y-2 border border-white/10 hover:border-primary cursor-pointer transition group"
          >
            <div className="text-3xl">🌙</div>
            <h2 className="text-lg font-extrabold text-white group-hover:text-primary transition">
              Midnight Food Delivery in Melapalayam
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Craving 2 AM night food? Express delivery across Melapalayam (627005) near Bazar, High Ground, and Tirunelveli city.
            </p>
            <span className="text-xs text-primary font-extrabold block pt-2 group-hover:underline">
              View 2 AM Night Menu →
            </span>
          </div>

          <div 
            onClick={() => setCustomerTab('menu')}
            className="glass-card p-6 rounded-3xl space-y-2 border border-white/10 hover:border-primary cursor-pointer transition group"
          >
            <div className="text-3xl">🍔</div>
            <h2 className="text-lg font-extrabold text-white group-hover:text-primary transition">
              Order Fresh Food Online in Tirunelveli
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              From Rumali Cheese Shawarma to Fiery BBQ Pizza and Monster Burgers, order fresh online with instant live map tracking.
            </p>
            <span className="text-xs text-primary font-extrabold block pt-2 group-hover:underline">
              Order Food Now →
            </span>
          </div>
        </div>

        <GoogleReviewBanner />

      </div>
    </section>
  );
};

const MainAppContent: React.FC = () => {
  const { viewMode, customerTab, setCustomerTab, adminTab, activeOrder, isCheckoutOpen, setIsCheckoutOpen } = useStore();

  if (viewMode === 'admin') {
    return (
      <AdminLayout>
        {adminTab === 'dashboard' && <AdminDashboardView />}
        {adminTab === 'orders' && <AdminOrdersView />}
        {adminTab === 'kitchen' && <AdminKitchenView />}
        {adminTab === 'products' && <AdminProductsView />}
        {adminTab === 'categories' && <AdminCategoriesView />}
        {adminTab === 'coupons' && <AdminSettingsView />}
        {adminTab === 'banners' && <AdminDashboardView />}
        {adminTab === 'customers' && <AdminCustomersView />}
        {adminTab === 'analytics' && <AdminDashboardView />}
        {adminTab === 'reviews' && <AdminDashboardView />}
        {adminTab === 'settings' && <AdminSettingsView />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-darkbg text-white font-sans selection:bg-primary selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Dynamic Main Body Content */}
      <main className="flex-1 pb-20 md:pb-6">
        {customerTab === 'home' && (
          <>
            <Hero />
            <MenuSection />
            <HomepageSeoContent />
            <ContactPage />
          </>
        )}

        {customerTab === 'menu' && <MenuSection />}
        {customerTab === 'offers' && <OffersPage />}
        {customerTab === 'about' && <AboutPage />}
        {customerTab === 'contact' && <ContactPage />}
        {customerTab === 'orders' && <CustomerOrdersPage />}
        {customerTab === 'wishlist' && <WishlistPage />}

        {/* Dedicated SEO Landing Pages */}
        {customerTab === 'mandi-tirunelveli' && <MandiSeoPage />}
        {customerTab === 'biryani-tirunelveli' && <BiryaniSeoPage />}
        {customerTab === 'midnight-food-tirunelveli' && <MidnightFoodSeoPage />}
        {customerTab === 'food-delivery-melapalayam' && <MelapalayamSeoPage />}
        
        {customerTab === 'shawarma-tirunelveli' && (
          <DishCategorySeoPage 
            categoryKey="shawarma"
            title="Juicy Chicken Shawarma Delivery in Tirunelveli"
            subtitle="Rotisserie chicken wrapped in hot rumali parotta with garlic toum, pickles & melted cheese."
          />
        )}

        {customerTab === 'pizza-tirunelveli' && (
          <DishCategorySeoPage 
            categoryKey="pizza"
            title="Late Night Wood-Fired Pizza in Tirunelveli"
            subtitle="Hand-tossed crust loaded with shredded BBQ chicken, jalapeños & mozzarella delivered till 2 AM."
          />
        )}

        {customerTab === 'fried-chicken-tirunelveli' && (
          <DishCategorySeoPage 
            categoryKey="burger"
            title="Crispy Monster Burgers & Fried Chicken Tirunelveli"
            subtitle="Double patty brioche burgers and crispy fried chicken pieces delivered hot."
          />
        )}

        {customerTab === 'faq' && <FaqSeoPage />}
        {customerTab === 'privacy-policy' && <LegalPages mode="privacy" />}
        {customerTab === 'terms' && <LegalPages mode="terms" />}
      </main>

      {/* Floating Action Buttons (WhatsApp & Call) */}
      <FloatingActions />

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Dialog */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={() => {
          setIsCheckoutOpen(false);
        }}
      />

      {/* Customer Auth Login Modal */}
      <AuthModal />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* Advanced SEO Footer with Internal Keyword Architecture */}
      <footer className="bg-secondary/95 border-t border-white/10 py-12 px-4 text-xs text-gray-400 space-y-8 pb-28 md:pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 lg:col-span-2">
            <div 
              onClick={() => setCustomerTab('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-white">MIDNIGHT<span className="text-primary">FUEL</span></span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Tirunelveli's premier late night food delivery hub operating 7:00 PM – 2:00 AM. Serving authentic slow-cooked Arabian Mandi, Dum Biryani, Shawarma, and Fast Food in Melapalayam.
            </p>
            <p className="text-[11px] text-gray-500">
              📍 Bazar, Near Meera Broilers, Melapalayam, Tirunelveli – 627005 | 📞 +91 90801 39363
            </p>
          </div>

          {/* Col 2: Priority SEO Landing Pages */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-primary">Top SEO Destinations</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => setCustomerTab('mandi-tirunelveli')} className="hover:text-primary transition">
                  Mandi in Tirunelveli
                </button>
              </li>
              <li>
                <button onClick={() => setCustomerTab('biryani-tirunelveli')} className="hover:text-primary transition">
                  Biryani Delivery Tirunelveli
                </button>
              </li>
              <li>
                <button onClick={() => setCustomerTab('midnight-food-tirunelveli')} className="hover:text-primary transition">
                  Late Night Food Tirunelveli
                </button>
              </li>
              <li>
                <button onClick={() => setCustomerTab('food-delivery-melapalayam')} className="hover:text-primary transition">
                  Food Delivery Melapalayam 627005
                </button>
              </li>
              <li>
                <button onClick={() => setCustomerTab('shawarma-tirunelveli')} className="hover:text-primary transition">
                  Shawarma Delivery Tirunelveli
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Menu Categories */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-primary">Popular Cuisines</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setCustomerTab('menu')} className="hover:text-primary transition">Chicken Mandi Tirunelveli</button></li>
              <li><button onClick={() => setCustomerTab('menu')} className="hover:text-primary transition">Mutton Mandi Tirunelveli</button></li>
              <li><button onClick={() => setCustomerTab('menu')} className="hover:text-primary transition">Beef Biryani Melapalayam</button></li>
              <li><button onClick={() => setCustomerTab('pizza-tirunelveli')} className="hover:text-primary transition">Late Night Pizza</button></li>
              <li><button onClick={() => setCustomerTab('fried-chicken-tirunelveli')} className="hover:text-primary transition">Fried Chicken & Burgers</button></li>
            </ul>
          </div>

          {/* Col 4: Support & Legal */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-primary">Customer Support</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setCustomerTab('faq')} className="hover:text-primary transition">Frequently Asked Questions (FAQ)</button></li>
              <li><button onClick={() => setCustomerTab('contact')} className="hover:text-primary transition">Contact Kitchen & Map</button></li>
              <li><button onClick={() => setCustomerTab('offers')} className="hover:text-primary transition">Midnight Coupons & Offers</button></li>
              <li><button onClick={() => setCustomerTab('sitemap')} className="hover:text-primary transition">HTML Sitemap Index</button></li>
              <li><button onClick={() => setCustomerTab('privacy-policy')} className="hover:text-primary transition">Privacy Policy</button></li>
              <li><button onClick={() => setCustomerTab('terms')} className="hover:text-primary transition">Terms & Conditions</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 text-center text-[11px] text-gray-500 space-y-2">
          <p>© 2026 Midnight Fuel. All rights reserved. 100% Halal Certified Preparation.</p>
          <p>Delivering late-night food to Melapalayam, Palayamkottai, Vannarpettai, Tirunelveli Town & High Ground.</p>
        </div>
      </footer>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: false };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Safe ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;

