document.getElementById('search-btn').addEventListener('click', fetchWeatherData);

document.getElementById('city-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        fetchWeatherData();
    }
});

const apiKey = '0b60c38c7270dac596eb80a0b94a7495';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

function fetchWeatherData() {
    const city = document.getElementById('city-input').value;
    const units = document.getElementById('unit-toggle-switch').value;
    const lang = document.getElementById('language-toggle-switch').value;

    const weatherUrl = `${baseUrl}weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;
    const forecastUrl = `${baseUrl}forecast?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;

    showLoadingSpinner(true);
    
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.remove('fade-in');
    errorMessage.classList.add('hidden');
    errorMessage.innerText = '';

    document.getElementById('weather-info').innerHTML = '';
    document.getElementById('forecast-info').innerHTML = '';

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayCurrentWeather(data);
                return fetch(forecastUrl);
            } else {
                throw new Error(data.message);
            }
        })
        .then(response => response.json())
        .then(displayForecast)
        .catch(handleError)
        .finally(() => showLoadingSpinner(false));
}


function displayCurrentWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const weather = `
        <div class="flex items-center space-x-4">
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="w-16 h-16">
            <div>
                <p><strong>${data.name}</strong></p>
                <p>Temperature: ${data.main.temp}°</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Conditions: ${data.weather[0].description}</p>
            </div>
        </div>
    `;
    
    weatherInfo.innerHTML = weather;
    updateBackgroundImage(data.weather[0].main);
}

function displayForecast(data) {
    const forecastInfo = document.getElementById('forecast-info');
    forecastInfo.innerHTML = '';

    data.list.forEach((day, index) => {
        if (index % 8 === 0 && index < 40) {
            const date = new Date(day.dt * 1000);
            const dayCard = `
                <div class="forecast-card">
                    <h3 class="font-bold text-lg">${date.toLocaleDateString()}</h3>
                    <p class="text-2xl font-bold">${day.main.temp}°</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                    <p>Wind Speed: ${day.wind.speed} m/s</p>
                    <p>Conditions: ${day.weather[0].description}</p>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                </div>
            `;
            forecastInfo.innerHTML += dayCard;
        }
    });
}

function updateBackgroundImage(condition) {
    const body = document.body;
    
    switch (condition.toLowerCase()) {
        case 'clear':
            body.style.backgroundImage = "url('images/sunny.jpg')";
            break;
        case 'rain':
        case 'light rain':
        case 'moderate rain':
        case 'heavy intensity rain':
        case 'very heavy rain':
        case 'extreme rain':
        case 'freezing rain':
            body.style.backgroundImage = "url('images/rainy.jpg')";
            break;
        case 'drizzle':
            body.style.backgroundImage = "url('images/drizzle.jpg')";
            break;
        case 'thunderstorm':
            body.style.backgroundImage = "url('images/thunderstorm.jpg')";
            break;
        case 'snow':
            body.style.backgroundImage = "url('images/snow.jpg')";
            break;
        case 'clouds':
            body.style.backgroundImage = "url('images/cloudy.jpg')";
            break;
        case 'mist':
        case 'fog':
            body.style.backgroundImage = "url('images/fog.jpg')";
            break;
        default:
            body.style.backgroundImage = "url('images/default.jpg')";
    }
}

function handleError(error) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = `Error: ${error.message}`;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.add('fade-in');
}

document.getElementById('search-btn').addEventListener('click', () => {
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.remove('fade-in');
    errorMessage.classList.add('hidden');
    errorMessage.innerText = '';
});

function showLoadingSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = show ? 'block' : 'none';
}
