import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, Category, CartItem, Order, OrderStatus, Coupon, Banner, 
  Review, RestaurantSettings, ViewMode, CustomerTab, AdminTab, CustomerInfo, PaymentMethod 
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_COUPONS, 
  INITIAL_BANNERS, INITIAL_REVIEWS, INITIAL_SETTINGS 
} from '../data/initialData';
import { 
  apiNotifyAdminOrder, apiFetchOrders, apiCreateOrder, 
  apiUpdateOrderStatus, apiClearOrdersBackend 
} from '../services/api';
import { 
  saveOrderToFirebase, updateOrderStatusInFirebase, 
  subscribeOrdersFromFirebase, clearAllOrdersFromFirebase, seedInitialOrdersToFirebase 
} from '../firebaseClient';
import confetti from 'canvas-confetti';

export type ThemeMode = 'light' | 'dark';

interface StoreContextType {
  // Theme Mode (Light / Dark)
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;

  // Navigation & View Mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isVegOnly: boolean;
  setIsVegOnly: (veg: boolean) => void;
  popularOnly: boolean;
  setPopularOnly: (pop: boolean) => void;
  priceRange: number;
  setPriceRange: (val: number) => void;

  // Product & Category CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Active Product Modal
  activeProductDetail: Product | null;
  setActiveProductDetail: (product: Product | null) => void;

  // Cart Management
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  buyNow: (product: Product, quantity?: number, notes?: string) => void;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // User Auth Simulation & JWT Token Management
  isLoggedIn: boolean;
  userPhone: string;
  userName: string;
  userEmail: string;
  userRole: string;
  loginUser: (phone: string, name: string, role?: string, email?: string) => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  placeOrder: (customer: CustomerInfo, paymentMethod: PaymentMethod) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearAllOrders: () => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  newOrderAlert: Order | null;
  dismissNewOrderAlert: () => void;

  // Reviews
  reviews: Review[];
  addReview: (productId: string, productName: string, rating: number, comment: string) => void;
  approveReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  replyReview: (reviewId: string, replyText: string) => void;

  // Coupons & Banners (Admin)
  coupons: Coupon[];
  banners: Banner[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;

  // Settings
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
  isRestaurantOpen: boolean;

  // Audio Chime
  playNewOrderSound: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Web Audio API chime sound generator
const playSynthesizedChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Create two synth notes (G5 and C6 chime)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(783.99, now); // G5
    osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

    osc2.frequency.setValueAtTime(392.00, now); // G4
    osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.15); // C5

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  } catch (e) {
    console.error('Audio playback error', e);
  }
};

