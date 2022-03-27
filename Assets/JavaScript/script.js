let APIKey = "9d0b843a2f45164f9bd4e15bbb672b54";
if (localStorage.getItem("Preferred Units") == null) {
    localStorage.setItem("Preferred Units", "imperial");
}
let submitBtnEl = document.getElementById("submitBtn");
let unitsBtnEl = document.getElementById("units");

function requestCity(event) {
    event.preventDefault();
    let city = document.querySelector(".search-bar form input").value;
    let latlonURL = "http://api.openweathermap.org/geo/1.0/direct?appid=" + APIKey + "&q=" + city;
    fetch(latlonURL)
        .then(function (response) {
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
                    console.log(data)
                    let test = document.getElementById("test");

                    test.textContent = data.daily[0].temp.day.toString() + "°";
                });
            }
            // let cod = data.cod;
            // let test = document.getElementById("test");
            // if (cod == 400 || cod == 404) {
            //     test.textContent = "Unable to find city.";
            // } else {
            //     test.textContent = data.main.temp.toString() + "°F";
            // }
        });
}

function changeUnits() {
    let units = localStorage.getItem("Preferred Units");
    if (units === "imperial") {
        localStorage.setItem("Preferred Units", "metric");
        unitsBtnEl.innerHTML = "°F/<strong>°C</strong>";
    } else {
        localStorage.setItem("Preferred Units", "imperial");
        unitsBtnEl.innerHTML = "<strong>°F</strong>/°C";
    }
}

submitBtnEl.addEventListener("click", requestCity);