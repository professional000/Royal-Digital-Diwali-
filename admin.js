
import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const SITE_ID = "royal-diwali-2026";

const loginBox = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const status = document.getElementById("status");

let allEvents = [];


/* LOGIN */

document.getElementById("loginForm")
.addEventListener("submit", async e => {

  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  status.textContent = "Checking login...";

  try {

    await signInWithEmailAndPassword(auth,email,password);

    status.textContent = "";

  } catch(error) {

    status.textContent = "Login failed: " + error.message;

  }

});


/* AUTH STATE */

onAuthStateChanged(auth, async user => {

  if(user) {

    loginBox.style.display = "none";
    dashboard.style.display = "block";

    await loadAnalytics();

  } else {

    loginBox.style.display = "block";
    dashboard.style.display = "none";

  }

});


/* LOAD ANALYTICS */

async function loadAnalytics() {

  status.textContent = "Loading analytics...";

  try {

    const q = query(
      collection(db,"events"),
      where("siteId","==",SITE_ID),
      orderBy("createdAt","desc"),
      limit(1000)
    );

    const snapshot = await getDocs(q);

    allEvents = snapshot.docs.map(doc => doc.data());

    renderDashboard();

    status.textContent = "Analytics loaded successfully.";

  } catch(error) {

    status.textContent = "Unable to load: " + error.message;

    console.error(error);

  }

}


/* DASHBOARD */

function renderDashboard() {

  const period = document.getElementById("period").value;

  let events = [...allEvents];

  if(period !== "all") {

    const cutoff = Date.now() - Number(period) * 86400000;

    events = events.filter(e =>
      e.createdAt &&
      e.createdAt.toMillis() >= cutoff
    );

  }

  const count = name =>
    events.filter(e => e.event === name).length;


  const visitors = new Set(
    events
      .filter(e => e.event === "page_view")
      .map(e => e.visitorId)
  ).size;


  document.getElementById("visitors").textContent = visitors;

  document.getElementById("visits").textContent =
    count("page_view");

  document.getElementById("opens").textContent =
    count("surprise_opened");

  document.getElementById("shares").textContent =
    count("whatsapp_share_clicked");

  document.getElementById("videos").textContent =
    count("video_played");

  document.getElementById("photos").textContent =
    count("photo_section_viewed");


  /* DEVICE REPORT */

  const deviceCounts = {};

  events.forEach(e => {

    const device = e.device || "Unknown";

    deviceCounts[device] =
      (deviceCounts[device] || 0) + 1;

  });

  document.getElementById("devices").textContent =
    Object.entries(deviceCounts)
      .map(([device,total]) => `${device}: ${total}`)
      .join(" | ") || "No data";


  /* RECENT ACTIVITY */

  const table = document.getElementById("activityTable");

  table.replaceChildren();

  events.slice(0,50).forEach(e => {

    const row = document.createElement("tr");

    const date = e.createdAt
      ? e.createdAt.toDate().toLocaleString()
      : "Pending";

    [e.event || "Unknown",e.device || "Unknown",date]
      .forEach(value => {

        const cell = document.createElement("td");

        cell.textContent = value;

        row.appendChild(cell);

      });

    table.appendChild(row);

  });

}


/* FILTER */

document.getElementById("period")
.addEventListener("change",renderDashboard);


/* REFRESH */

document.getElementById("refreshBtn")
.addEventListener("click",loadAnalytics);


/* LOGOUT */

document.getElementById("logoutBtn")
.addEventListener("click",async () => {

  await signOut(auth);

});
