const APIKey = "9d0b843a2f45164f9bd4e15bbb672b54";
if (localStorage.getItem("Preferred Units") === null) {
    localStorage.setItem("Preferred Units", "imperial");
}
if (localStorage.getItem("recents") === null) {
    localStorage.setItem("recents", "[]");
}
const units = localStorage.getItem("Preferred Units");
const submitBtnEl = document.getElementById("submit-btn");
const unitsBtnEl = document.getElementById("units");
let degreeLetter = "";
let degLetterEls = document.querySelectorAll(".tempLetter");
let windSpeedEls = document.querySelectorAll(".speed");
const forecastEl = document.getElementById("forecast");
const recentDivEl = document.getElementById("recent-cities");

function setUnits(units) {
    let degree = "";
    let speed = "";
    degLetterEls = document.querySelectorAll(".tempLetter");
    windSpeedEls = document.querySelectorAll(".speed");

    if (units === "imperial") {
        unitsBtnEl.innerHTML = "<strong>°F</strong>/°C";
        degreeLetter = "F";
    } else {
        unitsBtnEl.innerHTML = "°F/<strong>°C</strong>";
        degreeLetter = "C";
    }

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
        const container = document.createElement("div");
        const dateEl = document.createElement("h2");
        const day = moment.unix(data.daily[i + 1].dt).format("MM/DD/YYYY");
        const imgHolderEl = document.createElement("div");
        const forecastImgEl = document.createElement("img");
        const weatherStatus = data.daily[i + 1].weather[0].main;
        const weatherID = data.daily[i + 1].weather[0].id;
        const tempEl = document.createElement("h4");
        const windEl = document.createElement("h4");
        const humidityEl = document.createElement("h4");

        switch(weatherStatus) {
            case "Thunderstorm":
                forecastImgEl.src = "./Assets/Images/11d.png";
                break;
            case "Drizzle":
                forecastImgEl.src = "./Assets/Images/10d.png";
                break;
            case "Rain":
                forecastImgEl.src = "./Assets/Images/09d.png";
                break;
            case "Snow":
                forecastImgEl.src = "./Assets/Images/13d.png";
                break;
            case "Clear":
                forecastImgEl.src = "./Assets/Images/01d.png";
                break;
            case "Clouds":
                if (weatherID === 801) {
                    forecastImgEl.src = "./Assets/Images/02d.png";
                } else if (weatherID === 802) {
                    forecastImgEl.src = "./Assets/Images/03d.png";
                } else if (weatherID === 803 || weatherID === 804) {
                    forecastImgEl.src = "./Assets/Images/04d.png";
                }
                break;
            default:
                forecastImgEl.src = "./Assets/Images/50d.png";
        }

        forecastImgEl.classList.add("forecast-icon");
        container.classList.add("day");
        container.classList.add("flex-column");
        imgHolderEl.style = "text-align: center;";

        

        dateEl.textContent = day;
        tempEl.textContent = "Temp: " + data.daily[i + 1].temp.day + "°" + unitLetters[0];
        windEl.textContent = "Wind: " + data.daily[i + 1].wind_speed + " " + unitLetters[1];
        humidityEl.textContent = "Humidity: " + data.daily[i + 1].humidity + "%";

        container.appendChild(dateEl);
        container.appendChild(imgHolderEl);
        imgHolderEl.appendChild(forecastImgEl);
        container.appendChild(tempEl);
        container.appendChild(windEl);
        container.appendChild(humidityEl);
        forecastEl.appendChild(container);
    }
}

function saveCity(cityName) {
    const recentsStr = localStorage.getItem("recents");
    const recents = JSON.parse(recentsStr);
    if (!recents.includes(cityName)) {
        recents.unshift(cityName);
        if (recents.length > 10) {
            recents.pop();
        }
        localStorage.setItem("recents", JSON.stringify(recents));
    }
}

function requestCity(event) {
    event.preventDefault();
    const city = document.querySelector(".search-bar form input").value;
    fetchWeatherData(city);
}

function fetchWeatherData(city) {
    const latlonURL = "http://api.openweathermap.org/geo/1.0/direct?appid=" + APIKey + "&q=" + city;
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
                saveCity(data[0].name);
                weatherURL = "https://api.openweathermap.org/data/2.5/onecall?appid="+APIKey+"&lat="+data[0].lat+"&lon="+data[0].lon+"&units="+units;
                fetch(weatherURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        const cityNameEl = document.getElementById("current-city");
                        const dateEl = document.getElementById("current-date");
                        const tempEl = document.getElementById("current-temp");
                        const speedEl = document.getElementById("current-wind");
                        const humidityEl = document.getElementById("current-humidity");
                        const UVEl = document.getElementById("current-UV");

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

function loadRecents() {
    const recents = JSON.parse(localStorage.getItem("recents"));

    for (let i=0; i < recents.length; i++) {
        const buttonEl = document.createElement("button");

        buttonEl.classList.add("submit-btn", "recent");

        buttonEl.textContent = recents[i];

        recentDivEl.appendChild(buttonEl);
    }
}

function loadPage() {
    fetch("http://ip-api.com/json/")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            fetchWeatherData(data.city);
        })
}

loadRecents();
loadPage();
setUnits(units);
submitBtnEl.addEventListener("click", requestCity);