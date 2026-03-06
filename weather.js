const apikey = "1fb61808e86b32c205d7f24d042a0741";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector(".weather-icon img");
const whole = document.querySelector(".whole");
const notifier = document.querySelector("#notifier");
const emptyPrompt = document.querySelector("#empty-prompt");

// ── Live clock ─────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById("current-time");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
updateClock();
setInterval(updateClock, 1000);

// ── Notifier helper ─────────────────────────────────────────────
function showNotifier(msg, type) {
  notifier.className = "notifier";
  notifier.textContent = msg;
  // Force reflow so animation re-triggers
  void notifier.offsetWidth;
  notifier.classList.add(type, "show");

  if (type === "success") {
    setTimeout(() => notifier.classList.remove("show"), 3000);
  }
}

// ── Weather icon map ────────────────────────────────────────────
function setWeatherIcon(condition) {
  const map = {
    Clouds: "images/clouds.png",
    Clear: "images/clear.png",
    Rain: "images/rain.png",
    Drizzle: "images/drizzle.png",
    Mist: "images/mist.png",
    Snow: "images/snow.png",
    Thunderstorm: "images/rain.png",
    Haze: "images/mist.png",
    Fog: "images/mist.png",
  };
  weatherIcon.src = map[condition] || "images/clear.png";
}

// ── Fetch weather ───────────────────────────────────────────────
async function fetchWeather(city) {
  if (!city.trim()) {
    showNotifier("⚠️ Please enter a city name.", "error");
    return;
  }

  try {
    const response = await fetch(apiurl + encodeURIComponent(city) + `&appid=${apikey}`);
    const data = await response.json();

    if (data.cod === "404") {
      showNotifier("⚠️ City not found. Please try again.", "error");
      return;
    }

    // Populate all fields
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";
    document.querySelector(".weather-desc").textContent = data.weather[0].description;
    document.querySelector(".feels-temp").textContent = Math.round(data.main.feels_like) + "°C";
    document.querySelector(".cond-label").textContent = data.weather[0].main;

    setWeatherIcon(data.weather[0].main);

    // Show weather section, hide empty prompt
    whole.style.display = "block";
    emptyPrompt.style.display = "none";

    showNotifier(`✅ Showing weather for ${data.name}`, "success");

  } catch (err) {
    showNotifier("⚠️ Network error. Check your connection.", "error");
  }
}

// ── Events ──────────────────────────────────────────────────────
searchBtn.addEventListener("click", () => fetchWeather(searchBox.value));
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchWeather(searchBox.value);
});

// ── Initial load ────────────────────────────────────────────────
fetchWeather("pondicherry");
