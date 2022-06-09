searchFormEl = document.querySelector("#search-form");
cityInputEl = document.querySelector("#search-city");
cityBtnEl = document.querySelector("#searchHistory");
forecastTodayEl = document.querySelector("#forecast");
fiveDayEl = document.querySelector("#fiveDay");

var searchIdCounter;


// function to dynamically create city buttons based on localStorage data 
var savedCityBtn = function () {
    // if localStorage has data, do this
    if (localStorage) {
        // loop through localStorage and create a button for each key/value pair
        for (let i = 0; i < localStorage.length; i++) {
            var savedObject = localStorage.getItem([i]).replaceAll('"', "");
            // create the city button by index value
            var citySearchBtn = document.createElement("button");
            citySearchBtn.classList.add("w-full");
            citySearchBtn.setAttribute("id", savedObject);
            citySearchBtn.textContent = savedObject;
            cityBtnEl.appendChild(citySearchBtn);
        }
    }
}


// function to take form search input and feed it into getLatLon 
var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();
    // if input receieves value, submit to function
    if (city) {
        getLatLon(city);
        // clear old content
        cityInputEl.value = "";


        // if search button clicked with no input, alert user
    } else {
        alert("Please enter city name to search.");
    }
};


// function to get latitude and longitude of searched input
var getLatLon = function (location) {
    // format the OpenWeather API url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=2c906a4a85e01e7cd8e82db1002bb787";
    // make a get request to url
    fetch(apiUrl).then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function (data) {
                // create variable based on value of input (aka city name)
                var cityName = data.name;
                // save searched value to localStorage
                saveSearch(cityName);
                // create variable for latitude and longitude
                var latEl = data.coord.lat;
                var lonEl = data.coord.lon;
                // feed latitude and longitude into getWeather function
                getWeather(latEl, lonEl, cityName);
            })
        }
    })
}


// function to get the weather from OneCall API 1.0
var getWeather = function (latEl, lonEl, cityName) {
    oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latEl + "&lon=" + lonEl + "&exclude=minutely,hourly,alerts&units=imperial&appid=2c906a4a85e01e7cd8e82db1002bb787";
    // make a get request to url
    fetch(oneCallUrl).then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data, cityName);
                displayFiveDay(data);
                addNewCityBtn(cityName);
            })
        }
    })
}


// function to save searched city name to localStorage
var saveSearch = function (cityName) {
    searchHistory = cityName
    //if (typeof searchIdCounter === "undefined") {
    if (searchIdCounter === "undefined") {
        searchIdCounter = 0;
    } else {
        searchIdCounter = localStorage.length;
    }
    // add searchHistory object to localStorage with key of searchIdCounter
    localStorage.setItem(searchIdCounter, JSON.stringify(searchHistory));
    // increment searchIdCounter
    searchIdCounter++;
    //console.log(localStorage);
}


// function to add new city button after search
var addNewCityBtn = function (cityName) {
    var citySearchBtn = document.createElement("button");
    citySearchBtn.classList.add("w-full");
    citySearchBtn.setAttribute("id", cityName);
    citySearchBtn.textContent = cityName;
    cityBtnEl.appendChild(citySearchBtn);
}


// function to display weather based on city button click
var resubmitSearch = function (event) {
    // capture button click by id and feed id into getLatLon function
    getLatLon(event.target.id);
}


// function to display current weather in selected city
var displayWeather = function (data, cityName) {
    console.log(data);
    // create container for current weather display
    var sectionEl = document.createElement("section");
    forecastTodayEl.appendChild(sectionEl);

    // create div element to flex city/date/img
    var weatherGlance = document.createElement("div");
    weatherGlance.classList.add("flex");
    sectionEl.appendChild(weatherGlance);

    // create h2 "city" element to append to sectionEl
    var h2CityEl = document.createElement("h2");
    h2CityEl.textContent = cityName;
    weatherGlance.appendChild(h2CityEl);

    var todaysDate = document.createElement("h2");
    // convert unix timestamp into milliseconds
    var timestamp = data.current.dt * 1000;
    // create date object
    date = new Date(timestamp);
    todaysDate.textContent = date.toLocaleString("en-US", {month: "numeric", day: "numeric", year: "numeric"});
    weatherGlance.appendChild(todaysDate);

    var iconUrl = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    var currentWeatherIcon = document.createElement("img");
    currentWeatherIcon.setAttribute("src", iconUrl);
    weatherGlance.appendChild(currentWeatherIcon);
    

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


    // create div element to flex pUvIndexEl and uviColor together
    var uviGlance = document.createElement("div");
    uviGlance.classList.add("flex");
    sectionEl.appendChild(uviGlance);

    var pUvIndexEl = document.createElement("p");
    pUvIndexEl.textContent = "UV Index:";
    uviGlance.appendChild(pUvIndexEl);

    var uviColor = document.createElement("p");
    uviColor.textContent = data.current.uvi;
    if (data.current.uvi <= "2") {
        uviColor.classList.add("bg-green-400");
    } else if (data.current.uvi <= "5") {
        uviColor.classList.add("bg-yellow-400");
    } else if (data.current.uvi <= "7") {
        uviColor.classList.add("bg-orange-400");
    } else {
        uviColor.classList.add("bg-red-400");
    }
    uviGlance.appendChild(uviColor);   
}



// function to display 5-day forecast of selected city
var displayFiveDay = function (data) {

    var fiveDayContainer = document.createElement("div");
    fiveDayContainer.classList.add("w-full", "flex", "-mx-4");
    fiveDayEl.appendChild(fiveDayContainer);

    var fiveDayLoop = data.daily.slice(1, 6);
    // loop through daily forecast array
    for (let i = 0; i < fiveDayLoop.length; i++) {
        // create five-day forecast cards
        var forecastCard = document.createElement("article");
        forecastCard.classList.add("flex-1", "mb-4", "px-4", "bg-green-500", "max-w-sm", "rounded", "overflow-hidden", "shadow-lg");
        fiveDayContainer.appendChild(forecastCard);

        // create p elements to append to forecastCard
        var fiveDate = document.createElement("h4");
        // convert unix timestamp into milliseconds
        var timestamp = fiveDayLoop[i].dt * 1000;
        // create date object
        date = new Date(timestamp);
        fiveDate.textContent = date.toLocaleString("en-US", {month: "numeric", day: "numeric", year: "numeric"});
        forecastCard.appendChild(fiveDate);

        // create image elements to append forecastCard
        var iconUrl = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        var currentWeatherIcon = document.createElement("img");
        currentWeatherIcon.setAttribute("src", iconUrl);
        forecastCard.appendChild(currentWeatherIcon);

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

savedCityBtn();

searchFormEl.addEventListener("submit", formSubmitHandler);
cityBtnEl.addEventListener("click", resubmitSearch);