// HTML5 Web Browser Push Notification Generator
const triggerBrowserPushNotification = (order: Order) => {
  try {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`🔥 NEW MIDNIGHT FUEL ORDER! #${order.orderNumber}`, {
          body: `Customer: ${order.customer.fullName} (${order.customer.phone})\nGrand Total: ₹${order.grandTotal}\nAddress: ${order.customer.address}, ${order.customer.area}`,
          tag: order.id,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(`🔥 NEW MIDNIGHT FUEL ORDER! #${order.orderNumber}`, {
              body: `Customer: ${order.customer.fullName} (${order.customer.phone})\nGrand Total: ₹${order.grandTotal}`,
              tag: order.id,
            });
          }
        });
      }
    }
  } catch (e) {
    console.error('Push notification error', e);
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('mf_theme_mode') as ThemeMode) || 'light';
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('mf_theme_mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const [viewModeState, setViewModeState] = useState<ViewMode>('customer');

  const getTabFromHash = (): CustomerTab => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace('#', '').trim();
    const validTabs: CustomerTab[] = [
      'home', 'menu', 'offers', 'about', 'contact', 'orders', 'wishlist',
      'mandi-tirunelveli', 'biryani-tirunelveli', 'midnight-food-tirunelveli',
      'food-delivery-melapalayam', 'shawarma-tirunelveli', 'pizza-tirunelveli',
      'fried-chicken-tirunelveli', 'faq', 'privacy-policy', 'terms', 'sitemap'
    ];
    if (hash && validTabs.includes(hash as CustomerTab)) {
      return hash as CustomerTab;
    }
    return 'home';
  };

  const [customerTabState, setCustomerTabState] = useState<CustomerTab>(() => getTabFromHash());

  const setCustomerTab = (tab: CustomerTab) => {
    setCustomerTabState(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'home') {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = `#${tab}`;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const tab = getTabFromHash();
      setCustomerTabState(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [adminTabState, setAdminTabState] = useState<AdminTab>(() => {
    return (localStorage.getItem('mf_admin_tab') as AdminTab) || 'dashboard';
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('mf_view_mode', mode);
  };

  const setAdminTab = (tab: AdminTab) => {
    setAdminTabState(tab);
    localStorage.setItem('mf_admin_tab', tab);
  };

  const viewMode = viewModeState;
  const customerTab = customerTabState;
  const adminTab = adminTabState;

  // Products & Categories state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mf_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [popularOnly, setPopularOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(1500);

  // Active Product Modal
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mf_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const buyNow = (product: Product, quantity: number = 1, notes?: string) => {
    addToCart(product, quantity, notes);
    setIsCheckoutOpen(true);
  };

  // Coupon state
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('mf_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // User auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mf_user_logged') === 'true';
  });
  const [userPhone, setUserPhone] = useState<string>(() => localStorage.getItem('mf_user_phone') || '');
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('mf_user_name') || '');
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('mf_user_email') || '');
  const [userRole, setUserRole] = useState<string>(() => localStorage.getItem('mf_user_role') || 'customer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mf_orders');
    if (saved) return JSON.parse(saved);
    // Initial sample order
    return [
      {
        id: 'ord-1001',
        orderNumber: 'MF-8821',
        customer: {
          fullName: 'Mohamed Aslam',
          phone: '+91 98765 43210',
          address: 'Bazar Street, Near Mosque',
          area: 'Melapalayam',
          pincode: '627005',
          notes: 'Extra garlic toum please'
        },
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 2 },
          { product: INITIAL_PRODUCTS[6], quantity: 1 }
        ],
        status: 'Preparing',
        orderTime: new Date(Date.now() - 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedTime: '20 mins',
        paymentMethod: 'COD',
        subtotal: 980,
        deliveryCharge: 35,
        tax: 49,
        discount: 100,
        grandTotal: 964,
        couponCode: 'MIDNIGHT100',
        paid: false,
        driverLocation: { lat: 8.7075, lng: 77.7280 }
      }
    ];
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Banners & Reviews
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Settings
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mf_orders', JSON.stringify(orders));
  }, [orders]);

  // Seed historical order data into Firebase Cloud Firestore on mount so past history is recovered
  useEffect(() => {
    seedInitialOrdersToFirebase(orders);
  }, []);

  // Sync orders in real-time from Firebase Cloud Firestore (works on GitHub Pages & live sites)
  useEffect(() => {
    const unsubscribe = subscribeOrdersFromFirebase((firebaseOrders) => {
      if (Array.isArray(firebaseOrders) && firebaseOrders.length > 0) {
        setOrders(prev => {
          const existingMap = new Map(prev.map(o => [o.id || o.orderNumber, o]));
          const newlyArrived: Order[] = [];

          firebaseOrders.forEach((remoteOrder: Order) => {
            const key = remoteOrder.id || remoteOrder.orderNumber;
            if (!existingMap.has(key)) {
              newlyArrived.push(remoteOrder);
            }
          });

          if (newlyArrived.length > 0 && userRole === 'admin') {
            setNewOrderAlert(newlyArrived[0]);
            playSynthesizedChime();
            triggerBrowserPushNotification(newlyArrived[0]);
          }

          const combinedMap = new Map<string, Order>();
          firebaseOrders.forEach((remoteOrder: Order) => {
            const key = remoteOrder.id || remoteOrder.orderNumber;
            const existing = existingMap.get(key);
            combinedMap.set(key, { ...existing, ...remoteOrder, id: key });
          });

          prev.forEach(localOrder => {
            const key = localOrder.id || localOrder.orderNumber;
            if (!combinedMap.has(key)) {
              combinedMap.set(key, localOrder);
            }
          });

          return Array.from(combinedMap.values());
        });
      } else {
        // If Firebase is empty, upload initial sample order history
        seedInitialOrdersToFirebase(orders);
      }
    });

    // Also poll backend API fallback if running locally
    const syncBackendOrders = async () => {
      const res = await apiFetchOrders();
      if (res && res.success && Array.isArray(res.orders)) {
        setOrders(prev => {
          const existingMap = new Map(prev.map(o => [o.id || o.orderNumber, o]));
          const combinedMap = new Map<string, Order>();

          res.orders.forEach((remoteOrder: Order) => {
            const key = remoteOrder.id || remoteOrder.orderNumber;
            const existing = existingMap.get(key);
            combinedMap.set(key, { ...existing, ...remoteOrder, id: key });
          });

          prev.forEach(localOrder => {
            const key = localOrder.id || localOrder.orderNumber;
            if (!combinedMap.has(key)) {
              combinedMap.set(key, localOrder);
            }
          });

          return Array.from(combinedMap.values());
        });
      }
    };

    syncBackendOrders();
    const intervalId = setInterval(syncBackendOrders, 5000);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      clearInterval(intervalId);
    };
  }, [userRole]);

  // Operational Hours Check
  const checkIsRestaurantOpen = (): boolean => {
    if (settings.isClosedForced || settings.holidayMode) return false;
    if (settings.allowAnytimeOrdering) return true;
    
    const now = new Date();
    const hours = now.getHours();
    // 7 PM (19:00) to 2 AM (02:00)
    if (hours >= 19 || hours < 2) {
      return true;
    }
    return false;
  };

  const isRestaurantOpen = checkIsRestaurantOpen();

  // Audio chime player
  const playNewOrderSound = () => {
    playSynthesizedChime();
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, notes?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      } else {
        return [...prev, { product, quantity, notes }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon application
  const applyCoupon = (code: string) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.offerPrice || item.product.price) * item.quantity, 0);
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < found.minOrderAmount) {
      return { success: false, message: `Minimum order amount for code ${found.code} is ₹${found.minOrderAmount}` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon '${found.code}' applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Auth User
  const loginUser = (phone: string, name: string, role: string = 'customer', email: string = '') => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    setUserName(name || 'Foodie');
    setUserEmail(email);
    setUserRole(role);

    localStorage.setItem('mf_user_logged', 'true');
    localStorage.setItem('mf_user_phone', phone);
    localStorage.setItem('mf_user_name', name || 'Foodie');
    localStorage.setItem('mf_user_email', email);
    localStorage.setItem('mf_user_role', role);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    setUserName('');
    setUserEmail('');
    setUserRole('customer');

    localStorage.removeItem('mf_user_logged');
    localStorage.removeItem('mf_user_phone');
    localStorage.removeItem('mf_user_name');
    localStorage.removeItem('mf_user_email');
    localStorage.removeItem('mf_user_role');
    localStorage.removeItem('mf_jwt_token');
    
    setCustomerTab('home');
    setViewMode('customer');
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, availability: !p.availability } : p));
  };

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: catData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Order Placement
  const placeOrder = (customer: CustomerInfo, paymentMethod: PaymentMethod): Order => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.offerPrice || item.product.price) * item.quantity, 0);
    
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

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `MF-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      items: [...cart],
      status: 'Pending',
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedTime: '25-35 mins',
      paymentMethod,
      subtotal,
      deliveryCharge,
      tax,
      discount,
      grandTotal,
      couponCode: appliedCoupon?.code,
      paid: paymentMethod === 'ONLINE_RAZORPAY',
      driverLocation: { lat: 8.7123, lng: 77.7321 }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Save to Firebase Cloud Firestore (real-time sync across all devices on GitHub Pages & live web)
    saveOrderToFirebase(newOrder);

    // Save to shared backend database if server is running
    apiCreateOrder(newOrder).catch(err => console.warn('Order sync note:', err));

    // Only trigger live screen pop-up alerts and audio chimes if user is an Admin
    if (userRole === 'admin') {
      setNewOrderAlert(newOrder);
      playSynthesizedChime();
      triggerBrowserPushNotification(newOrder);
    }

    // Always send backend SMS + WhatsApp Notification to Admin phone 8608724931
    apiNotifyAdminOrder(newOrder).then(res => {
      console.log('📱 Instant Admin Order Notification Status:', res);
    });

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o));
    if (activeOrder && (activeOrder.id === orderId || activeOrder.orderNumber === orderId)) {
      setActiveOrder(prev => prev ? { ...prev, status } : null);
    }
    // Update status in Firebase Cloud & backend server
    updateOrderStatusInFirebase(orderId, status);
    apiUpdateOrderStatus(orderId, status).catch(err => console.warn('Status update note:', err));
  };

  const clearAllOrders = () => {
    setOrders([]);
    setActiveOrder(null);
    setNewOrderAlert(null);
    localStorage.removeItem('mf_orders');
    // Clear in Firebase Cloud & backend server
    clearAllOrdersFromFirebase();
    apiClearOrdersBackend().catch(err => console.warn('Clear orders note:', err));
  };

  const dismissNewOrderAlert = () => {
    setNewOrderAlert(null);
  };

  // Reviews
  const addReview = (productId: string, productName: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      productName,
      customerName: userName || 'Food Lover',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      approved: true
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const approveReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: true } : r));
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const replyReview = (reviewId: string, replyText: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: replyText } : r));
  };

  // Admin Coupons & Banners
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'timesUsed'>) => {
    setCoupons(prev => [{ ...couponData, id: `c-${Date.now()}`, timesUsed: 0 }, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleCouponActive = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    setBanners(prev => [{ ...bannerData, id: `b-${Date.now()}` }, ...prev]);
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider value={{
      themeMode, setThemeMode, toggleThemeMode,
      viewMode, setViewMode,
      customerTab, setCustomerTab,
      adminTab, setAdminTab,

      products, categories, selectedCategory, setSelectedCategory,
      searchQuery, setSearchQuery, isVegOnly, setIsVegOnly, popularOnly, setPopularOnly,
      priceRange, setPriceRange, addProduct, updateProduct, deleteProduct, toggleProductStock,
      addCategory, updateCategory, deleteCategory,
      activeProductDetail, setActiveProductDetail,

      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen,
      isCheckoutOpen, setIsCheckoutOpen, buyNow,

      appliedCoupon, applyCoupon, removeCoupon,

      wishlist, toggleWishlist,

      isLoggedIn, userPhone, userName, userEmail, userRole, loginUser, logoutUser,
      isAuthModalOpen, setIsAuthModalOpen,

      orders, placeOrder, updateOrderStatus, clearAllOrders,
      activeOrder, setActiveOrder,
      newOrderAlert, dismissNewOrderAlert,

      reviews, addReview, approveReview, deleteReview, replyReview,

      coupons, banners, addCoupon, deleteCoupon, toggleCouponActive,
      addBanner, deleteBanner, toggleBannerActive,

      settings, updateSettings, isRestaurantOpen,

      playNewOrderSound,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
