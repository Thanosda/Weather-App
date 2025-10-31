const apikey = "1fb61808e86b32c205d7f24d042a0741";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon img");
const whole = document.querySelector(".whole");
const notifier = document.querySelector(".notifier"); 

async function fetchWeather(city) {
  const response = await fetch(apiurl + city + `&appid=${apikey}`);
  const data = await response.json();

  
  notifier.className = "notifier"; 

  if (data.cod === "404") {
    
    notifier.textContent = "⚠️ Invalid city name. Please try again.";
    notifier.classList.add("error", "show");
    whole.style.display = "none";
    return;
  }

  
  notifier.textContent = `✅ Weather updated for ${data.name}`;
  notifier.classList.add("success", "show");


  setTimeout(() => {
    notifier.classList.remove("show");
  }, 3000);


  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

 
  if (data.weather[0].main === "Clouds") {
    weatherIcon.src = "images/clouds.png";
  } else if (data.weather[0].main === "Clear") {
    weatherIcon.src = "images/clear.png";
  } else if (data.weather[0].main === "Rain") {
    weatherIcon.src = "images/rain.png";
  } else if (data.weather[0].main === "Drizzle") {
    weatherIcon.src = "images/drizzle.png";
  } else if (data.weather[0].main === "Mist") {
    weatherIcon.src = "images/mist.png";
  }

  whole.style.display = "block";
}

searchBtn.addEventListener("click", () => fetchWeather(searchBox.value));
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchWeather(searchBox.value);
});

fetchWeather("Delhi");
