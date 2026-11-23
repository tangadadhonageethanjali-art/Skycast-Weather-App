const cityInput = document.getElementById("city");
const locBtn = document.getElementById("locBtn");

const iconEl = document.getElementById("icon");
const tempEl = document.getElementById("temp");
const cityNameEl = document.getElementById("cityName");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsEl = document.getElementById("feels");
const visEl = document.getElementById("vis");

function getWeather(code) {
  if (code === 0) return ["☀️", "Sunny", "Clear skies"];
  if (code <= 2) return ["🌤️", "Clouds", "Partly cloudy"];
  if (code === 3) return ["☁️", "Clouds", "Overcast"];
  if (code === 45 || code === 48) return ["🌫️", "Fog", "Foggy"];
  if (code >= 51 && code <= 57) return ["🌦️", "Drizzle", "Light drizzle"];
  if (code >= 61 && code <= 67) return ["🌧️", "Rain", "Rainy"];
  if (code >= 71 && code <= 77) return ["❄️", "Snow", "Snowfall"];
  if (code >= 80 && code <= 82) return ["🌧️", "Rain", "Rain showers"];
  if (code >= 95) return ["⛈️", "Thunderstorm", "Thunderstorm"];
  return ["🌤️", "Weather", "Normal weather"];
}

async function getWeatherByCoords(lat, lon, name) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility` +
    `&timezone=auto`;

  const response = await fetch(url);
  const data = await response.json();
  const c = data.current;

  const [icon, main, text] = getWeather(c.weather_code);

  iconEl.textContent = icon;
  tempEl.textContent = Math.round(c.temperature_2m) + "°C";
  cityNameEl.textContent = name;
  descEl.textContent = "Today • " + main + " • " + text;
  humidityEl.textContent = c.relative_humidity_2m + "%";
  windEl.textContent = Math.round(c.wind_speed_10m) + " km/h";
  feelsEl.textContent = Math.round(c.apparent_temperature) + "°C";
  visEl.textContent = Math.round(c.visibility / 1000) + " km";
}

async function searchCity(city) {
  city = city.trim();
  if (city === "") {
    descEl.textContent = "Please enter a city name";
    return;
  }

  try {
    descEl.textContent = "Loading...";
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      descEl.textContent = "City not found. Try again.";
      return;
    }

    const place = geoData.results[0];
    await getWeatherByCoords(place.latitude, place.longitude, place.name);
  } catch (error) {
    descEl.textContent = "Something went wrong. Check internet.";
  }
}

cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") searchCity(cityInput.value);
})
locBtn.addEventListener("click", function () {
  if (!navigator.geolocation) {
    descEl.textContent = "Location not supported";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      getWeatherByCoords(pos.coords.latitude, pos.coords.longitude, "My Location");
    },
    function () {
      descEl.textContent = "Location permission denied";
    }
  );
});


searchCity("Kurnool");