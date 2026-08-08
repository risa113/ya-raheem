import { Product } from '../types';

// Declare window dataLayer for GA4 / Google Tag Manager
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * GA4 & Google Search Console Conversion Event Tracker
 * Non-blocking, zero-performance overhead implementation
 */
export const trackPageView = (pageTitle: string, pagePath: string) => {
  if (typeof window === 'undefined') return;

  // Update window dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath,
  });

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath,
    });
  }
};

export const trackAddToCart = (product: Product, quantity: number = 1) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'INR',
      value: (product.offerPrice || product.price) * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.offerPrice || product.price,
          quantity: quantity,
        },
      ],
    },
  });
};

export const trackCheckoutBegin = (subtotal: number, itemCount: number) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'INR',
      value: subtotal,
      item_count: itemCount,
    },
  });
};

export const trackPurchase = (orderId: string, grandTotal: number, itemCount: number) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderId,
      value: grandTotal,
      currency: 'INR',
      item_count: itemCount,
    },
  });
};

export const trackPhoneCall = (source: string = 'header') => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'generate_lead',
    lead_type: 'phone_call',
    source: source,
  });
};

export const trackWhatsAppClick = (source: string = 'floating') => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'generate_lead',
    lead_type: 'whatsapp_chat',
    source: source,
  });
};
