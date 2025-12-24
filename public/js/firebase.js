import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyByzvvJAiG1VtvvFfJZadzyvv2NguXymb0",
  databaseURL: "https://on-spot-energy-cc5a4-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const batteryRef = ref(db, "batterySystem");

// DOM
const voltageEl = document.getElementById("voltage");
const currentEl = document.getElementById("current");
const powerEl = document.getElementById("power");
const tempEl = document.getElementById("temperature");
const batteryFill = document.getElementById("battery-fill");
const batteryText = document.getElementById("battery-text");
const healthBadge = document.getElementById("health-badge");

// Chart
const ctx = document.getElementById("voltageChart");
const voltageChart = new Chart(ctx, {
  type: "line",
  data: { labels: [], datasets: [{ data: [], borderWidth: 2 }] }
});

// Firebase listener
onValue(batteryRef, (snapshot) => {
  const d = snapshot.val();
  if (!d) return;

  voltageEl.innerText = d.voltage.toFixed(2) + " V";
  currentEl.innerText = d.current.toFixed(2) + " A";
  powerEl.innerText = d.power.toFixed(2) + " W";
  tempEl.innerText = d.temperature + " °C";

  batteryFill.style.width = d.batteryPercent + "%";
  batteryText.innerText = d.batteryPercent + "%";

  healthBadge.innerText = d.health;
  healthBadge.className = "badge " + (d.health === "Low" ? "low" : "good");

  voltageChart.data.labels.push(new Date().toLocaleTimeString());
  voltageChart.data.datasets[0].data.push(d.voltage);

  if (voltageChart.data.labels.length > 10) {
    voltageChart.data.labels.shift();
    voltageChart.data.datasets[0].data.shift();
  }

  voltageChart.update();
});
