$("#search-btn").on('click', function(event) {
    event.preventDefault();
    // THE INPUT THAT'S TYPED INTO THE BOX (HENCE THE .VAL)
    var searchInput = $("#city-search").val()
    console.log(searchInput);

    

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=e8bec4199b95f357f589f6ba4bdcd7c3";

        $.ajax({
            url: queryURL,
            success: function() {
                $("#search-history").append("<li><input id='history-search-btn' class='previous-search' type='submit' value='" + searchInput + "'></li>");
            },
            method: "GET",
            error: function() {
                alert('City Not Found.  Try Again.')
            } 
        }).then(function(response) {
            console.log(response);
        });

    
    // THE HISTORY BUTTONS
    $("#history-search-btn").on('click', function(event) {
        event.preventDefault();
        console.log($(this).val());
    })
});