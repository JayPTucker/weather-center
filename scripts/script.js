$("#search-btn").on('click', function(event) {
    event.preventDefault();
    // THE INPUT THAT'S TYPED INTO THE BOX (HENCE THE .VAL)
    var searchInput = $("#city-search").val()
    console.log(searchInput);

    var queryURL = "api.openweathermap.org/data/2.5/weather?q="
    + searchInput + "&appid=e8bec4199b95f357f589f6ba4bdcd7c3";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(queryURL);
        console.log(response);
    });
});