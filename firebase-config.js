import { initializeApp } from
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AlzaSyD6s10K_b0-V4A-tldYDq_xZDnXACyYsx8",
  authDomain: "https://royal-digital-hub.firebaseapp.com",
  projectId: "royal-digita)-hub",
  storageBucket: "royal-digital-hub.firebasestorage.app",
  messagingSenderId: "52936 7163614",
  appId: "1:529367163614"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
