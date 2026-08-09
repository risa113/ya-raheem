import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

interface PageSeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  schema?: object;
}

export const SeoManager: React.FC = () => {
  const { customerTab, viewMode, adminTab } = useStore();

  useEffect(() => {
    let metadata: PageSeoMetadata = {
      title: 'Midnight Cravings | Late Night Food Delivery & Catering in Tirunelveli',
      description: 'Order authentic Mandi, Biryani, Shawarma, Pizza, Fried Chicken, Burgers and Catering in Melapalayam & Tirunelveli. Late-night food delivery till 2 AM.',
      keywords: 'Midnight Cravings Tirunelveli, food delivery in Tirunelveli, late night food delivery Tirunelveli, catering in Tirunelveli, Mandi in Tirunelveli, biryani delivery Tirunelveli, food delivery Melapalayam',
      canonical: 'https://midnightfuel.in/',
      ogTitle: 'Midnight Cravings | Late Night Food Delivery & Catering in Tirunelveli',
      ogDescription: 'Tirunelveli #1 Late Night Food & Catering Service. Royal Arabian Mandi, dum biryani & gourmet food delivered hot until 2 AM in Melapalayam.',
    };

    if (viewMode === 'admin') {
      metadata = {
        title: `Admin Suite - ${adminTab.toUpperCase()} | Midnight Fuel Management`,
        description: 'Restricted operational admin portal for Midnight Fuel kitchen management, orders, menu catalog, and analytics.',
        keywords: 'admin suite, kitchen management, food delivery dashboard',
        canonical: `https://midnightfuel.in/#admin-${adminTab}`,
        ogTitle: `Admin Suite - ${adminTab} | Midnight Fuel`,
        ogDescription: 'Kitchen and order management system.',
      };
    } else {
      switch (customerTab) {
        case 'catering-tirunelveli':
          metadata = {
            title: 'Catering Services in Tirunelveli & Melapalayam | Arabian Mandi & Biryani Catering',
            description: 'Tirunelveli #1 Mandi & Biryani Catering Service for Weddings, Parties, Sunnat Feasts, and Events. Live Cooking Stations, Arabian Thaal Platter setup & 100% Halal Bulk Orders.',
            keywords: 'catering in Tirunelveli, mandi catering Tirunelveli, biryani catering Melapalayam, marriage mandi catering Tirunelveli, bulk food order Tirunelveli, event catering Melapalayam, non veg catering Tirunelveli, wedding catering Melapalayam',
            canonical: 'https://midnightfuel.in/#catering-tirunelveli',
            ogTitle: 'Arabian Mandi & Dum Biryani Catering Services in Tirunelveli',
            ogDescription: 'Grand Wedding Feasts, Sunnat Platter Mandi, & Event Bulk Orders in Tirunelveli & Melapalayam. Get Instant Quote on WhatsApp!',
            schema: {
              "@context": "https://schema.org",
              "@type": "CateringService",
              "name": "Midnight Fuel Arabian Mandi & Biryani Catering",
              "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80",
              "telephone": "+919080139363",
              "url": "https://midnightfuel.in/#catering-tirunelveli",
              "priceRange": "₹₹",
              "servesCuisine": ["Arabian Mandi", "Hyderabadi Dum Biryani", "Grill & Shawarma", "Wedding Catering"],
              "areaServed": [
                { "@type": "AdministrativeArea", "name": "Melapalayam, Tirunelveli" },
                { "@type": "AdministrativeArea", "name": "Palayamkottai, Tirunelveli" },
                { "@type": "AdministrativeArea", "name": "Tirunelveli Town" },
                { "@type": "AdministrativeArea", "name": "Vannarpettai" },
                { "@type": "AdministrativeArea", "name": "High Ground" }
              ],
              "provider": {
                "@type": "LocalBusiness",
                "name": "Midnight Fuel",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Bazar, Near Meera Broilers",
                  "addressLocality": "Melapalayam",
                  "addressRegion": "Tirunelveli",
                  "postalCode": "627005",
                  "addressCountry": "IN"
                }
              }
            }
          };
          break;

        case 'mandi-tirunelveli':
          metadata = {
            title: 'Best Arabian Mandi in Tirunelveli | Chicken, Beef & Mutton Mandi Delivery',
            description: 'Order authentic Yemeni Chicken Mandi, Royal Mutton Mandi, and Beef Mandi in Melapalayam & Tirunelveli. Cooked fresh over charcoal, served with garlic toum & red salsa till 2 AM.',
            keywords: 'Mandi in Tirunelveli, Mandi biryani Tirunelveli, chicken Mandi Tirunelveli, beef Mandi Tirunelveli, mutton Mandi Tirunelveli, mandi home delivery Melapalayam',
            canonical: 'https://midnightfuel.in/#mandi-tirunelveli',
            ogTitle: 'Best Arabian Mandi in Tirunelveli | Midnight Delivery',
            ogDescription: 'Yemeni Charcoal-Cooked Mandi delivered hot to your door in 25 mins until 2 AM.',
          };
          break;

        case 'biryani-tirunelveli':
          metadata = {
            title: 'Hyderabadi Dum Biryani Delivery in Tirunelveli & Melapalayam | Late Night',
            description: 'Order piping hot Hyderabadi Dum Biryani, Seeraga Samba Mutton Biryani, and Beef Biryani in Tirunelveli. Freshly cooked, 100% Halal certified.',
            keywords: 'biryani delivery Tirunelveli, Hyderabadi biryani Melapalayam, chicken biryani Tirunelveli, mutton biryani Melapalayam, midnight biryani Tirunelveli',
            canonical: 'https://midnightfuel.in/#biryani-tirunelveli',
            ogTitle: 'Hyderabadi Dum Biryani Delivery in Tirunelveli',
            ogDescription: 'Rich aromatic dum biryani with raita & brinjal curry delivered till 2 AM.',
          };
          break;

        case 'midnight-food-tirunelveli':
          metadata = {
            title: 'Late Night Food Delivery in Tirunelveli (7 PM - 2 AM) | Midnight Fuel',
            description: 'Hungry at 1 AM in Tirunelveli? Order hot Mandi, Biryani, Shawarma, Pizza, Fried Chicken & Shakes until 2 AM. 20-min express delivery in Melapalayam & Palayamkottai.',
            keywords: 'late night food delivery Tirunelveli, midnight food delivery Tirunelveli, 2am food delivery Melapalayam, night food order Tirunelveli',
            canonical: 'https://midnightfuel.in/#midnight-food-tirunelveli',
            ogTitle: 'Tirunelveli #1 Late Night Food Delivery Service (Till 2 AM)',
            ogDescription: 'Piping hot food delivered when the city sleeps. Order online now!',
          };
          break;

        case 'food-delivery-melapalayam':
          metadata = {
            title: 'Food Delivery in Melapalayam Tirunelveli | Top Non-Veg Restaurant',
            description: 'Fastest 20-minute food delivery in Melapalayam (627005). Mandi, Biryani, Shawarma, Burgers & Shakes. 100% Halal certified.',
            keywords: 'food delivery in Melapalayam, late night food Melapalayam, restaurant in Melapalayam Tirunelveli, non veg food delivery Melapalayam',
            canonical: 'https://midnightfuel.in/#food-delivery-melapalayam',
            ogTitle: 'Food Delivery in Melapalayam Tirunelveli (627005)',
            ogDescription: 'Order your favorite Melapalayam non-veg dishes with instant live GPS tracking.',
          };
          break;

        case 'shawarma-tirunelveli':
          metadata = {
            title: 'Juicy Chicken & Beef Shawarma Delivery in Tirunelveli | Melapalayam',
            description: 'Order jumbo Rumali Shawarma, Plate Shawarma, Cheese Loaded Shawarma & Mexican Shawarma in Tirunelveli & Melapalayam. Made with 100% whole meat & garlic toum.',
            keywords: 'shawarma delivery Tirunelveli, chicken shawarma Melapalayam, beef shawarma Tirunelveli, rumali shawarma Tirunelveli',
            canonical: 'https://midnightfuel.in/#shawarma-tirunelveli',
            ogTitle: 'Jumbo Chicken & Beef Shawarma in Tirunelveli',
            ogDescription: 'Freshly carved spit-roasted shawarmas delivered hot in 20 minutes.',
          };
          break;

        case 'pizza-tirunelveli':
          metadata = {
            title: 'Hot Pizza Delivery in Tirunelveli | Midnight Fuel Pizzeria',
            description: 'Crispy hand-tossed Peri Peri Chicken Pizza, BBQ Chicken Pizza & Cheesy Double Crust Pizza delivered until 2 AM in Tirunelveli & Melapalayam.',
            keywords: 'pizza delivery Tirunelveli, late night pizza Melapalayam, chicken pizza Tirunelveli',
            canonical: 'https://midnightfuel.in/#pizza-tirunelveli',
            ogTitle: 'Hot Pizza Delivery in Tirunelveli & Melapalayam',
            ogDescription: 'Loaded with 100% mozzarella cheese & fresh toppings. Order now!',
          };
          break;

        case 'fried-chicken-tirunelveli':
          metadata = {
            title: 'Crispy Fried Chicken & Smash Burgers Delivery in Tirunelveli',
            description: 'Golden crunchy fried chicken buckets, spicy wings, and jumbo smash burgers delivered hot in Tirunelveli & Melapalayam.',
            keywords: 'fried chicken Tirunelveli, kfc style chicken Melapalayam, burger delivery Tirunelveli',
            canonical: 'https://midnightfuel.in/#fried-chicken-tirunelveli',
            ogTitle: 'Crispy Fried Chicken & Burgers in Tirunelveli',
            ogDescription: 'Crispy extra crunchy chicken buckets delivered till 2 AM.',
          };
          break;

        case 'menu':
          metadata = {
            title: 'Full Gourmet Menu | Mandi, Biryani, Shawarma, Pizza | Midnight Fuel',
            description: 'Browse the complete Midnight Fuel menu. Arabian Mandi, Hyderabadi Dum Biryani, Shawarmas, Pizzas, Burgers & Desserts in Melapalayam Tirunelveli.',
            keywords: 'midnight fuel menu, mandi price Tirunelveli, biryani menu Melapalayam',
            canonical: 'https://midnightfuel.in/#menu',
            ogTitle: 'Midnight Fuel Gourmet Food Menu',
            ogDescription: 'Explore our delicious 100% Halal menu items and order online.',
          };
          break;

        case 'offers':
          metadata = {
            title: 'Fresh Food Menu & Online Ordering | Midnight Fuel Tirunelveli',
            description: 'Order Mandi, Biryani, Shawarmas, Burgers and Late Night Food in Melapalayam & Tirunelveli.',
            keywords: 'food delivery Tirunelveli, mandi Melapalayam, biryani Tirunelveli',
            canonical: 'https://midnightfuel.in/#menu',
            ogTitle: 'Fresh Food Menu | Midnight Fuel Tirunelveli',
            ogDescription: 'Order hot delicious meals online for delivery across Melapalayam & Tirunelveli.',
          };
          break;

        case 'faq':
          metadata = {
            title: 'Frequently Asked Questions (FAQ) | Midnight Fuel Tirunelveli',
            description: 'Answers about our 2 AM food delivery, Halal certification, delivery areas in Melapalayam & Tirunelveli, and payment options.',
            keywords: 'midnight fuel faq, food delivery timing Tirunelveli, halal certification Melapalayam',
            canonical: 'https://midnightfuel.in/#faq',
            ogTitle: 'Midnight Fuel FAQ & Customer Support',
            ogDescription: 'Get answers to all questions regarding late night food delivery & orders.',
          };
          break;
      }
    }

    // Update document title
    document.title = metadata.title;

    // Update or create Meta Tags
    const updateMetaTag = (name: string, content: string, property: boolean = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', metadata.description);
    updateMetaTag('keywords', metadata.keywords);
    updateMetaTag('og:title', metadata.ogTitle, true);
    updateMetaTag('og:description', metadata.ogDescription, true);
    updateMetaTag('twitter:title', metadata.ogTitle);
    updateMetaTag('twitter:description', metadata.ogDescription);

    // Update Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', metadata.canonical);

    // Update Schema JSON-LD if provided
    let schemaScript = document.querySelector('#dynamic-seo-schema') as HTMLScriptElement;
    if (metadata.schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-seo-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(metadata.schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

  }, [customerTab, viewMode, adminTab]);

  return null;
};
