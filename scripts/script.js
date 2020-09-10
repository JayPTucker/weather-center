var currentDate = $("#date");
currentDate.text("Date: " + (new moment().format("dddd, MMMM Do, YYYY")));

// PRINTS OUT OUR MOST RECENT SEARCH RIGHT AS YOU REFRESH THE WEBSITE
console.log(localStorage.getItem("recentsearch"))
var searchHistory = localStorage.getItem("recentsearch")

if (searchHistory === null) {
    console.log("is null")
    $("#search-history").append("<p class='nohistory' id='nohistory'>No Search History Found.</p>")
} else {
    console.log("isn't null")
    $("#search-history").append("<li><input type='submit' class='historyBtn' id='" + localStorage.getItem("recentsearch") + "' value='" + localStorage.getItem("recentsearch") + "'></li>")
}


// Upon Button Click
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
        // Clears the 5-Day-Forecast Chart
        $(".5DFresults").text("");
        // Checks if the value is already in the list, if it is alert that the city is already there.
        if(searchInput === (($("#" + searchInput).val()))) {
            alert("This city already exists and is in your History tab.")

        // Else, create a new input button.
        } else {
            $("#search-history").append("<li><input type='submit' class='historyBtn' id='" + searchInput + "' value='" + searchInput + "'></li>")
            localStorage.setItem("recentsearch", searchInput)
            $("#nohistory").remove();
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
        var printCD = $("<p class='daysdate'>").text("Date: " + currentDate);
        weatherDiv.append(printCD);

        // Icon Representation of Weather Conditions:
        var iconID = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconID + ".png";
        var printWC= $("<img>").attr("src", iconURL); 
        weatherDiv.append(printWC);

        // The Current Temperature:
        var currentTemp = ((response.main.temp) * (9/5) - 459.67).toFixed(2);
        var printCT = $("<p>").text("Temperature: " + currentTemp + " °F");
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
        var UVIqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=e8bec4199b95f357f589f6ba4bdcd7c3&lat="+ latitude +"&lon="+ longitude;

        $.ajax({
            url: UVIqueryURL,
            method: "GET"

        }).then(function(response) {

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

        // Appends everything we just created into the actual web page itself.
        $("#weatherDiv").append(weatherDiv);

        // -------------------------------------------------------------
        // 5 DAY FORECAST CREATION:

        var FDFbtnDiv = $("#5DFbtnDiv");
        var print5DFbtn = ($("<button id='5DFbtn'>").text("View 5 Day Forecast"));
        var printCurrentCity = ($("<p>").text("Current City: " + searchInput))
        // Deletes the Button everytime so it doesn't duplicate itself
        FDFbtnDiv.text("");

        FDFbtnDiv.append(print5DFbtn);
        FDFbtnDiv.append(printCurrentCity);

        $("#5DFbtn").on('click', function() {
            var FiveDayqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=e8bec4199b95f357f589f6ba4bdcd7c3"

            $.ajax({
                url: FiveDayqueryURL,
                method: "GET",
                success: function() {
                    $(".5DFresults").text("");
                }
            }).then(function(response) {
                console.log("-----------------")

                // DAY 1
                console.log(response.list[0])
                var day1Date = ((response.list[0].dt_txt).substring(0,10));
                var day1IconID = response.list[0].weather[0].icon
                var day1Icon = "http://openweathermap.org/img/w/" + day1IconID + ".png";
                var day1Temp = (((response.list[0].main.temp) * (9/5) - 459.67).toFixed(2));
                var day1Humidity = response.list[0].main.humidity;

                var printDay1Date = ($("<p class='daysdate'>").text(day1Date));
                var printDay1Icon = ($("<img>").attr("src", day1Icon));
                var printDay1Temp = ($("<p>").text("Temperature: " + day1Temp + " °F"));
                var printDay1Humidity = ($("<p>").text("Humidity: " + day1Humidity));

                
                ($("#day1Div")).append(printDay1Date);
                ($("#day1Div")).append(printDay1Icon);
                ($("#day1Div")).append(printDay1Temp);
                ($("#day1Div")).append(printDay1Humidity);
                
                // DAY 2
                console.log(response.list[8])
                var day2Date = ((response.list[8].dt_txt).substring(0,10));
                var day2IconID = response.list[8].weather[0].icon
                var day2Icon = "http://openweathermap.org/img/w/" + day2IconID + ".png";
                var day2Temp = (((response.list[8].main.temp) * (9/5) - 459.67).toFixed(2));
                var day2Humidity = response.list[8].main.humidity;

                var printDay2Date = ($("<p class='daysdate'>").text(day2Date));
                var printDay2Icon = ($("<img>").attr("src", day2Icon));
                var printDay2Temp = ($("<p>").text("Temperature: " + day2Temp + " °F"));
                var printDay2Humidity = ($("<p>").text("Humidity: " + day2Humidity));

                
                ($("#day2Div")).append(printDay2Date);
                ($("#day2Div")).append(printDay2Icon);
                ($("#day2Div")).append(printDay2Temp);
                ($("#day2Div")).append(printDay2Humidity);

                // DAY 3
                console.log(response.list[16])
                var day3Date = ((response.list[16].dt_txt).substring(0,10));
                var day3IconID = response.list[16].weather[0].icon
                var day3Icon = "http://openweathermap.org/img/w/" + day3IconID + ".png";
                var day3Temp = (((response.list[16].main.temp) * (9/5) - 459.67).toFixed(2));
                var day3Humidity = response.list[16].main.humidity;

                var printDay3Date = ($("<p class='daysdate'>").text(day3Date));
                var printDay3Icon = ($("<img>").attr("src", day3Icon));
                var printDay3Temp = ($("<p>").text("Temperature: " + day3Temp + " °F"));
                var printDay3Humidity = ($("<p>").text("Humidity: " + day3Humidity));

                
                ($("#day3Div")).append(printDay3Date);
                ($("#day3Div")).append(printDay3Icon);
                ($("#day3Div")).append(printDay3Temp);
                ($("#day3Div")).append(printDay3Humidity);

                // DAY 4
                console.log(response.list[24])
                var day4Date = ((response.list[24].dt_txt).substring(0,10));
                var day4IconID = response.list[24].weather[0].icon
                var day4Icon = "http://openweathermap.org/img/w/" + day4IconID + ".png";
                var day4Temp = (((response.list[24].main.temp) * (9/5) - 459.67).toFixed(2));
                var day4Humidity = response.list[24].main.humidity;

                var printDay4Date = ($("<p class='daysdate'>").text(day4Date));
                var printDay4Icon = ($("<img>").attr("src", day4Icon));
                var printDay4Temp = ($("<p>").text("Temperature: " + day4Temp + " °F"));
                var printDay4Humidity = ($("<p>").text("Humidity: " + day4Humidity));

                
                ($("#day4Div")).append(printDay4Date);
                ($("#day4Div")).append(printDay4Icon);
                ($("#day4Div")).append(printDay4Temp);
                ($("#day4Div")).append(printDay4Humidity);

                // DAY 5
                console.log(response.list[32])
                var day5Date = ((response.list[32].dt_txt).substring(0,10));
                var day5IconID = response.list[32].weather[0].icon
                var day5Icon = "http://openweathermap.org/img/w/" + day5IconID + ".png";
                var day5Temp = (((response.list[32].main.temp) * (9/5) - 459.67).toFixed(2));
                var day5Humidity = response.list[32].main.humidity;

                var printDay5Date = ($("<p class='daysdate'>").text(day5Date));
                var printDay5Icon = ($("<img>").attr("src", day5Icon));
                var printDay5Temp = ($("<p>").text("Temperature: " + day5Temp + " °F"));
                var printDay5Humidity = ($("<p>").text("Humidity: " + day5Humidity));

                
                ($("#day5Div")).append(printDay5Date);
                ($("#day5Div")).append(printDay5Icon);
                ($("#day5Div")).append(printDay5Temp);
                ($("#day5Div")).append(printDay5Humidity);

            });
        });
    });
    




// -----------------------------------------------------------------------------




    // WHEN I CLICK ON A CITY THAT'S IN MY SEARCH HISTORY, DO THIS:


    function getCity() {
        $("#" + searchInput).on('click', function(event) {
            event.preventDefault();
            console.log(($("#" + searchInput).val()))
            
        // ------------------------------------

            $.ajax({
                // URL | METHOD
                url: queryURL,
                method: "GET",

                // IF THE CITY IS FOUND DO THIS
                success: function() {
                // Clears the 5-Day-Forecast Chart
                $(".5DFresults").text("");
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
                var printCD = $("<p class='daysdate'>").text("Date: " + currentDate);
                weatherDiv.append(printCD);

                // Icon Representation of Weather Conditions:
                var iconID = response.weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconID + ".png";
                var printWC= $("<img>").attr("src", iconURL); 
                weatherDiv.append(printWC);

                // The Current Temperature:
                var currentTemp = ((response.main.temp) * (9/5) - 459.67).toFixed(2);
                var printCT = $("<p>").text("Temperature: " + currentTemp + " °F");
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
                var UVIqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=e8bec4199b95f357f589f6ba4bdcd7c3&lat="+ latitude +"&lon="+ longitude;

                $.ajax({
                    url: UVIqueryURL,
                    method: "GET"

                }).then(function(response) {

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

                // Appends everything we just created into the actual web page itself.
                $("#weatherDiv").append(weatherDiv);

                // -------------------------------------------------------------
                // 5 DAY FORECAST CREATION:

                var FDFbtnDiv = $("#5DFbtnDiv");
                var print5DFbtn = ($("<button id='5DFbtn'>").text("View 5 Day Forecast"));
                var printCurrentCity = ($("<p>").text("Current City: " + searchInput))
                // Deletes the Button everytime so it doesn't duplicate itself
                FDFbtnDiv.text("");

                FDFbtnDiv.append(print5DFbtn);
                FDFbtnDiv.append(printCurrentCity);

                $("#5DFbtn").on('click', function() {
                    var FiveDayqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=e8bec4199b95f357f589f6ba4bdcd7c3"

                    $.ajax({
                        url: FiveDayqueryURL,
                        method: "GET",
                        success: function() {
                            $(".5DFresults").text("");
                        }
                    }).then(function(response) {
                        console.log("-----------------")

                        // DAY 1
                        console.log(response.list[0])
                        var day1Date = ((response.list[0].dt_txt).substring(0,10));
                        var day1IconID = response.list[0].weather[0].icon
                        var day1Icon = "http://openweathermap.org/img/w/" + day1IconID + ".png";
                        var day1Temp = (((response.list[0].main.temp) * (9/5) - 459.67).toFixed(2));
                        var day1Humidity = response.list[0].main.humidity;

                        var printDay1Date = ($("<p class='daysdate'>").text(day1Date));
                        var printDay1Icon = ($("<img>").attr("src", day1Icon));
                        var printDay1Temp = ($("<p>").text("Temperature: " + day1Temp + " °F"));
                        var printDay1Humidity = ($("<p>").text("Humidity: " + day1Humidity));

                        
                        ($("#day1Div")).append(printDay1Date);
                        ($("#day1Div")).append(printDay1Icon);
                        ($("#day1Div")).append(printDay1Temp);
                        ($("#day1Div")).append(printDay1Humidity);
                        
                        // DAY 2
                        console.log(response.list[8])
                        var day2Date = ((response.list[8].dt_txt).substring(0,10));
                        var day2IconID = response.list[8].weather[0].icon
                        var day2Icon = "http://openweathermap.org/img/w/" + day2IconID + ".png";
                        var day2Temp = (((response.list[8].main.temp) * (9/5) - 459.67).toFixed(2));
                        var day2Humidity = response.list[8].main.humidity;

                        var printDay2Date = ($("<p class='daysdate'>").text(day2Date));
                        var printDay2Icon = ($("<img>").attr("src", day2Icon));
                        var printDay2Temp = ($("<p>").text("Temperature: " + day2Temp + " °F"));
                        var printDay2Humidity = ($("<p>").text("Humidity: " + day2Humidity));

                        
                        ($("#day2Div")).append(printDay2Date);
                        ($("#day2Div")).append(printDay2Icon);
                        ($("#day2Div")).append(printDay2Temp);
                        ($("#day2Div")).append(printDay2Humidity);

                        // DAY 3
                        console.log(response.list[16])
                        var day3Date = ((response.list[16].dt_txt).substring(0,10));
                        var day3IconID = response.list[16].weather[0].icon
                        var day3Icon = "http://openweathermap.org/img/w/" + day3IconID + ".png";
                        var day3Temp = (((response.list[16].main.temp) * (9/5) - 459.67).toFixed(2));
                        var day3Humidity = response.list[16].main.humidity;

                        var printDay3Date = ($("<p class='daysdate'>").text(day3Date));
                        var printDay3Icon = ($("<img>").attr("src", day3Icon));
                        var printDay3Temp = ($("<p>").text("Temperature: " + day3Temp + " °F"));
                        var printDay3Humidity = ($("<p>").text("Humidity: " + day3Humidity));

                        
                        ($("#day3Div")).append(printDay3Date);
                        ($("#day3Div")).append(printDay3Icon);
                        ($("#day3Div")).append(printDay3Temp);
                        ($("#day3Div")).append(printDay3Humidity);

                        // DAY 4
                        console.log(response.list[24])
                        var day4Date = ((response.list[24].dt_txt).substring(0,10));
                        var day4IconID = response.list[24].weather[0].icon
                        var day4Icon = "http://openweathermap.org/img/w/" + day4IconID + ".png";
                        var day4Temp = (((response.list[24].main.temp) * (9/5) - 459.67).toFixed(2));
                        var day4Humidity = response.list[24].main.humidity;

                        var printDay4Date = ($("<p class='daysdate'>").text(day4Date));
                        var printDay4Icon = ($("<img>").attr("src", day4Icon));
                        var printDay4Temp = ($("<p>").text("Temperature: " + day4Temp + " °F"));
                        var printDay4Humidity = ($("<p>").text("Humidity: " + day4Humidity));

                        
                        ($("#day4Div")).append(printDay4Date);
                        ($("#day4Div")).append(printDay4Icon);
                        ($("#day4Div")).append(printDay4Temp);
                        ($("#day4Div")).append(printDay4Humidity);

                        // DAY 5
                        console.log(response.list[32])
                        var day5Date = ((response.list[32].dt_txt).substring(0,10));
                        var day5IconID = response.list[32].weather[0].icon
                        var day5Icon = "http://openweathermap.org/img/w/" + day5IconID + ".png";
                        var day5Temp = (((response.list[32].main.temp) * (9/5) - 459.67).toFixed(2));
                        var day5Humidity = response.list[32].main.humidity;

                        var printDay5Date = ($("<p class='daysdate'>").text(day5Date));
                        var printDay5Icon = ($("<img>").attr("src", day5Icon));
                        var printDay5Temp = ($("<p>").text("Temperature: " + day5Temp + " °F"));
                        var printDay5Humidity = ($("<p>").text("Humidity: " + day5Humidity));

                        
                        ($("#day5Div")).append(printDay5Date);
                        ($("#day5Div")).append(printDay5Icon);
                        ($("#day5Div")).append(printDay5Temp);
                        ($("#day5Div")).append(printDay5Humidity);

                    });
                });
            });
        });
    };
});