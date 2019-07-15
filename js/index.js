const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
const root = document.querySelector(".root");
const key = `758f9df462dc4c441b6ca2531065a690`;

class App {
    render(parameter) {
        root.innerHTML = parameter; 
    }
}
let app = new App();


class Info {
    constructor() {
        this.name = "";
        this.coords = {
            lat: 0,
            lon: 0
        };
        this.temp = 0;
        this.pressure = 0;
        this.temp_min = 0;
        this.temp_max = 0;
        this.weather = {
            description: "",
            icon: ""
        };
        this.wind = {
            speed: 0
        };
    };
    update(e) {
        this.name = e.name;
        this.coords = {
            lat: e.coord.lat,
            lon: e.coord.lon
        };
        this.temp = Math.round(e.main.temp);
        this.pressure = e.main.pressure;
        this.temp_min = Math.round(e.main.temp_min);
        this.temp_max = Math.round(e.main.temp_max);
        this.weather = {
            description: e.weather[0].description,
            icon: e.weather[0].icon
        };
        this.wind = {
            speed: e.wind.speed
        };
    }
    display() {
        app.render(
            `
            <div class="mainInfo">
                <div class="cityName">
                    <p>TODAY<p>
                    <h2>${this.name}</h2>
                </div>
                <img class="wheather-img" src="http://openweathermap.org/img/wn/${this.weather.icon}@2x.png" alt="${this.weather.icon}">
                <div class="mainTemp">
                    <p class="mainTemp-temp">${this.temp} &#8451;</p>
                    <p class="mainTemp-weather">${this.weather.description}</p>
                </div>
                
            </div>
            
            <div class="wrapper">
                <div class="wrapper-border"></div>
                <div class="temps">
                    <div class="temp minTemp">Min: ${this.temp_min} &#8451;</div>
                    <div class="temp maxTemp">Max: ${this.temp_max} &#8451;</div>
                </div>
                <div class="pressure">Current pressure: ${this.pressure} hPa</div>
                <div class="wind">Wind speed: ${this.wind.speed} km/h</div>
            </div>
            `
        )
    }
}


let link;
let cityData = new Info();

var coordWeather = () => {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      
    function success(pos) {
        var crd = pos.coords;
        
        link = `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${key}&units=metric`;
        fetch(link)
        .then(response => {
            if(response.ok) {
                return response
            }
        })
        .then(response => response.json())
        .then(data => {
            cityData.update(data)
            cityData.display()
            return cityData
        })
        .catch(err => console.log(err))
    }
      
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
      
    navigator.geolocation.getCurrentPosition(success, error, options);
    
}

window.addEventListener("load",coordWeather);



let getInfo = () => {
    const cityName = searchInput.value;
    link = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${key}&units=metric`;
    console.log(link);
    fetch(link)
        .then(response => {
            if(response.ok) {
                return response
            }
        })
        .then(response => response.json())
        .then(data => {
            cityData.update(data.list[0])
            cityData.display()
            console.log(cityData)
            return cityData
        })
        .catch(err => console.log(err))

}

searchBtn.addEventListener("click",()=>{
    getInfo();
});
searchInput.addEventListener("keydown",(e)=>{
    if(e.which == 13 || e.keyCode == 13) {
        getInfo();
    }
})




