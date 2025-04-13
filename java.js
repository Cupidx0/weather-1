
const apiKey = `0b55bb5a11fac5228bf4200c0314cd31`;
const city = document.getElementById('city-input').value|| 'horley';
const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 14);
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const startDate = formatDate(today);
    const endDate = formatDate(nextWeek);
function resetUI(){
    document.getElementById('city-name').innerText = "fetching location...";
    document.getElementById('temp').innerText = "";
    document.getElementById('feels-like').innerText ="";
    document.getElementById('description').innerText = "";
    document.getElementById('wind-speed').innerText = "";
    document.getElementById('humidity').innerText = "";
    document.getElementById('weather-icon').className = "fetching data";
    document.getElementById('weather-icon').style.color = "fetching data";
    document.querySelector('.weathercontainer').style.backgroundImage = "fetching data";
}
function getLocation() {
    resetUI();
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,showError,{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
        });

    }else{
        alert("geolocation not found...")
    }
}
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    console.log(`Latitude:${latitude}, Longitude:${longitude}, Accuracy:${accuracy}`);
    getWeatherByCoords(latitude, longitude);

}
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User  denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
async function getWeatherByCoords(latitude, longitude) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        getWeather(city);
        updateWeatherUI(data);
        console.log("Full WEATHER API Response:", data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
    }
}
async function getWeather(city='horley') {
    try{
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const dailyForecast = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));
        const forecastContent = document.getElementById('future-weather');
        forecastContent.innerHTML = '';
        dailyForecast.forEach(data => {
            var options = { weekday: 'long'};
            const date = new Date(data.dt * 1000).toLocaleDateString('en-uk',options);
            const temp = Math.round(data.main.temp) + `°C`;
            const description = data.weather[0].description;
            const weatherIcon = getWeatherIcon(data.weather[0].icon);
            const WeatherIconColor = getWeatherIconColor(data.weather[0].icon);
            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
            forecastCard.innerHTML = `
                <p>${date|| "N/A"}</p>
                <i class="fa-sharp fa-solid fa-2x ${weatherIcon}" style=color:${WeatherIconColor}></i>
                <p>${temp || "N/A"}</p>
                <p>${description || "N/A"}</p>`;
            forecastContent.appendChild(forecastCard);
        });
        console.log("Full weather update:", data);
        updateWeatherUI(data);
    } catch (error){
        console.error('Error fetching weather data:', error);
        document.getElementById('future-weather').innerHTML = 'Failed to fetch weather data. please try again later.';
        alert('Failed to fetch new weather data. please try again later.')
    }
}
function updateWeatherUI(data) {
    if (data.main) {
        // Current weather data from /weather API
        const forecastData = data.main[0]; 
        document.getElementById('city-name').innerText = data.name;
        document.getElementById('temp').innerText = Math.round(data.main.temp) + `°C`;
        document.getElementById('feels-like').innerText = `Feels like ` + Math.round(data.main.feels_like) + `°C`;
        document.getElementById('description').innerText = data.weather[0].description;
        document.getElementById('wind-speed').innerText = `${data.wind.speed} m/s`;
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;
        document.getElementById('weather-icon').className = `fa-sharp fa-solid ${getWeatherIcon(data.weather[0].icon)} fa-9x`;
        document.getElementById('weather-icon').style.color = getWeatherIconColor(data.weather[0].icon);
        document.querySelector('.weathercontainer').style.backgroundImage = `url(${getBackgroundImage(data.weather[0].icon)})`;
        document.getElementById('future-weather').innerHTML = '';
    } else if (data.list) {
        // Forecast data from /forecast API
        const forecastData = data.list[0]; // Take the first forecast
        document.getElementById('city-name').innerText = data.city.name;
        document.getElementById('temp').innerText = Math.round(forecastData.main.temp) + `°C`;
        document.getElementById('feels-like').innerText = `Feels like ` + Math.round(forecastData.main.feels_like) + `°C`;
        document.getElementById('description').innerText = forecastData.weather[0].description;
        document.getElementById('wind-speed').innerText = `${forecastData.wind.speed} m/s`;
        document.getElementById('humidity').innerText = `${forecastData.main.humidity}%`;
        document.getElementById('weather-icon').className = `fa-sharp fa-solid ${getWeatherIcon(forecastData.weather[0].icon)} fa-9x`;
        document.getElementById('weather-icon').style.color = getWeatherIconColor(forecastData.weather[0].icon);
        document.querySelector('.weathercontainer').style.backgroundImage = `url(${getBackgroundImage(forecastData.weather[0].icon)})`;
    }
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': ' fa-sun',
        '01n': 'fa-moon',
        '02d': 'fa-cloud-sun',
        '02n': 'fa-cloud-moon',
        '03d': 'fa-cloud',
        '03n': 'fa-cloud',
        '04d': 'fa-cloud',
        '04n': 'fa-cloud',
        '09d': 'fa-cloud-showers-heavy',
        '09n': 'fa-cloud-showers-heavy',
        '10d': 'fa-cloud-sun-rain',
        '10n': 'fa-cloud-moon-rain',
        '11d': 'fa-bolt',
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',
        '50n': 'fa-smog'
    };
    return iconMap[iconCode] || 'fa-sun';
}
function getWeatherIconColor(iconCode) {
    const colorMap = {
        '01d': '#FFF700', 
        '01n': '#FFFFFF', 
        '02d': '#87CEEB', 
        '02n': '#4682B4', 
        '03d': '#B0C4DE', 
        '03n': '#B0C4DE', 
        '04d': '#B0C4DE', 
        '04n': '#B0C4DE', 
        '09d': '#00BFFF',
        '09n': '#00BFFF', 
        '10d': '#1E90FF', 
        '10n': '#6495ED', 
        '11d': '#FFD700', 
        '11n': '#FFD700', 
        '13d': '#00FFFF', 
        '13n': '#00FFFF', 
        '50d': '#A9A9A9', 
        '50n': '#A9A9A9'  
    };
    return colorMap[iconCode] || '#FFF700'; 
}
function getBackgroundImage(iconCode) {
    const backgroundMap = {
        '01d': 'https://w0.peakpx.com/wallpaper/525/262/HD-wallpaper-sunny-day-bright-clouds-color-nature-new-nice-sky-sun-thumbnail.jpg',
        '01n': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTupi3kb1og0BdpVHA84bCNSn0pHpv6ufp7eg&s',
        '02d': 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?ixlib=rb-4.0.3',
        '02n': 'https://wallpapercave.com/wp/wp4588397.jpg',
        '03d': 'https://media.istockphoto.com/id/1337592981/photo/tower-bridge-in-the-evening-london-england-uk.jpg?s=612x612&w=0&k=20&c=5MgQtS3CCtq-52LyuMSKBEUAkjwEDvhf9Lt4Qx_Ffdo=',
        '03n': 'https://media.istockphoto.com/id/1337592981/photo/tower-bridge-in-the-evening-london-england-uk.jpg?s=612x612&w=0&k=20&c=5MgQtS3CCtq-52LyuMSKBEUAkjwEDvhf9Lt4Qx_Ffdo=',
        '04d': 'https://media.istockphoto.com/id/1337592981/photo/tower-bridge-in-the-evening-london-england-uk.jpg?s=612x612&w=0&k=20&c=5MgQtS3CCtq-52LyuMSKBEUAkjwEDvhf9Lt4Qx_Ffdo=',
        '04n': 'https://media.istockphoto.com/id/1337592981/photo/tower-bridge-in-the-evening-london-england-uk.jpg?s=612x612&w=0&k=20&c=5MgQtS3CCtq-52LyuMSKBEUAkjwEDvhf9Lt4Qx_Ffdo=',
        '09d': 'https://miro.medium.com/v2/resize:fit:1400/1*MNrunXy7HfdpAwg5RvF0bA.jpeg',
        '09n': 'https://miro.medium.com/v2/resize:fit:1400/1*MNrunXy7HfdpAwg5RvF0bA.jpeg',
        '10d': 'https://wallpaperaccess.com/full/1379508.jpg',
        '10n': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf9aF1pD1_OB70ytGuXPZji3uaRtazRRfHdQ&s',
        '11d': 'https://images.news18.com/ibnlive/uploads/2021/07/1627056776_clouds-1600x1200.jpg?impolicy=website&width=640&height=480',
        '11n': 'https://images.news18.com/ibnlive/uploads/2021/07/1627056776_clouds-1600x1200.jpg?impolicy=website&width=640&height=480',
        '13d': 'https://www.thoughtco.com/thmb/FjY4b9mOZA0utP6bZOqlZ5wx9D0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/184848787-56a9e2053df78cf772ab37c2.jpg',
        '13n': 'https://www.thoughtco.com/thmb/FjY4b9mOZA0utP6bZOqlZ5wx9D0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/184848787-56a9e2053df78cf772ab37c2.jpg',
        '50d': 'https://images.pond5.com/soft-fog-smog-smoke-cloud-footage-137620257_iconl.jpeg',
        '50n': 'https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638889896/EducationHub/photos/shanghai-towers-above-the-smog.jpg'
    };
    return backgroundMap[iconCode] || 'https://i.pinimg.com/736x/87/29/37/8729376a8539051c2e2b0bf8fff88374.jpg';
}
document.getElementById('city-input-btn').addEventListener('click',()=> {
    const city = document.getElementById('city-input').value || 'horley';
        getWeather(city);
});

