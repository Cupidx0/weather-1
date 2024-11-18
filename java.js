
const apiKey = `0b55bb5a11fac5228bf4200c0314cd31`;

const x = document.getElementById('city-input').value;
function resetUI(){
    document.getElementById('city-name').innerText = "fetching location...";
    document.getElementById('temp').innerText = "";
    document.getElementById('feels-like').innerText ="";
    document.getElementById('description').innerText = "";
    document.getElementById('wind-speed').innerText = "";
    document.getElementById('humidity').innerText = "";
    document.getElementById('weather-icon').className = "fetching data";
    document.getElementById('weather-icon').style.color = "fetching data";
    document.getElementById('b').style.backgroundImage = "fetching data";
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
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
    }
}
async function getWeather() {
    try{
        const city = document.getElementById('city-input').value;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        updateWeatherUI(data);
        console.log(data);
    } catch (error){
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. please try again later.')
    }
}
function updateWeatherUI(data) {
            document.getElementById('city-name').innerText = data.name;
            document.getElementById('temp').innerText = Math.round(data.main.temp) + `°C`;
            document.getElementById('feels-like').innerText = `Feels like ` + Math.round(data.main.feels_like) + `°C`;
            document.getElementById('description').innerText = data.weather[0].description;
            document.getElementById('wind-speed').innerText = `${data.wind.speed}m/s`;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('weather-icon').className = `fa-sharp fa-solid ${getWeatherIcon(data.weather[0].icon)} fa-9x`;
            document.getElementById('weather-icon').style.color = getWeatherIconColor(data.weather[0].icon);
            document.getElementById('b').style.backgroundImage = `url(${getBackgroundImage(data.weather[0].icon)})`;
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
        '03d': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk7GqVZTlg-_ek2KH6GpEDrj9BdiGgdAVcMg&s',
        '03n': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk7GqVZTlg-_ek2KH6GpEDrj9BdiGgdAVcMg&s',
        '04d': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk7GqVZTlg-_ek2KH6GpEDrj9BdiGgdAVcMg&s',
        '04n': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk7GqVZTlg-_ek2KH6GpEDrj9BdiGgdAVcMg&s',
        '09d': 'https://images.news18.com/ibnlive/uploads/2021/07/1627056776_clouds-1600x1200.jpg?impolicy=website&width=640&height=480',
        '09n': 'https://images.news18.com/ibnlive/uploads/2021/07/1627056776_clouds-1600x1200.jpg?impolicy=website&width=640&height=480',
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
document.getElementById('city-input-btn').addEventListener('click',()=> {const city = document.getElementById('city-input').value|| 'horley';
    getWeather(city);
});

document.querySelector('#get-location-btn').addEventListener('click', ()=> {
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



