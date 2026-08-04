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
  AdminLayout, AdminDashboardView, AdminOrdersView, 
  AdminKitchenView, AdminProductsView, AdminCategoriesView, AdminSettingsView, AdminCustomersView 
} from './components/AdminComponents';

const MainAppContent: React.FC = () => {
  const { viewMode, customerTab, adminTab } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

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
    <div className="min-h-screen flex flex-col bg-darkbg text-white font-sans selection:bg-primary selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Dynamic Main Body Content */}
      <main className="flex-1 pb-20 md:pb-6">
        {customerTab === 'home' && (
          <>
            <Hero />
            <MenuSection />
            <ContactPage />
          </>
        )}

        {customerTab === 'menu' && <MenuSection />}
        {customerTab === 'offers' && <OffersPage />}
        {customerTab === 'about' && <AboutPage />}
        {customerTab === 'contact' && <ContactPage />}
        {customerTab === 'orders' && <LiveOrderTracker />}
        {customerTab === 'wishlist' && <WishlistPage />}
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

      {/* Footer */}
      <footer className="bg-secondary/90 border-t border-white/10 py-10 px-4 text-center text-xs text-gray-400 space-y-3 pb-24 md:pb-10">
        <div className="flex items-center justify-center gap-2">
          <span className="font-extrabold text-base text-white">MIDNIGHT<span className="text-primary">FUEL</span></span>
        </div>
        <p>📍 Bazar, Near Meera Broilers, Melapalayam, Tirunelveli – 627005 | 📞 +91 90801 39363</p>
        <p className="text-[11px] text-gray-500">
          Open Every Night 7:00 PM – 2:00 AM. 100% Halal Certified Ingredients.
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;
