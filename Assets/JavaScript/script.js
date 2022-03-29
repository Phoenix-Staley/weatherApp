let APIKey = "9d0b843a2f45164f9bd4e15bbb672b54";
if (localStorage.getItem("Preferred Units") == null) {
    localStorage.setItem("Preferred Units", "imperial");
}
let units = localStorage.getItem("Preferred Units");
let submitBtnEl = document.getElementById("submit-btn");
let unitsBtnEl = document.getElementById("units");
let degreeLetter = "";
let degLetterEls = document.querySelectorAll(".tempLetter");
let windSpeedEls = document.querySelectorAll(".speed");
let forecastEl = document.getElementById("forecast");

if (units === "imperial") {
    unitsBtnEl.innerHTML = "<strong>°F</strong>/°C";
    degreeLetter = "F";
} else {
    unitsBtnEl.innerHTML = "°F/<strong>°C</strong>";
    degreeLetter = "C";
}

function setUnits(units) {
    let degree = "";
    let speed = "";
    degLetterEls = document.querySelectorAll(".tempLetter");
    windSpeedEls = document.querySelectorAll(".speed");
    console.log(degLetterEls);
    if (units === "metric") {
        degree = "C";
        speed = "KPH";
    } else if (units === "imperial") {
        degree = "F";
        speed = "MPH";
    }
    for (let i=0; i < degLetterEls.length; i++) {
        degLetterEls[i].textContent = degree;
        windSpeedEls[i].textContent = speed;
    }
}

function loadForecast(data) {
    let unitLetters = [];
    if (units === "imperial") {
        unitLetters = ["F", "MPH"];
    } else {
        unitLetters = ["C", "KPH"];
    }

    forecastEl.innerHTML = "";

    for (let i=0; i<5; i++) {
        var container = document.createElement("div");
        var dateEl = document.createElement("h2");
        var day = moment.unix(data.daily[i + 1].dt).format("MM/DD/YYYY");
        var tempEl = document.createElement("h4");
        var windEl = document.createElement("h4");
        var humidityEl = document.createElement("h4");

        container.classList.add("day");
        container.classList.add("flex-column");

        dateEl.textContent = day;
        tempEl.textContent = "Temp: " + data.daily[i + 1].temp.day + "°" + unitLetters[0];
        windEl.textContent = "Wind: " + data.daily[i + 1].wind_speed + " " + unitLetters[1];
        humidityEl.textContent = "Humidity: " + data.daily[i + 1].humidity + "%";

        container.appendChild(dateEl);
        container.appendChild(tempEl);
        container.appendChild(windEl);
        container.appendChild(humidityEl);
        forecastEl.appendChild(container);
    }
}

function requestCity(event) {
    event.preventDefault();
    let city = document.querySelector(".search-bar form input").value;
    // let splitCity = city.split("");
    // for (let i=0; i < splitCity.length; i++) {
    //     if (splitCity[i] === " ") {
    //         splitCity[i] = "_";
    //     }
    // }
    // city = splitCity.join("");
    fetchWeatherData(city);
}

function fetchWeatherData(city) {
    let latlonURL = "http://api.openweathermap.org/geo/1.0/direct?appid=" + APIKey + "&q=" + city;
    console.log(latlonURL);
    fetch(latlonURL)
        .then(function (response) {
            if (response.status === 400) {
                alert("Enter a city name");
            }
            return response.json();
        })
        .then(function (data) {
            if (data.length === 0) {
                alert("Enter a valid city name");
            } else {
                weatherURL = "https://api.openweathermap.org/data/2.5/onecall?appid="+APIKey+"&lat="+data[0].lat+"&lon="+data[0].lon+"&units="+units;
                fetch(weatherURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        let cityNameEl = document.getElementById("current-city");
                        let dateEl = document.getElementById("current-date");
                        let tempEl = document.getElementById("current-temp");
                        let speedEl = document.getElementById("current-wind");
                        let humidityEl = document.getElementById("current-humidity");
                        let UVEl = document.getElementById("current-UV");

                        cityNameEl.textContent = city;
                        dateEl.textContent = moment().format("MM/DD/YYYY");
                        tempEl.textContent = data.current.temp.toString();
                        speedEl.textContent = data.current.wind_speed.toString();
                        humidityEl.textContent = data.current.humidity.toString();
                        UVEl.textContent = data.current.uvi.toFixed(2);

                        loadForecast(data);
                    });
            }
        });
}

function changeUnits() {
    if (units === "imperial") {
        localStorage.setItem("Preferred Units", "metric");
    } else if (units === "metric") {
        localStorage.setItem("Preferred Units", "imperial");
    }
    location.reload();
}

function loadPage() {
    fetch("http://ip-api.com/json/")
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            fetchWeatherData(data.city);
        })
}

loadPage();
setUnits(units);
submitBtnEl.addEventListener("click", requestCity);