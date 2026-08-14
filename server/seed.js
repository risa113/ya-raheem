import dns from 'dns';
// Override DNS resolvers to Google Public DNS to resolve SRV records cleanly
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Coupon } from './models/Coupon.js';
import { Banner } from './models/Banner.js';
import { Review } from './models/Review.js';
import { Settings } from './models/Settings.js';
import { User } from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const INITIAL_CATEGORIES = [
  { id: 'mandi', name: 'Mandi', icon: '🍗', description: 'Traditional Arabian slow-cooked flavorful rice with succulent meat' },
  { id: 'biryani', name: 'Biryani', icon: '🍲', description: 'Aromatic Dum Biryani cooked with secret Tirunelveli spices' },
  { id: 'chicken', name: 'Chicken Dishes', icon: '🍖', description: 'Fried, roasted, and rich gravy chicken specials' },
  { id: 'shawarma', name: 'Shawarma & Rolls', icon: '🌯', description: 'Juicy layered shawarma wrapped in hot rumali parotta' },
  { id: 'burger', name: 'Burgers', icon: '🍔', description: 'Loaded night-owl burger towers with melted cheese' },
  { id: 'pizza', name: 'Pizza', icon: '🍕', description: 'Fresh wood-fired sourdough pizzas loaded with toppings' },
  { id: 'parotta', name: 'Parotta & Gravies', icon: '🥞', description: 'Flaky layered Kerala parotta served with spicy rich curry' },
  { id: 'noodles', name: 'Noodles & Rice', icon: '🍜', description: 'Wok-tossed spicy Indo-Chinese noodles and fried rice' },
  { id: 'sandwich', name: 'Sandwich', icon: '🥪', description: 'Toasted multi-layer midnight snack sandwiches' },
  { id: 'combo', name: 'Combos & Buckets', icon: '🍱', description: 'Value feast boxes for your midnight gang' },
  { id: 'drinks', name: 'Drinks & Desserts', icon: '🥤', description: 'Chilled sodas, shakes, and traditional sweet ends' },
];

