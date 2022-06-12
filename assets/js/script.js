var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#search-city");
var cityBtnEl = document.querySelector("#searchHistory");
var forecastTodayEl = document.querySelector("#forecast");
var fiveDayEl = document.querySelector("#fiveDay");
var searchIdCounter;


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
                // need this to not run if button already exists
               var btnId=document.getElementById(cityName)
               if(!btnId){
                addNewCityBtn(cityName)}
                /*else {
                    alert('this city has been searched already')
                };*/
            })
        }
    })
}


// function to display current weather in selected city
var displayWeather = function (data, cityName) {
    forecastTodayEl.innerHTML = "";
    // create container for current weather display
    var sectionEl = document.createElement("section");
    forecastTodayEl.appendChild(sectionEl);

    // create div element to flex city/date/img
    var weatherGlance = document.createElement("div");
    weatherGlance.classList.add("flex", "space-x-2", "content-end");
    sectionEl.appendChild(weatherGlance);

    // city in weatherGlance
    var h2CityEl = document.createElement("h2");
    h2CityEl.classList.add("text-3xl", "font-semibold", "h-20", "pt-10");
    h2CityEl.textContent = cityName;
    weatherGlance.appendChild(h2CityEl);

    // date in weatherGlance
    var todaysDate = document.createElement("h2");
    // convert unix timestamp into milliseconds
    var timestamp = data.current.dt * 1000
    // create date object
    date = new Date(timestamp);
    todaysDate.textContent = date.toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric"});
    todaysDate.classList.add("text-3xl", "font-semibold", "h-20", "pt-10");
    weatherGlance.appendChild(todaysDate);

    // icon in weatherGlance
    var iconUrl = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    var currentWeatherIcon = document.createElement("img");
    currentWeatherIcon.setAttribute("src", iconUrl);
    currentWeatherIcon.classList.add("h-20");
    weatherGlance.appendChild(currentWeatherIcon);

    // create p elements to append to sectionEl
    var pTempEl = document.createElement("p");
    pTempEl.textContent = "Temp: " + data.current.temp + "\u00B0 F";
    pTempEl.classList.add("text-lg", "font-semibold", "py-1");
    var pWindEl = document.createElement("p");
    pWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    pWindEl.classList.add("text-lg", "font-semibold", "py-1");
    var pHumidityEl = document.createElement("p");
    pHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    pHumidityEl.classList.add("text-lg", "font-semibold", "py-1");
    // create div element to flex pUvIndexEl and uviColor together
    var uviGlance = document.createElement("div");
    uviGlance.classList.add("flex", "space-x-1", "text-lg", "font-semibold", "py-1");
    // append temp,wind,humidity,uvi to sectionEl
    sectionEl.append(pTempEl, pWindEl, pHumidityEl, uviGlance);

    var pUvIndexEl = document.createElement("p");
    pUvIndexEl.textContent = "UV Index:";
    uviGlance.appendChild(pUvIndexEl);
    var uviColor = document.createElement("p");
    uviColor.textContent = data.current.uvi;
    if (data.current.uvi <= "2") {
        uviColor.classList.add("bg-green-400", "px-1", "rounded", "text-center", "w-12");
    } else if (data.current.uvi <= "5") {
        uviColor.classList.add("bg-yellow-400", "px-1", "rounded", "text-center", "w-12");
    } else if (data.current.uvi <= "7") {
        uviColor.classList.add("bg-orange-400", "px-1", "rounded", "text-center", "w-12");
    } else {
        uviColor.classList.add("bg-red-400", "px-1", "rounded", "text-center", "w-12");
    }
    uviGlance.appendChild(uviColor);
}


// function to display 5-day forecast of selected city
var displayFiveDay = function (data) {
    fiveDayEl.innerHTML = "";
    var fiveDayContainer = document.createElement("div");
    fiveDayContainer.classList.add("w-full", "flex", "space-x-4");
    fiveDayEl.appendChild(fiveDayContainer);

    var fiveDayLoop = data.daily.slice(1, 6);
    // loop through daily forecast array
    for (let i = 0; i < fiveDayLoop.length; i++) {
        // create five-day forecast cards
        var forecastCard = document.createElement("article");
        forecastCard.classList.add("flex-1", "p-2", "bg-blue-400", "rounded", "shadow-xl");
        fiveDayContainer.appendChild(forecastCard);

        // create p elements to append to forecastCard
        var fiveDate = document.createElement("h4");
        // convert unix timestamp into milliseconds
        var timestamp = fiveDayLoop[i].dt * 1000;
        // create date object
        date = new Date(timestamp);
        fiveDate.textContent = date.toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
        fiveDate.classList.add("text-white", "text-md", "font-medium");

        // create image elements to append forecastCard
        var iconUrl = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        var fiveIcon = document.createElement("img");
        fiveIcon.setAttribute("src", iconUrl);
        fiveIcon.classList.add("text-white", "text-md", "font-medium");

        var fiveTemp = document.createElement("p");
        fiveTemp.textContent = "Temp: " + fiveDayLoop[i].temp.day + "\u00B0 F";
        fiveTemp.classList.add("text-white", "text-md", "font-medium")

        var fiveWind = document.createElement("p");
        fiveWind.textContent = "Wind: " + fiveDayLoop[i].wind_speed + " MPH";
        fiveWind.classList.add("text-white", "text-md", "font-medium");

        var fiveHumidity = document.createElement("p");
        fiveHumidity.textContent = "Humidity: " + fiveDayLoop[i].humidity + "%";
        fiveHumidity.classList.add("text-white", "text-md", "font-medium");
        forecastCard.append(fiveDate, fiveIcon, fiveTemp, fiveWind, fiveHumidity);
    }

}


// function to save searched city name to localStorage
var saveSearch = function (cityName) {
    searchHistory = cityName

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


// function to dynamically create city buttons based on localStorage data 
var savedCityBtn = function () {
    // if localStorage has data, do this
    if (localStorage) {
        // loop through localStorage and create a button for each key/value pair
        for (let i = 0; i < localStorage.length; i++) {
            var savedObject = JSON.parse(localStorage.getItem([i]))
            console.log('savedObjet', savedObject)
            // create the city button by index value
            var citySearchBtn = document.createElement("button");
            citySearchBtn.classList.add("w-full", "font-semibold", "bg-gray-300", "rounded", "h-9", "py-1", "hover:bg-gray-400", "shadow-md");
            citySearchBtn.setAttribute("id", savedObject);
            citySearchBtn.textContent = savedObject;
            cityBtnEl.appendChild(citySearchBtn);
        }
    }
}


// function to add new city button after search
var addNewCityBtn = function (cityName) {
    var citySearchBtn = document.createElement("button");
    citySearchBtn.classList.add("w-full", "font-semibold", "bg-gray-300", "rounded", "py-1", "hover:bg-gray-400", "shadow-md");
    citySearchBtn.setAttribute("id", cityName);
    citySearchBtn.textContent = cityName;
    cityBtnEl.appendChild(citySearchBtn);
}


// function to display weather based on city button click
var resubmitSearch = function (event) {
    // capture button click by id and feed id into getLatLon function
    getLatLon(event.target.id);
}

// run function savedCityBtn on page load
savedCityBtn();

// event listeners
searchFormEl.addEventListener("submit", formSubmitHandler);
cityBtnEl.addEventListener("click", resubmitSearch);