document.getElementById('get-location-btn').addEventListener('click', ()=> {
    getLocation();
    console.log('Executed GetLocation')
});

function displayCurrentDate() {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var currentDate = today.toLocaleDateString('en-uk',options);
    document.querySelector('.date-p').textContent = currentDate;
    document.getElementById('h2').innerText = currentDate;
    console.log(currentDate);
} 
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    getWeather();
    getLocation();
});

const newsapiKey = `9e3376f085ffed1664fe4d0b880e8c8b`;
function fetchTrendingNews() {
    const newsApiUrl = `https://gnews.io/api/v4/top-headlines?q=entertainment+OR+sport&token=${newsapiKey}&lang=en`;
    fetch(newsApiUrl)
    .then(response => response.json())
    .then(data => {
        const newsList = document.getElementById('newslists');
        newsList.innerHTML = '';
        console.log("Full NEWS API Response:", data);
        data.articles.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.classList.add('news-card');
            newsCard.innerHTML = `<a href="${article.url}" target="_blank">
            <img src="${article.image || 'default-image-url.jpg'}" alt="News Image" style="width: 100%; height: auto; border-radius: 5%;">
            ${article.title}</a>`;
            newsList.appendChild(newsCard);
        });
    })
    .catch(error => console.error("Error fetching news:", error));
}
fetchTrendingNews();

