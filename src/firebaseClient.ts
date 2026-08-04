import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
