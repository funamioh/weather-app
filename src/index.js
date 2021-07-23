let now = new Date();
let currentTime = document.querySelector("#currentTime");

let hours = now.getHours();
let minutes = now.getMinutes();
minutes = ("0" + now.getMinutes()).slice(-2);

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let day = days[now.getDay()];
currentTime.innerHTML = `${day} ${hours}:${minutes}`;

function showWeatherCondition(response) {
  console.log(response);
  document.querySelector("#title-city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
}

function searchCity(city) {
  let apiKey = "730afeb398d3874cb3c0cb8d98df8b85";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeatherCondition);
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

function searchLocation(position) {
  let apiKey = "730afeb398d3874cb3c0cb8d98df8b85";
  let lati = position.coords.latitude;
  let longi = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Tokyo, Japan");