const stockApiKey = `xZVqBDh1XlIToSOoXV3VUyG2O2yeBNEyuEwz1yPc`;
const companyNames = {
    AAPL : 'Apple Inc.',
    TSLA : 'Tesla Inc.',
    MSFT: 'Microsoft Corporation',
    GOOGL: 'Alphabet Inc.',
    amzn : 'Amazon',
    META : 'Meta',
    NVDA : 'Nvidia',
    JPM : 'JPMorgan Chase & Co.',
    DIS: 'Disney',
    NFLX: 'Netflix'
};
function fetchTrendingstocks() {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const startDate = formatDate(lastWeek);
    const endDate = formatDate(today);
        const stockApiUrl = `https://api.stockdata.org/v1/data/quote?symbols=AAPL,TSLA,MSFT,GOOGL,AMZN,META,NVDA,JPM,DIS,NFLX&api_token=${stockApiKey}&date_from=${startDate}&date_to=${endDate}`;
    fetch(stockApiUrl)
    console.log('Fetching stock data...');
    console.log(`Start Date: ${startDate}, End Date: ${endDate}`);
    fetch(stockApiUrl)
    .then(response => response.json())
    .then(data => {
        const stockData = document.getElementById('stockdatar');
        stockData.innerHTML = '';
        console.log("Full API Response:", data);
        if (data.data && data.data.length > 0) {
            data.data.forEach(stock => {
                const stockCard = document.createElement('div');
                stockCard.classList.add('stock-card');
                console.log("Ticker from API:", stock.ticker); 
                stockCard.innerHTML = `
                    <p><strong>Company:</strong> ${companyNames[stock.ticker?.toUpperCase()]|| 'Unknown Company'}</p>
                    <p><strong>Symbol:</strong> ${stock.ticker || 'N/A'}</p>
                    <p><strong>Open:</strong> $${stock.day_open ? stock.day_open.toFixed(2) : "N/A"}</p>
                    <p><strong>PreviousClosePrice:</strong> $${stock.previous_close_price !== undefined ? stock.previous_close_price.toFixed(2) : "N/A"}</p>
                    <p><strong>High:</strong> $${stock.day_high ? stock.day_high.toFixed(2) : "N/A"}</p>
                    <p><strong>Low:</strong> $${stock.day_low !== undefined ? stock.day_low.toFixed(2) : "N/A"}</p>
                    <p><strong>Volume:</strong> ${stock.volume ? stock.volume.toLocaleString() : "N/A"}</p>
                    <p><strong>CurrentClosePrice:</strong>${stock.price !== undefined ? stock.price.toFixed(2):"N/A"}</p>`;
                stockData.appendChild(stockCard); 
                console.log("Stock API Response:", stock);
                });
            } else {
                stockData.innerHTML = 'No stock data available for the selected date range.';
                console.log("no stock data fetched");
            }
        })
        .catch(error => console.error("Error fetching stock data:", error));
}fetchTrendingstocks();
function findYear(){
    const yearr = document.getElementById('yearr');
    const todayy = new Date();
    const fyearr = todayy.getFullYear()+1;
    yearr.innerHTML = fyearr;
    console.log(fyearr);
}
findYear();