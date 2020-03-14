$("#search-btn").on('click', function(event) {
    event.preventDefault();
    // Whatever we search
    let searchInput = $("#city-search").val()

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=e8bec4199b95f357f589f6ba4bdcd7c3";

        $.ajax({
            // URL | METHOD
            url: queryURL,
            method: "GET",

            // IF THE CITY IS FOUND DO THIS
            success: function() {
                $("#search-history").append("<li><input id='history-search-btn' class='previous-search' type='submit' value='" + searchInput + "'></li>");
                getCity();
            },

            // IF THE CITY ISNT FOUND DO THIS
            error: function() {
                alert('City Not Found.  Try Again.')
            }

        }).then(function(response) {
            console.log(response);

            var weatherDiv = $("<div class='col-md-8'>");

            // City Name:
            var printSearchInput = $("<p>").text("City: " + searchInput);
            weatherDiv.append(printSearchInput);

            // Current Date:
            var currentDate = new moment().format("dddd, MMMM Do, YYYY")
            var printCD = $("<p>").text("Date: " + currentDate);
            weatherDiv.append(printCD);

            // Icon Representation of Weather Conditions:
            var iconID = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconID + ".png";
            var printWC= $("<img>").attr("src", iconURL); 
            weatherDiv.append(printWC);

            // The Current Temperature:
            var currentTemp = ((response.main.temp) * (9/5) - 459.67).toFixed(2);
            var printCT = $("<p>").text("Temperature: " + currentTemp);
            weatherDiv.append(printCT);

            // The Humidity:
            var currentHumidity = response.main.humidity;
            var printCH = $("<p>").text("Humidity: " + currentHumidity)
            weatherDiv.append(printCH);

            // The Wind Speed:
            var currentWindSpeed = response.wind.speed + " Mph";
            var printCWS = $("<p>").text("Wind Speed: " + currentWindSpeed);
            weatherDiv.append(printCWS);

            // The UV Index:
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            let queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=e8bec4199b95f357f589f6ba4bdcd7c3&lat="+ latitude +"&lon="+ longitude;
            $.ajax({
                url: queryURL,
                method: "GET"
              }).then(function(response) {
                  var uvIndex = response.value;
                  var printUVI = $("<p>").text("UV Index: " + uvIndex);
                  weatherDiv.append(printUVI)
            });

            $("#things").append(weatherDiv)
            
        });
    
    // WHEN I CLICK ON A CITY THAT'S IN MY SEARCH HISTORY, DO THIS:
    function getCity() {
        $("#history-search-btn").on('click', function(event) {
            event.preventDefault();
            console.log(searchInput);
        });
    }
});