const INITIAL_PRODUCTS = [
  {
    name: 'Special Chicken Mandi (Full)',
    description: 'Authentic Yemeni slow-cooked fragrant basmati rice served with tender juicy whole fried chicken, charred dry fruits, and red chili salsa.',
    category: 'mandi',
    price: 490,
    offerPrice: 420,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 25,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 2,
    prepTime: '25-30 mins',
    featured: true,
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    name: 'Royal Mutton Mandi',
    description: 'Mouth-melting shoulder piece mutton on a bed of rich ghee smoked aromatic mandi rice with special mint chutney.',
    category: 'mandi',
    price: 680,
    offerPrice: 590,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 15,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 2,
    prepTime: '30-35 mins',
    featured: true,
    rating: 4.95,
    reviewsCount: 98,
  },
  {
    name: 'Tirunelveli Beef Mandi',
    description: 'Slow-braised beef shanks spiced with traditional Tirunelveli midnight masala served with buttery mandi rice.',
    category: 'mandi',
    price: 520,
    offerPrice: 450,
    image: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 20,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 3,
    prepTime: '25-30 mins',
    featured: false,
    rating: 4.85,
    reviewsCount: 76,
  },
  {
    name: 'Hyderabad Dum Chicken Biryani',
    description: 'Classic Seeraga Samba basmati dum biryani with marinated juicy chicken, boiled egg, onion raita, and spicy brinjal salna.',
    category: 'biryani',
    price: 240,
    offerPrice: 199,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 40,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 2,
    prepTime: '15-20 mins',
    featured: true,
    rating: 4.8,
    reviewsCount: 310,
  },
  {
    name: 'Special Mutton Dum Biryani',
    description: 'Tender baby lamb cuts dum-cooked with pure ghee, mint leaves, and saffron rice. Served with spicy gravy.',
    category: 'biryani',
    price: 360,
    offerPrice: 320,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 18,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 2,
    prepTime: '20 mins',
    featured: true,
    rating: 4.9,
    reviewsCount: 205,
  },
  {
    name: 'Midnight Beef Biryani',
    description: 'Super spicy beef chunk biryani marinated in Melapalayam special spice blend with raita.',
    category: 'biryani',
    price: 260,
    offerPrice: 220,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 30,
    isVeg: false,
    popularBadge: false,
    spicyLevel: 3,
    prepTime: '15-20 mins',
    featured: false,
    rating: 4.75,
    reviewsCount: 160,
  },
  {
    name: 'Jumbo Cheese Chicken Shawarma',
    description: 'Shredded rotisserie chicken, garlic toum, pickles, and gooey melted mozzarella wrapped in fluffy rumali.',
    category: 'shawarma',
    price: 180,
    offerPrice: 149,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 50,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 1,
    prepTime: '10-15 mins',
    featured: true,
    rating: 4.88,
    reviewsCount: 420,
  },
  {
    name: 'Midnight Monster Chicken Burger',
    description: 'Double crunchy fried chicken patty, double cheddar slice, caramelized onions, smoked BBQ mayo on brioche bun.',
    category: 'burger',
    price: 230,
    offerPrice: 189,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 25,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 1,
    prepTime: '15 mins',
    featured: true,
    rating: 4.9,
    reviewsCount: 280,
  },
  {
    name: 'Fiery BBQ Chicken Pizza (12 inch)',
    description: 'Crispy hand-tossed crust, spicy chili sauce, shredded BBQ chicken, bell peppers, jalapeños & extra mozzarella.',
    category: 'pizza',
    price: 420,
    offerPrice: 350,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 20,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 2,
    prepTime: '20-25 mins',
    featured: true,
    rating: 4.82,
    reviewsCount: 195,
  },
  {
    name: 'Hot Kerala Parotta (3 Pcs)',
    description: 'Flaky multi-layered hot unleavened flatbread fried with ghee.',
    category: 'parotta',
    price: 60,
    offerPrice: 45,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 100,
    isVeg: true,
    popularBadge: true,
    spicyLevel: 0,
    prepTime: '10 mins',
    featured: false,
    rating: 4.9,
    reviewsCount: 510,
  },
  {
    name: 'Rich Butter Chicken Gravy',
    description: 'Smoky grilled chicken pieces simmered in rich creamy tomato cashew gravy flavored with kasuri methi.',
    category: 'parotta',
    price: 260,
    offerPrice: 220,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 30,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 1,
    prepTime: '15-20 mins',
    featured: true,
    rating: 4.92,
    reviewsCount: 310,
  },
  {
    name: 'Midnight Fuel Gang Box 🫂 (Feast for 3-4)',
    description: '1 Full Chicken Mandi + 1 Cheese Shawarma + 4 Kerala Parotta + 1 Portion Butter Chicken + 1L Chilled Cola.',
    category: 'combo',
    price: 1100,
    offerPrice: 899,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    availability: true,
    stock: 12,
    isVeg: false,
    popularBadge: true,
    spicyLevel: 2,
    prepTime: '30 mins',
    featured: true,
    rating: 5.0,
    reviewsCount: 88,
  }
];

const INITIAL_COUPONS = [
  {
    code: 'MIDNIGHT100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 399,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    timesUsed: 142,
    active: true,
  },
  {
    code: 'NIGHTOWL',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    expiryDate: '2026-12-31',
    usageLimit: 300,
    timesUsed: 89,
    active: true,
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas Cloud Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await Banner.deleteMany({});
    await Review.deleteMany({});
    await Settings.deleteMany({});
    await User.deleteMany({});

    // Seed collections
    await Category.insertMany(INITIAL_CATEGORIES);
    await Product.insertMany(INITIAL_PRODUCTS);
    await Coupon.insertMany(INITIAL_COUPONS);
    await Settings.create({});
    
    // Seed Admin and Customer users safely without deleting existing users
    const defaultUsers = [
      {
        fullName: 'Midnight Admin',
        phone: '9080139363',
        email: 'admin@midnightfuel.com',
        password: 'midnightfuels@123',
        role: 'admin',
      },
      {
        fullName: 'Mohamed Thariq',
        phone: '8608724931',
        email: 'mohamedthariq113@gmail.com',
        password: 'password123',
        role: 'customer',
      },
      {
        fullName: 'Mohamed Aslam',
        phone: '9080139364',
        email: 'aslam@gmail.com',
        password: 'password123',
        role: 'customer',
      },
      {
        fullName: 'Siddiq Rahman',
        phone: '9876543210',
        email: 'siddiq@gmail.com',
        password: 'password123',
        role: 'customer',
      }
    ];

    for (const u of defaultUsers) {
      const exists = await User.findOne({ phone: u.phone });
      if (!exists) {
        await User.create(u);
      }
    }

    console.log('🎉 Successfully seeded MongoDB Atlas Database with initial Midnight Fuel users & data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
    process.exit(1);
  }
}

seedDatabase();
