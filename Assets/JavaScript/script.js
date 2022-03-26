"use strict";

var APIKey = "9d0b843a2f45164f9bd4e15bbb672b54";
if (localStorage.getItem("Preferred Units") == null) {
    localStorage.setItem("Preferred Units", "imperial");
}
var units = localStorage.getItem("Preferred Units");

function requestCity() {
    var city = document.querySelector(".search-bar div input").value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=" + APIKey + "&q=" + city + "&units=" + units;
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var cod = data.cod;
            var test = document.getElementById("test");
            if (cod == 400 || cod == 404) {
                test.textContent = "Unable to find city.";
            } else {
                test.textContent = data.main.temp.toString() + "°F";
            }
        });
}