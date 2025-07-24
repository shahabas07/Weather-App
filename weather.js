const apiKey = 'f93ffbca17455b070a7cb224e9c72125';
const defaultPlaceName = 'mangalore';

document.addEventListener('DOMContentLoaded', () => {
  fetchApi(defaultPlaceName);
});
document.addEventListener('keyup', (event) => {
  const placeName = event.target.value;
  fetchApi(placeName);
});
function fetchApi(placeName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      fetchData(data);
    })
    .catch((err) => {
      console.error('Error:', err);
    });
}
function fetchData(data) {
  const degree = (data.main.temp - 273.15).toFixed(2);
  const dayDate = formatDay(data.dt);
  const minTemp = (data.main.temp_min - 273.15).toFixed(2);
  const maxTemp = (data.main.temp_max - 273.15).toFixed(2);
  const desc = data.weather[0].description;
  document.querySelector('.place').textContent = data.name;
  document.getElementById('p').textContent = dayDate;
  document.querySelector('.temp').innerHTML = `${degree}&deg;C`;
  document.getElementById('cloud').textContent = desc;
  document.getElementById(
    'temparature'
  ).textContent = `${minTemp}\u00B0C / ${maxTemp}\u00B0C`;
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
