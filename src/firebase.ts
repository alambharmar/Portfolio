import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxiguxn9u-jXU0OYFegxUFlx5TJbJ6WIM",
  authDomain: "muhammad-alam-af6a6.firebaseapp.com",
  projectId: "muhammad-alam-af6a6",
  storageBucket: "muhammad-alam-af6a6.firebasestorage.app",
  messagingSenderId: "121576817621",
  appId: "1:121576817621:web:6966e403ad8b72fdd8b35c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
