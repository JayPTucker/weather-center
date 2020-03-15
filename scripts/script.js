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
        // Checks if the value is already in the list, if it is alert that the city is already there.
        if(searchInput === (($("#" + searchInput).val()))) {
            alert("This city already exists and is in your History tab.")

        // Else, create a new input button.
        } else {
            $("#search-history").append("<li><input type='submit' id='" + searchInput + "' value='" + searchInput + "'></li>")
        }
        // Activates our Function to detect whenever a button in the history tab
        getCity();
        },

        // IF THE CITY ISNT FOUND DO THIS
        error: function() {
            alert('City Not Found.  Try Again.')
        }

    }).then(function(response) {
        console.log(response);

        var weatherDiv = $("#weatherDiv");
        // Resets our Div Every new Search so that it's blank
        weatherDiv.text("")

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
            console.log(response)
            var uvIndex = response.value;
            var printUVI = $("<p id='uvIndex'>").text("UV Index: " + uvIndex);
            
            // Determines the safe conditions of the UVIndex by Colors
            weatherDiv.append(printUVI)
            if(uvIndex <= 2) {
                $("#uvIndex").css("color", "green")
            } else if (uvIndex <= 5) {
                $("#uvIndex").css("color", "yellow")
            } else if (uvIndex <= 15) {
                $("#uvIndex").css("color", "red")
            }

        });

        
        $("#things").append(weatherDiv);

    });
    
    // WHEN I CLICK ON A CITY THAT'S IN MY SEARCH HISTORY, DO THIS:
    function getCity() {
        $("#" + searchInput).on('click', function(event) {
            event.preventDefault();
            console.log(($("#" + searchInput).val()))
            
        // ------------------------------------
        // Repeated Ajax function above except I got rid of the success function.

        $.ajax({
            // URL | METHOD
            url: queryURL,
            method: "GET",
    
            // IF THE CITY ISNT FOUND DO THIS
            error: function() {
                alert('City Not Found.  Try Again.')
            }
    
        }).then(function(response) {
            console.log(response);
    
            var weatherDiv = $("#weatherDiv");
            // Resets our Div Every new Search so that it's blank
            weatherDiv.text("")
    
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
    
            
            $("#things").append(weatherDiv);
    
        });
        
        });
    };
});