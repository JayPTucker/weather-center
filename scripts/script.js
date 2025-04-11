// Set current date
$("#date").text(moment().format("dddd, MMMM Do, YYYY"));

const recentCity = localStorage.key(0)

// Load Search History
function loadSearchHistory() {
    const historyContainer = $("#search-history");
    historyContainer.empty();

    if (localStorage.length === 0) {
        historyContainer.append("<p class='nohistory' id='nohistory'>No Search History Found.</p>");
        return;
    }

    for (let i = 0; i < localStorage.length; i++) {
        const city = localStorage.key(i);
        historyContainer.append(`<li><button type="submit" class="historyBtn" id="${city}" value="${city}">${city}</button></li>`);
        
    }

    $("#currentCity").text(`Current City: ${recentCity}`)
    fetchWeather(recentCity)
}

// Fetch Weather Data
function fetchWeather(cityName) {
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=e8bec4199b95f357f589f6ba4bdcd7c3`;

    $.ajax({ url: geoURL, method: "GET" }).done(geoResponse => {
        if (!geoResponse.length) {
            alert("City not found.");
            return;
        }

        const { name, state, country, lat, lon } = geoResponse[0];

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e8bec4199b95f357f589f6ba4bdcd7c3`;

        $.ajax({ url: weatherURL, method: "GET" }).done(weatherResponse => {
            changeBackground(weatherResponse);

            $(".5DFresults").text("");
            displayCurrentWeather({ name, state, country }, weatherResponse);
            $("#city-search").val("");
        });
    });
}

function changeBackground(response) {
    const conditionMap = {
        Clear: {
            message: "Clear",
            video: "./assets/videos/clear.mp4"
        },
        Rain: {
            message: "Rainy",
            video: "./assets/videos/rain.mov"
        },
        Clouds: {
            message: "Cloudy",
            video: "./assets/videos/cloudy.mp4"
        },
        Snow: {
            message: "Snowy",
            video: "./assets/videos/snowy.mp4"
        },
        Thunderstorm: {
            message: "Stormy",
            video: "./assets/videos/thunderstorms.mp4"
        },
        // Add more as needed
    };
    
    const currentConditions = response.weather[0].main;

    console.log(response)
    
    const weatherInfo = conditionMap[currentConditions] || {
        message: "Unknown weather condition",
        video: "videos/default.mp4"
    };
    
    console.log(weatherInfo.message);
    updateBackgroundVideo(weatherInfo.video);
    
}

let currentVideo = 1;

function updateBackgroundVideo(videoPath) {
    const oldVid = $(`#background-video-${currentVideo}`);
    const newVidNum = currentVideo === 1 ? 2 : 1;
    const newVid = $(`#background-video-${newVidNum}`);
    const newSource = newVid.find("source");

    // Set new source & load
    newSource.attr("src", videoPath);
    newVid[0].load();

    // Start fade transition
    newVid.css("opacity", 1);
    oldVid.css("opacity", 0);

    // Swap video tracker after transition
    currentVideo = newVidNum;
}



function displayCurrentWeather(location, response) {
    const { name } = location;
    const weatherDiv = $("#weatherDiv").empty();

    const weatherHTML = `
        <div class="row">
            <div class="col-md-8">
                <p class="currentTemp">${((response.main.temp) * (9/5) - 459.67).toFixed(2)}°F</p>
            </div>
            <div styles="float: right;" class="col-md-4">
                <i class="weather-icon wi wi-day-sunny" id="weatherIcon"></i>
            </div>
        </div>

        <p id="currentCondition"></p>
        <p class="metric-p">Feels Like: <span class="weather-metric">${((response.main.feels_like) * (9/5) - 459.67).toFixed(2)}°F</span></p>
        <p class="metric-p">Humidity: <span class="weather-metric">${response.main.humidity}</span></p>
        <p class="metric-p">Wind Speed: <span class="weather-metric">${response.wind.speed} Mph</span></p>
    `;

    weatherDiv.append(weatherHTML);

    // Inject the current condition
    $("#currentCondition").text(`${response.weather[0].main}`);

    $("#currentCity").text(`Current City: ${name}`)


    fetchUVIndex(response.coord.lat, response.coord.lon);
    setup5DayForecastButton(name);
    const conditionMap = {
        Clear: "wi-day-sunny",
        Clouds: "wi-cloudy",
        Rain: "wi-rain",
        Snow: "wi-snow",
        Thunderstorm: "wi-thunderstorm",
        Mist: "wi-fog",
        Drizzle: "wi-sprinkle"
    };
    
    const currentCondition = response.weather[0].main;
    const iconClass = conditionMap[currentCondition] || "wi-na";
    
    $("#weatherIcon")
      .removeClass()
      .addClass(`wi ${iconClass}`);
}

// Fetch UV Index
function fetchUVIndex(lat, lon) {
    const UVIqueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=e8bec4199b95f357f589f6ba4bdcd7c3&lat=${lat}&lon=${lon}`;

    $.ajax({ url: UVIqueryURL, method: "GET" }).done(response => {
        const uvIndex = response.value;
        const uvColor = uvIndex <= 2 ? "green" : uvIndex <= 5 ? "yellow" : "red";

        const uvElement = $(`<p class="metric-p" id='uvIndex'>UV Index: <span class="weather-metric">${uvIndex}</span></p>`).css("color", uvColor);
        $("#weatherDiv").append(uvElement);
    });
}

// Setup 5 Day Forecast Button
function setup5DayForecastButton(city) {
    const btnDiv = $("#5DFbtnDiv").empty();
    btnDiv.append(`<button class='FDFbtn' id='5DFbtn'>View 5 Day Forecast</button>`);

    $("#5DFbtn").on("click", () => fetchFiveDayForecast(city));
}

// Fetch and Display 5-Day Forecast
function fetchFiveDayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=e8bec4199b95f357f589f6ba4bdcd7c3`;

    $.ajax({ url: url, method: "GET" }).done(response => {
        $(".5DFresults").text("");
        const indices = [0, 8, 16, 24, 32];

        indices.forEach((i, day) => {
            const entry = response.list[i];
            const date = entry.dt_txt.substring(0, 10);
            const icon = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
            const temp = ((entry.main.temp) * (9/5) - 459.67).toFixed(2);
            const feels_like = ((entry.main.feels_like) * (9/5) - 459.67).toFixed(2);
            const humidity = entry.main.humidity;

            const container = $(`#day${day + 1}Div`).empty();
            container.append(`<p class='daysdate'>${date}</p>`);
            container.append(`<img src='${icon}'>`);
            container.append(`<p>Temperature: ${temp} °F</p>`);
            container.append(`<p>Feels like: ${temp} °F</p>`);
            container.append(`<p>Humidity: ${humidity}</p>`);
        });
    });
}

// Handle Search Button Click
$("#search-btn").on("click", function (event) {
    event.preventDefault();
    const city = $("#city-search").val().trim();

    if (!city) return;

    if ($(`#${city}`).length) {
        alert("This city already exists in your History tab.");
    } else {
        $("#search-history").append(`<li><button type="submit" class="historyBtn" id="${city}" value="${city}">${city}</button></li>`);
        localStorage.setItem(city, "recentsearch");
        $("#nohistory").remove();
    }

    fetchWeather(city);
});

// Setup History Buttons Click
function setupHistoryClickListeners() {
    $("#search-history").on("click", ".historyBtn", function () {
        const city = $(this).val();
        fetchWeather(city);
    });
}

// Init
$(document).ready(function () {
    loadSearchHistory();
    setupHistoryClickListeners();
});