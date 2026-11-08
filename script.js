
import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const CONFIG = {
  defaultName: "Dear Friend",
  siteId: "royal-diwali-2026"
};

const welcomeScreen = document.getElementById("welcomeScreen");
const mainContent = document.getElementById("mainContent");
const guestName = document.getElementById("guestName");
const displayName = document.getElementById("displayName");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let currentName = CONFIG.defaultName;

function getStoredId(key, storage) {
  try {
    let value = storage.getItem(key);

    if (!value) {
      value = crypto.randomUUID();
      storage.setItem(key, value);
    }

    return value;
  } catch {
    return crypto.randomUUID();
  }
}

const visitorId = getStoredId("royal_visitor_id", localStorage);
const sessionId = getStoredId("royal_session_id", sessionStorage);

function getDevice() {
  const ua = navigator.userAgent;

  if (/tablet|ipad/i.test(ua)) return "Tablet";
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";

  return "Desktop";
}


/* TRACK EVENTS */

async function trackEvent(eventName) {

  const allowedEvents = [
    "page_view",
    "surprise_opened",
    "whatsapp_share_clicked",
    "photo_section_viewed",
    "video_played",
    "video_completed"
  ];

  if (!allowedEvents.includes(eventName)) return;

  try {
    await addDoc(collection(db, "events"), {
      event: eventName,
      siteId: CONFIG.siteId,
      visitorId,
      sessionId,
      device: getDevice(),
      page: location.pathname,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Tracking error:", error);
  }
}

trackEvent("page_view");


/* OPEN SURPRISE */

document.getElementById("openBtn").addEventListener("click", async () => {

  currentName = guestName.value.trim() || CONFIG.defaultName;

  displayName.textContent = currentName;

  welcomeScreen.classList.add("hidden");
  mainContent.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });

  trackEvent("surprise_opened");

  startFireworks();

  playMusic();

});


/* MUSIC */

async function playMusic() {
  try {
    await bgMusic.play();
    musicBtn.textContent = "🔊 Music ON";
  } catch (error) {
    musicBtn.textContent = "🔇 Tap for Music";
  }
}

musicBtn.addEventListener("click", async () => {

  if (bgMusic.paused) {
    await playMusic();
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🔇 Music OFF";
  }

});


/* WHATSAPP SHARE */

function shareDiwaliWish() {

  const message = `🪔 Happy Diwali ${currentName}! ❤️

இனிய தீபாவளி நல்வாழ்த்துக்கள்!

May your life shine with happiness,
love and prosperity.

உங்கள் வாழ்க்கையில் மகிழ்ச்சி,
அன்பு மற்றும் செல்வம் நிறைந்திருக்கட்டும்!

Open your special Diwali surprise:
${location.href}

With Love,
ROYAL DIGITAL HUB ❤️`;

  const url = "https://wa.me/?text=" + encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");

  trackEvent("whatsapp_share_clicked");

}

document.getElementById("shareBtn")
  .addEventListener("click", shareDiwaliWish);

document.getElementById("finalShareBtn")
  .addEventListener("click", shareDiwaliWish);


/* PHOTO TRACKING */

const photoSection = document.querySelector(".memories-section");

if (photoSection && "IntersectionObserver" in window) {

  let photoTracked = false;

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting && !photoTracked) {

        photoTracked = true;
        trackEvent("photo_section_viewed");
        observer.disconnect();

      }

    });

  }, { threshold: 0.3 });

  observer.observe(photoSection);

}


/* VIDEO TRACKING */

const video = document.getElementById("memoryVideo");

if (video) {

  video.addEventListener("play", () => {
    trackEvent("video_played");
  });

  video.addEventListener("ended", () => {
    trackEvent("video_completed");
  });

}


/* FIREWORKS */

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let particles = [];
let animationRunning = false;
let fireworkInterval = null;

function resizeCanvas() {

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


function createFirework(x, y) {

  const colors = [
    "#ffd700",
    "#ff69b4",
    "#ffffff",
    "#a970ff",
    "#ff9933"
  ];

  const color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 55; i++) {

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: Math.random() * 0.012 + 0.008,
      color,
      size: Math.random() * 3 + 1
    });

  }

}


function animateFireworks() {

  if (!animationRunning) return;

  ctx.clearRect(0, 0, innerWidth, innerHeight);

  particles.forEach(p => {

    p.x += p.vx;
    p.y += p.vy;

    p.vy += 0.035;
    p.vx *= 0.99;

    p.alpha -= p.decay;

    if (p.alpha > 0) {

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

    }

  });

  ctx.globalAlpha = 1;

  particles = particles.filter(p => p.alpha > 0);

  requestAnimationFrame(animateFireworks);

}


function startFireworks() {

  if (!animationRunning) {
    animationRunning = true;
    animateFireworks();
  }

  createFirework(innerWidth / 2, innerHeight / 3);

  if (fireworkInterval) return;

  fireworkInterval = setInterval(() => {

    if (particles.length < 350) {
      createFirework(
        Math.random() * innerWidth,
        Math.random() * innerHeight * 0.55
      );
    }

  }, 900);

  setTimeout(() => {
    clearInterval(fireworkInterval);
    fireworkInterval = null;
  }, 30000);

}


document.getElementById("celebrateBtn")
  .addEventListener("click", () => {

    for (let i = 0; i < 5; i++) {

      setTimeout(() => {
        createFirework(
          Math.random() * innerWidth,
          Math.random() * innerHeight * 0.5
        );
      }, i * 250);

    }

  });

console.log("ROYAL DIGITAL HUB - Diwali Tracking Ready");
