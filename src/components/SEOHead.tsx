import React, { useEffect } from 'react';
import { CustomerTab, Product } from '../types';
import { trackPageView } from '../utils/analytics';

interface SEOHeadProps {
  customerTab: CustomerTab;
  activeProductDetail?: Product | null;
}

interface PageSeoConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  robots: string;
  ogImage: string;
  breadcrumbs: { name: string; item: string }[];
}

export const getSeoConfigForTab = (tab: CustomerTab, activeProduct?: Product | null): PageSeoConfig => {
  const baseUrl = 'https://midnightfuel.in';

  if (activeProduct) {
    return {
      title: `${activeProduct.name} | MidnightFuelss Tirunelveli Food Delivery`,
      description: `Order ${activeProduct.name} online from MidnightFuelss Melapalayam. ${activeProduct.description.slice(0, 140)}... Delivered hot till 2 AM in Tirunelveli.`,
      keywords: `${activeProduct.name}, ${activeProduct.category} delivery Tirunelveli, MidnightFuelss ${activeProduct.name}, order food Melapalayam`,
      canonicalPath: `/#product-${activeProduct.id}`,
      robots: 'index, follow',
      ogImage: activeProduct.image,
      breadcrumbs: [
        { name: 'Home', item: `${baseUrl}/` },
        { name: 'Menu', item: `${baseUrl}/#menu` },
        { name: activeProduct.name, item: `${baseUrl}/#product-${activeProduct.id}` },
      ],
    };
  }

  switch (tab) {
    case 'home':
      return {
        title: 'MidnightFuelss | Late Night Food Delivery in Tirunelveli | Mandi & Biryani',
        description: 'Order Mandi, Dum Biryani, Shawarma, Pizza, Fried Chicken, and Burgers from MidnightFuelss in Melapalayam, Tirunelveli. Delivered piping hot until 2:00 AM every night.',
        keywords: 'MidnightFuelss, food delivery in Tirunelveli, late night food delivery Tirunelveli, midnight food delivery Tirunelveli, food delivery in Melapalayam, Mandi in Tirunelveli, Biryani delivery Tirunelveli, chicken Mandi Tirunelveli, beef Mandi Tirunelveli',
        canonicalPath: '/',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [{ name: 'Home', item: `${baseUrl}/` }],
      };

    case 'menu':
      return {
        title: 'Full Gourmet Menu | MidnightFuelss Tirunelveli | Mandi, Biryani & Fast Food',
        description: 'Browse MidnightFuelss menu: Arabian Mandi, Hyderabadi Dum Biryani, Cheese Shawarma, Monster Burgers & Wood-Fired Pizza. Express 25-min night delivery in Tirunelveli.',
        keywords: 'MidnightFuelss menu, Mandi prices Tirunelveli, Biryani menu Melapalayam, shawarma price Tirunelveli, late night menu Tirunelveli',
        canonicalPath: '/#menu',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Menu', item: `${baseUrl}/#menu` },
        ],
      };

    case 'mandi-tirunelveli':
      return {
        title: 'Best Arabian Mandi in Tirunelveli | MidnightFuelss Mandi Delivery',
        description: 'Authentic slow-cooked Yemeni Chicken Mandi, Royal Mutton Mandi, and Tirunelveli Beef Mandi. Fresh ghee basmati with spicy red salsa delivered till 2 AM in Melapalayam.',
        keywords: 'Mandi in Tirunelveli, best Mandi Tirunelveli, chicken Mandi Tirunelveli, mutton Mandi Tirunelveli, beef Mandi Melapalayam, Mandi delivery near me',
        canonicalPath: '/#mandi-tirunelveli',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Arabian Mandi Tirunelveli', item: `${baseUrl}/#mandi-tirunelveli` },
        ],
      };

    case 'biryani-tirunelveli':
      return {
        title: 'Hyderabadi Dum Biryani Delivery in Tirunelveli | MidnightFuelss',
        description: 'Seeraga Samba & Basmati Dum Chicken Biryani, Mutton Biryani, and Spicy Beef Biryani in Melapalayam, Tirunelveli. Hot delivery with raita & salna until 2 AM.',
        keywords: 'Biryani delivery Tirunelveli, best biryani in Melapalayam, late night biryani Tirunelveli, dum biryani Tirunelveli, chicken biryani Melapalayam',
        canonicalPath: '/#biryani-tirunelveli',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Biryani Delivery Tirunelveli', item: `${baseUrl}/#biryani-tirunelveli` },
        ],
      };

    case 'midnight-food-tirunelveli':
      return {
        title: 'Late Night Midnight Food Delivery in Tirunelveli (7 PM – 2 AM)',
        description: 'Hungry at midnight? MidnightFuelss delivers fresh Mandi, Biryani, Shawarma, Burgers, and Shakes till 2 AM across Melapalayam, Palayamkottai, and Tirunelveli Town.',
        keywords: 'midnight food delivery Tirunelveli, 2 am food delivery Tirunelveli, late night food near me, night owl food Melapalayam, late night restaurant Tirunelveli',
        canonicalPath: '/#midnight-food-tirunelveli',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Late Night Food Tirunelveli', item: `${baseUrl}/#midnight-food-tirunelveli` },
        ],
      };

    case 'food-delivery-melapalayam':
      return {
        title: 'Food Delivery in Melapalayam 627005 | MidnightFuelss Kitchen',
        description: 'Fastest 20-minute food delivery in Melapalayam Bazar, High Ground, and surrounding areas. Mandi, Dum Biryani, and Grilled Fast Food delivered till 2:00 AM.',
        keywords: 'food delivery in Melapalayam, restaurant in Melapalayam 627005, Melapalayam biryani delivery, Melapalayam Mandi, late night Melapalayam food',
        canonicalPath: '/#food-delivery-melapalayam',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Food Delivery Melapalayam', item: `${baseUrl}/#food-delivery-melapalayam` },
        ],
      };

    case 'shawarma-tirunelveli':
      return {
        title: 'Juicy Chicken Shawarma Delivery in Tirunelveli | MidnightFuelss',
        description: 'Shredded rotisserie chicken wrapped in rumali parotta with garlic toum, pickles, and melted mozzarella cheese. Delivered fresh till 2 AM in Melapalayam.',
        keywords: 'shawarma delivery Tirunelveli, chicken shawarma Melapalayam, cheese shawarma Tirunelveli, rumali roll Tirunelveli',
        canonicalPath: '/#shawarma-tirunelveli',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Shawarma Tirunelveli', item: `${baseUrl}/#shawarma-tirunelveli` },
        ],
      };

    case 'pizza-tirunelveli':
      return {
        title: 'Late Night Pizza Delivery in Tirunelveli | MidnightFuelss',
        description: 'Crispy wood-fired sourdough pizzas loaded with BBQ chicken, jalapeños, and extra mozzarella cheese. Order hot pizza till 2:00 AM in Melapalayam.',
        keywords: 'pizza delivery Tirunelveli, late night pizza Melapalayam, chicken pizza Tirunelveli, 2 am pizza Tirunelveli',
        canonicalPath: '/#pizza-tirunelveli',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Pizza Tirunelveli', item: `${baseUrl}/#pizza-tirunelveli` },
        ],
      };

    case 'fried-chicken-tirunelveli':
      return {
        title: 'Crispy Fried Chicken & Burgers in Tirunelveli | MidnightFuelss',
        description: 'Double patty brioche chicken burgers and crispy tandoori fried chicken pieces delivered piping hot till 2 AM in Melapalayam & Tirunelveli.',
        keywords: 'burger delivery Tirunelveli, fried chicken Melapalayam, crispy chicken burger Tirunelveli, midnight burger Tirunelveli',
        canonicalPath: '/#fried-chicken-tirunelveli',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Burgers & Fried Chicken', item: `${baseUrl}/#fried-chicken-tirunelveli` },
        ],
      };

    case 'offers':
      return {
        title: 'Fresh Food Menu & Online Ordering | Midnight Cravings Tirunelveli',
        description: 'Order authentic Mandi, Dum Biryani, Shawarmas & Fast Food in Tirunelveli & Melapalayam.',
        keywords: 'food delivery Tirunelveli, mandi Melapalayam, biryani delivery',
        canonicalPath: '/#menu',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Menu', item: `${baseUrl}/#menu` },
        ],
      };

    case 'faq':
      return {
        title: 'Frequently Asked Questions (FAQ) | MidnightFuelss Tirunelveli',
        description: 'Answers to popular questions about MidnightFuelss opening hours (7 PM – 2 AM), delivery areas in Tirunelveli, 100% Halal certification, and payment methods.',
        keywords: 'MidnightFuelss FAQ, MidnightFuelss opening hours, Halal food Tirunelveli, Melapalayam delivery areas',
        canonicalPath: '/#faq',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'FAQ', item: `${baseUrl}/#faq` },
        ],
      };

    case 'contact':
    case 'about':
      return {
        title: 'About & Contact Kitchen | MidnightFuelss Melapalayam Tirunelveli',
        description: 'Contact MidnightFuelss kitchen located at Bazar, Near Meera Broilers, Melapalayam, Tirunelveli - 627005. Call +91 90801 39363 for midnight food delivery.',
        keywords: 'MidnightFuelss contact number, MidnightFuelss address Melapalayam, restaurant near Meera Broilers Melapalayam',
        canonicalPath: `/#${tab}`,
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: tab === 'about' ? 'About Us' : 'Contact Kitchen', item: `${baseUrl}/#${tab}` },
        ],
      };

    case 'sitemap':
      return {
        title: 'HTML Sitemap | MidnightFuelss Tirunelveli Food Delivery',
        description: 'Complete index of all food categories, dish pages, location guides, and customer support pages for MidnightFuelss in Tirunelveli & Melapalayam.',
        keywords: 'MidnightFuelss sitemap, all pages MidnightFuelss, food delivery index Tirunelveli',
        canonicalPath: '/#sitemap',
        robots: 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: 'Sitemap', item: `${baseUrl}/#sitemap` },
        ],
      };

    case 'orders':
    case 'wishlist':
    case 'privacy-policy':
    case 'terms':
    default:
      const safeTabStr = tab ? String(tab) : 'home';
      const formattedTitle = safeTabStr.charAt(0).toUpperCase() + safeTabStr.slice(1).replace(/-/g, ' ');
      return {
        title: `${formattedTitle} | MidnightFuelss Tirunelveli`,
        description: 'MidnightFuelss - Premier late night food delivery destination in Melapalayam & Tirunelveli.',
        keywords: 'MidnightFuelss Tirunelveli',
        canonicalPath: `/#${safeTabStr}`,
        robots: safeTabStr === 'orders' || safeTabStr === 'wishlist' ? 'noindex, follow' : 'index, follow',
        ogImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80',
        breadcrumbs: [
          { name: 'Home', item: `${baseUrl}/` },
          { name: formattedTitle, item: `${baseUrl}/#${safeTabStr}` },
        ],
      };
  }
};

export const SEOHead: React.FC<SEOHeadProps> = ({ customerTab, activeProductDetail }) => {
  useEffect(() => {
    try {
      const seoConfig = getSeoConfigForTab(customerTab, activeProductDetail);
      if (seoConfig && seoConfig.title) {
        document.title = seoConfig.title;
      }
    } catch (err) {
      // Ignore
    }
  }, [customerTab, activeProductDetail]);

  return null;
};
