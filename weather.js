const apiKey = 'f93ffbca17455b070a7cb224e9c72125';
const defaultPlaceName = 'mangalore';

document.addEventListener('DOMContentLoaded', () => {
  fetchWeather(defaultPlaceName);
});

document.getElementById('searchInput').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    fetchWeather(event.target.value.trim());
  }
});

function fetchWeather(placeName) {
  clearError();
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&appid=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then((data) => {
      renderWeather(data);
      fetchForecast(placeName);
    })
    .catch((err) => {
      showError('City not found or API error. Please try again.');
      clearWeather();
      clearForecast();
    });
}

function renderWeather(data) {
  const degree = (data.main.temp - 273.15).toFixed(2);
  const dayDate = formatDay(data.dt);
  const minTemp = (data.main.temp_min - 273.15).toFixed(2);
  const maxTemp = (data.main.temp_max - 273.15).toFixed(2);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  document.querySelector('.place').textContent = data.name;
  document.getElementById('p').textContent = dayDate;
  document.querySelector('.temp').innerHTML = `${degree}&deg;C`;
  document.getElementById('cloud').textContent = desc;
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
  document.getElementById('wind').textContent = `Wind: ${wind} m/s`;

  // Weather icon
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const iconImg = document.getElementById('weatherIcon');
  iconImg.src = iconUrl;
  iconImg.style.display = 'inline-block';
  iconImg.alt = desc;
}

function fetchForecast(placeName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${placeName}&appid=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) throw new Error('Forecast not found');
      return response.json();
    })
    .then((data) => {
      renderForecast(data);
    })
    .catch((err) => {
      clearForecast();
    });
}

function renderForecast(data) {
  // Group forecasts by day
  const forecastEl = document.getElementById('forecast');
  forecastEl.innerHTML = '';
  const dayMap = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 800);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    if (!dayMap[day]) {
      dayMap[day] = item;
    }
  });

  Object.keys(dayMap).slice(0, 5).forEach((day) => {
    const item = dayMap[day];
    const temp = (item.main.temp - 273.15).toFixed(1);
    const icon = item.weather[0].icon;
    const desc = item.weather[0].main;

    forecastEl.innerHTML += `
      <div class="forecast-card">
        <div>${day}</div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <div>${temp}&deg;C</div>
        <div>${desc}</div>
      </div>
    `;
  });
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
}
function clearError() {
  document.getElementById('errorMsg').textContent = '';
}
function clearWeather() {
  document.querySelector('.place').textContent = '';
  document.getElementById('p').textContent = '';
  document.querySelector('.temp').textContent = '';
  document.getElementById('cloud').textContent = '';
  document.getElementById('weatherIcon').style.display = 'none';
  document.getElementById('temparature').textContent = '';
  document.getElementById('humidity').textContent = '';
  document.getElementById('wind').textContent = '';
}
function clearForecast() {
  document.getElementById('forecast').innerHTML = '';
}
