
import { initializeApp } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AlzaSyD6s1OK_b0-V4A-t)dYDq_xZDnXACyYsx8",
  authDomain: "royal-digital-hub.firebaseapp.com",
  projectId: "royal-digital-hub",
  storageBucket: "royal-digital-hub.firebasestorage.app",
  messagingSenderId: "529367163614",
  appId: "1:529367163614"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
