//display current date and time
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  if (hours < 10) {
  hours = `0${hours}`;
}
const minutes = date.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const weekDay = days[date.getDay()];
const currentMonth = months[date.getMonth()];
const currentDay = date.getDate();
return `${weekDay}, ${currentMonth} ${currentDay} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = date.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//fetch and display forecast data
function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  
  let forecastHTML = `<div class="weather-forecast" id="forecast">
                    <h2>Forecast for this week</h2>
                    <hr>
                    <div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
    forecastHTML = 
      forecastHTML +
      `
      <div class="col-2">
       <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
       <img class="below-weather-icon" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"">
       <div class="temperature"><span class="weather-forecast-temp-max">${Math.round(forecastDay.temp.max)}°</span> 
       <span class="weather-forecast-temp-min">${Math.round(forecastDay.temp.min)}°</span>
       </div>
       </div>`;
      console.log();
      minTemp = forecastDay.temp.min;
      maxTemp = forecastDay.temp.max;
  }
});
  

forecastHTML = forecastHTML + `</div>`;
forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "730afeb398d3874cb3c0cb8d98df8b85";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response);
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#title-city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#currentTime");
  let iconElement = document.querySelector("#icon");

  celsiusTemp = response.data.main.temp;
  

  temperatureElement.innerHTML = Math.round(celsiusTemp);
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute("src" , `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

//search current city weather by a city name
function searchCity(city) {
  let apiKey = "730afeb398d3874cb3c0cb8d98df8b85";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  let titleCity = document.querySelector("#title-city");
  titleCity.innerHTML = `${city}`;
  searchCity(city);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

//search current weather by current location
function searchLocation(position) {
  let apiKey = "730afeb398d3874cb3c0cb8d98df8b85";
  let lati = position.coords.latitude;
  let longi = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayTemperature);
}

//get user's current location
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Tokyo, Japan");

//convert temperature unit to fahrenheit
function convertToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round((celsiusTemp)*9/5+32);
  let forecastTempMin = document.querySelector("weather-forecast-temp-min");
  forecastTempMin.innerHTML = Math.round((minTemp)*9/5+32);
  let forecastTempMax = document.querySelector("weather-forecast-temp-max");
  forecastTempMax.innerHTML = Math.round((maxTemp)*9/5+32);

}

//convert temperature unit to celsius
function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  let forecastTempMin = document.querySelector("weather-forecast-temp-min");
  forecastTempMin.innerHTML = Math.round(minTemp);
  let forecastTempMax = document.querySelector("weather-forecast-temp-max");
  forecastTempMax.innerHTML = Math.round(maxTemp);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);
