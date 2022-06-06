searchFormEl = document.querySelector("#search-form");
cityInputEl = document.querySelector("#search-city");

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = city.value.trim();

    if (city) {
        getWeatherInfo(city);

        // clear old content
        cityInputEl.value = "";

    } else {
        alert("Please enter city name to search.");
    }
};

var getWeatherInfo = function(location) {
    // format the OpenWeather API url
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=2c906a4a85e01e7cd8e82db1002bb787";

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            console.log(response);
        }
    })
}

searchFormEl.addEventListener("submit", formSubmitHandler);