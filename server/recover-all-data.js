import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyDAYa-bqzSVq6xsWgc_TZzzpdRUI51GJEY",
  authDomain: "midnight-fuels.firebaseapp.com",
  projectId: "midnight-fuels",
  storageBucket: "midnight-fuels.firebasestorage.app",
  messagingSenderId: "835629850034",
  appId: "1:835629850034:web:60b58a61ca1bbb9dd418ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MONGODB_URI = process.env.MONGODB_URI;

async function recoverAllData() {
  try {
    console.log('Connecting to MongoDB Atlas Cloud Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');

    // Define Mongoose models
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

    // 1. Recover Orders from Firebase
    console.log('Checking Firebase Firestore for Orders...');
    const ordersSnap = await getDocs(collection(db, 'orders'));
    console.log(`Found ${ordersSnap.size} orders in Firebase.`);
    let restoredOrdersCount = 0;
    for (const docSnap of ordersSnap.docs) {
      try {
        const orderData = docSnap.data();
        delete orderData._id;
        const orderId = orderData.id || orderData.orderNumber || docSnap.id;
        const exists = await Order.findOne({ $or: [{ id: orderId }, { orderNumber: orderId }] });
        if (!exists) {
          await Order.create(orderData);
          restoredOrdersCount++;
        }
      } catch (e) {
        console.warn('Order restore note:', e.message);
      }
    }
    console.log(`✅ Restored ${restoredOrdersCount} orders into MongoDB Atlas.`);

    // 2. Recover Users from Firebase
    console.log('Checking Firebase Firestore for Users...');
    const usersSnap = await getDocs(collection(db, 'users'));
    console.log(`Found ${usersSnap.size} users in Firebase.`);
    let restoredUsersCount = 0;
    for (const docSnap of usersSnap.docs) {
      try {
        const userData = docSnap.data();
        delete userData._id;
        console.log('Firebase User document:', userData);
        const phone = userData.phone ? userData.phone.replace(/[\s\-\+\(\)]/g, '') : null;
        if (phone) {
          const exists = await User.findOne({ phone: new RegExp(phone + '$', 'i') });
          if (!exists) {
            await User.create(userData);
            restoredUsersCount++;
          }
        }
      } catch (e) {
        console.warn('User restore note:', e.message);
      }
    }
    console.log(`✅ Restored ${restoredUsersCount} users into MongoDB Atlas.`);

    // Print all users currently in MongoDB
    const allMongoUsers = await User.find({});
    console.log(`\n--- ALL ${allMongoUsers.length} USERS IN MONGODB ATLAS ---`);
    console.log(JSON.stringify(allMongoUsers, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Recovery error:', err);
    process.exit(1);
  }
}

recoverAllData();
