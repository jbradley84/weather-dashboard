searchFormEl = document.querySelector("#search-form");
cityInputEl = document.querySelector("#search-city");
cityBtnEl = document.querySelector("#searchHistory");
forecastTodayEl = document.querySelector("#forecast");
fiveDayEl = document.querySelector("#fiveDay");
cityHistory = [];

var searchIdCounter;


var formSubmitHandler = function (event) {
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

var getWeatherInfo = function (location) {
    // format the OpenWeather API url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=2c906a4a85e01e7cd8e82db1002bb787";

    // make a get request to url
    fetch(apiUrl).then(function (response) {
        // request was successful
        if (response.ok) {

            response.json().then(function (data) {

                var cityName = data.name;

                var latEl = data.coord.lat;

                var lonEl = data.coord.lon;


                // one call API 1.0
                var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl +
                    "&lon=" + lonEl + "&exclude=minutely,hourly,alerts&units=imperial&appid=2c906a4a85e01e7cd8e82db1002bb787";

                // make a get request to url
                fetch(oneCallUrl).then(function (response) {
                    // request was successful
                    if (response.ok) {
                        response.json().then(function (data) {
                            displayWeather(data, cityName);
                            displayFiveDay(data);
                            saveSearch(cityName, oneCallUrl);
                            generateBtn();
                        })
                    }
                })
            })
        }
    })
}


var saveSearch = function (cityName, oneCallUrl) {
    // create an object out of cityName and oneCallUrl
    searchHistory = {
        city: cityName,
        api: oneCallUrl
    };
    if (typeof searchIdCounter === "undefined") {
        searchIdCounter = 0;
    }
    

    // add searchHistory object to localStorage with key of searchIdCounter
    localStorage.setItem(searchIdCounter, JSON.stringify(searchHistory.city));
    // increment searchIdCounter
    searchIdCounter++;
    //console.log(localStorage);
}


var generateBtn = function () {
    // if cityName is generated in getWeatherInfo, create a button
    if (localStorage) {
        //console.log(localStorage);
        // loop through localStorage and create a button for each key/value pair
        for (let i = 0; i < localStorage.length; i++) {
            var key = i;
            var savedObject = localStorage.getItem(key)
            console.log(savedObject);
            //console.log(savedObject.city);
            //var citySearchBtn = document.createElement("button");
            
            //btnText = JSON.parse(localStorage.getItem([i].city));
            //console.log(btnText);
            //citySearchBtn.textContent = btnText;
            //cityBtnEl.appendChild(citySearchBtn);
        }

        
        //citySearchBtn.textContent = cityName;
        //cityBtnEl.appendChild(citySearchBtn);
    }

}


var displayWeather = function (data, cityName) {
    // create container for current weather display
    var sectionEl = document.createElement("section");
    forecastTodayEl.appendChild(sectionEl);

    // create h2 element to append to sectionEl
    var h2El = document.createElement("h2");
    h2El.textContent = cityName;
    sectionEl.appendChild(h2El);

    // create p elements to append to sectionEl
    var pTempEl = document.createElement("p");
    pTempEl.textContent = "Temp: " + data.current.temp + "\u00B0 F";
    sectionEl.appendChild(pTempEl);

    var pWindEl = document.createElement("p");
    pWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    sectionEl.appendChild(pWindEl);

    var pHumidityEl = document.createElement("p");
    pHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    sectionEl.appendChild(pHumidityEl);

    var pUvIndexEl = document.createElement("p");
    pUvIndexEl.textContent = "UV Index: " + data.current.uvi;
    sectionEl.appendChild(pUvIndexEl);
}

var displayFiveDay = function (data) {

    var fiveDayContainer = document.createElement("div");
    fiveDayContainer.classList.add("w-full", "flex", "-mx-4");
    fiveDayEl.appendChild(fiveDayContainer);

    var fiveDayLoop = data.daily.slice(0, 5);
    // loop through daily forecast array
    for (let i = 0; i < fiveDayLoop.length; i++) {
        // create five-day forecast cards
        var forecastCard = document.createElement("article");
        forecastCard.classList.add("flex-1", "mb-4", "px-4", "bg-green-500", "max-w-sm", "rounded", "overflow-hidden", "shadow-lg");
        fiveDayContainer.appendChild(forecastCard);

        // create p elements to append to forecastCard
        /*var fiveDate = document.createElement("h4");
        let date = new Date(fiveDayLoop[i].dt);
        let format = {year: "numeric", month: "numeric", day: "numeric"};
        console.log(date);
        let dateFormat = date.toLocaleDateString(undefined, format);
        console.log(dateFormat);
        //fiveDate.textContent = toLocaleDateString(fiveDayLoop[i].dt);
        forecastCard.appendChild(fiveDate);*/

        var fiveTemp = document.createElement("p");
        fiveTemp.textContent = fiveDayLoop[i].temp.day + "\u00B0 F";
        forecastCard.appendChild(fiveTemp);

        var fiveWind = document.createElement("p");
        fiveWind.textContent = fiveDayLoop[i].wind_speed + " MPH";
        forecastCard.appendChild(fiveWind);

        var fiveHumidity = document.createElement("p");
        fiveHumidity.textContent = fiveDayLoop[i].humidity + "%";
        forecastCard.appendChild(fiveHumidity);
    }

}

generateBtn();

searchFormEl.addEventListener("submit", formSubmitHandler);