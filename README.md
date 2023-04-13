# Weather Center

Weather Center is a web application that allows users to search for weather information for a specific location. Users can view current weather conditions, as well as a 5-day forecast, for any desired location. The application retrieves weather data from a third-party API.

## Features

- Search Weather: Users can search for weather information for a specific location by entering a city name or ZIP code.
- Current Weather: Users can view the current weather conditions, including temperature, humidity, wind speed, UV index, and weather icons.
- 5-Day Forecast: Users can view a 5-day forecast, including weather icons, temperatures, and humidity levels.
- Search History: Users can view their search history, which displays their past search queries along with corresponding weather data.

## Technologies Used

- React: A popular JavaScript library for building user interfaces.
- Axios: A promise-based HTTP client for making API requests from the browser.
- OpenWeatherMap API: A free weather API that provides current weather data and forecasts for various locations.
- Bootstrap: A popular CSS framework for building responsive and modern web interfaces.
- LocalStorage: A web storage mechanism that allows data to be stored in the user's browser for persistent storage of search history.
- JavaScript: The programming language used for building the application's logic.
- HTML/CSS: The markup and styling languages used for building the user interface.

## Installation

1. Clone the repository: `git clone https://github.com/JayPTucker/weather-center.git`
2. Change to the project directory: `cd weather-center`
3. Get API key: Sign up for a free API key from OpenWeatherMap API (https://openweathermap.org/api) and replace the placeholder `API_KEY` in the `src/utils/api.js` file with your actual API key.
4. Start the application: Open the `index.html` file in your web browser.

## Usage

1. Enter Location: In the search bar, enter a city name or ZIP code for which you want to retrieve weather information.
2. View Weather: The current weather conditions and 5-day forecast for the entered location will be displayed on the screen.
3. View Search History: The search history will be displayed on the left-hand side of the screen, showing past search queries and corresponding weather data.
4. Select from Search History: Users can click on a past search query from the search history to quickly retrieve weather information for that location.
5. Responsive Design: The application is designed to be responsive and can be used on various devices, including desktops, tablets, and mobile phones.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions, comments, or suggestions, please feel free to contact me at [jaypaultucker@gmail.com](mailto:jaypaultucker@gmail.com).
