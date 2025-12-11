import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDoxuBFalvBVBUg26VKdpOEXoGNTDkE1Cc",
    authDomain: "bet-tracking-90ea3.firebaseapp.com",
    projectId: "bet-tracking-90ea3",
    storageBucket: "bet-tracking-90ea3.firebasestorage.app",
    messagingSenderId: "909663245986",
    appId: "1:909663245986:web:4d4631c4e8dced9e4be9fb",
    measurementId: "G-LHBB4KRXT0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;


