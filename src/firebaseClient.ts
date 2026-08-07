import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, collection, doc, setDoc, updateDoc, 
  onSnapshot, getDocs, writeBatch 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDAYa-bqzSVq6xsWgc_TZzzpdRUI51GJEY',
  authDomain: 'midnight-fuels.firebaseapp.com',
  projectId: 'midnight-fuels',
  storageBucket: 'midnight-fuels.firebasestorage.app',
  messagingSenderId: '835629850034',
  appId: '1:835629850034:web:60b58a61ca1bbb9dd418ab',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Save order to Firebase Cloud database so all devices receive it instantly
export const saveOrderToFirebase = async (order: any) => {
  try {
    const orderId = order.id || order.orderNumber;
    await setDoc(doc(db, 'orders', orderId), order);
    console.log('🔥 Order saved to Firebase Cloud Firestore:', orderId);
  } catch (err) {
    console.warn('Firebase save order note:', err);
  }
};

// Update order status in Firebase Cloud database
export const updateOrderStatusInFirebase = async (orderId: string, status: string) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), { status });
    console.log('🔥 Order status updated in Firebase Cloud Firestore:', orderId, status);
  } catch (err) {
    console.warn('Firebase status update note:', err);
  }
};

// Listen to real-time order updates from Firebase Cloud database across all devices
export const subscribeOrdersFromFirebase = (onOrdersUpdate: (orders: any[]) => void) => {
  try {
    const ordersRef = collection(db, 'orders');
    return onSnapshot(ordersRef, (snapshot) => {
      const ordersList: any[] = [];
      snapshot.forEach(docSnap => {
        ordersList.push(docSnap.data());
      });
      onOrdersUpdate(ordersList);
    }, (error) => {
      console.warn('Firebase real-time subscription note:', error.message);
    });
  } catch (err) {
    console.warn('Firebase subscription error:', err);
    return () => {};
  }
};

// Clear all orders in Firebase Cloud database
export const clearAllOrdersFromFirebase = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    const batch = writeBatch(db);
    snapshot.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
    console.log('🔥 All orders cleared from Firebase Cloud Firestore');
  } catch (err) {
    console.warn('Firebase clear orders note:', err);
  }
};
