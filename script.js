let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let now = new Date();
document.querySelector("#date").innerHTML = formatDate(now);

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

function displayWeatherCondition(response) {
  document.querySelector("#cityAndTime").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = `&#x26C5;${Math.round(
    response.data.main.temp
  )}°C`;
  document.querySelector(
    "#precipitation"
  ).innerHTML = `Precipitation: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed * 3.6
  )}km/h`;

  // Call forecast API and display forecast
  displayForecast(response.data.coord);
}

function displayForecast(coordinates) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;

  axios.get(forecastApiUrl).then(function (response) {
    let forecastContainer = document.querySelector("#forecast");
    let forecastHTML = '<div class="forecast-row">';

    for (let i = 1; i <= 7; i++) {
      let forecastData = response.data.daily[i];
      let forecastDate = new Date(forecastData.dt * 1000);
      let dayOfWeek = days[forecastDate.getDay()];
      let iconCode = forecastData.weather[0].icon;
      let maxTemp = Math.round(forecastData.temp.max);
      let minTemp = Math.round(forecastData.temp.min);

      forecastHTML += `
        <div class="forecast-day">
          <div class="forecast-day-of-week">${dayOfWeek}</div>
          <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
          <div class="forecast-temperatures">
            <span class="forecast-max">${maxTemp}°C</span>
            <span class="forecast-min">${minTemp}°C</span>
          </div>
        </div>
      `;
    }

    forecastHTML += "</div>";
    forecastContainer.innerHTML = forecastHTML;
  });
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// Call the searchCity function at the end to initially display the weather
searchCity("Port Harcourt");
