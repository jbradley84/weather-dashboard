searchFormEl = document.querySelector("#search-form");
cityInputEl = document.querySelector("#search-city");

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

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
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=2c906a4a85e01e7cd8e82db1002bb787";

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            //console.log(response);
            response.json().then(function(data) {
                var cityName = data.name;
                var latEl = data.coord.lat;
                var lonEl = data.coord.lon

                // one call API 1.0
                var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lonEl + "&exclude=minutely,hourly,alerts&units=imperial&appid=2c906a4a85e01e7cd8e82db1002bb787";

                // make a get request to url
                fetch(oneCallUrl).then(function(response) {
                    // request was successful
                    if (response.ok) {
                        response.json().then(function(data) {
                            displayWeather(data, cityName);
                            displayFiveDay(data);
                            saveSearch(cityName, oneCallUrl);
                        })
                    }
                })
            })
        }
    })
}

//var displayWeather = function() {


//}

searchFormEl.addEventListener("submit", formSubmitHandler);