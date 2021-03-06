//Empty array to store cities searched by the user
var cities = [];

//Calling function to render the last searched city by the user
renderLastSearch();

//Calling this function to initialize retrieiving the cities in local storage
localStorageCities();

function localStorageCities() {
    // Get stored cities from localStorage
    // Parsing the JSON string to an object
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were are not null then store the city in the local storage 
    if (storedCities !== null) {
        cities = storedCities;
    }
}

function storeCities() {
    // Stringify and set "cities" key in localStorage to cities array
    localStorage.setItem("cities", JSON.stringify(cities));
}

//Put the ajax calls for current weather and five day forecast in a function to make it reusable
function ajaxGetWeather(city){

    //Locally storing the last searched city
   
   localStorage.setItem("lastSearch", city);

   if (city != null){
       //Query URL variables
   var currentWeatherQuery = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=af6d8ce77f31fadf19d5245c0880c1e8`;
   var fiveDayWeatherQuery = `https://api.openweathermap.org/data/2.5/forecast?q=${city},3166&APPID=af6d8ce77f31fadf19d5245c0880c1e8`;

   //Creating first AJAX call to get the current city weather attributes
   $.ajax({
       url: currentWeatherQuery,
       method: "GET"
   }).then(function (response) {

       //Using Moment JS to get the current date
       var getDate = moment();
       var todaysDate = getDate.format("MM/DD/YYYY");

       // Converting temp from Kelvin to Fahrenheit
       var temp = Math.round(((response.main.temp - 273.15) * 1.8) + 32);
       $("#cityName").html(`${response.name} (${todaysDate}) <span><img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png"></span>`);
       $("#current-temp").html(`Temperature: ${temp} <span>&#8457;</span>`);
       $("#current-humidity").text(`Humidity: ${response.main.humidity}%`);
       $("#current-windSpeed").text(`Wind Speed: ${response.wind.speed} MPH`);

       //Calling this function to retrieve the UV Index
       retrieveUVIndex(response);

       $("#current-div").fadeIn(1000);
       $("#fiveDay-div").fadeIn(1500);
   }).fail(function (response) {
       console.log("No Data Retrieved");
   });

   //Creating second AJAX call to get the five day weather attributes
   $.ajax({
       url: fiveDayWeatherQuery,
       method: "GET"
   }).then(function (response) {

       //Converting the temperature to fahrenheit
       var temp1 = Math.round(((response.list[2].main.temp - 273.15) * 1.8) + 32);
       var temp2 = Math.round(((response.list[10].main.temp - 273.15) * 1.8) + 32);
       var temp3 = Math.round(((response.list[18].main.temp - 273.15) * 1.8) + 32);
       var temp4 = Math.round(((response.list[26].main.temp - 273.15) * 1.8) + 32);
       var temp5 = Math.round(((response.list[34].main.temp - 273.15) * 1.8) + 32);

       //Putting the response dates in variables
       var date1 = new Date(response.list[2].dt_txt);
       var date2 = new Date(response.list[10].dt_txt);
       var date3 = new Date(response.list[18].dt_txt);
       var date4 = new Date(response.list[26].dt_txt);
       var date5 = new Date(response.list[34].dt_txt);

       //Displaying five day dates using getMonth/getDate/getFullYear methods
       $("#dateDay1").text(`${date1.getMonth() + 1}/${date1.getDate()}/${date1.getFullYear()}`);
       $("#dateDay2").text(`${date2.getMonth() + 1}/${date2.getDate()}/${date2.getFullYear()}`);
       $("#dateDay3").text(`${date3.getMonth() + 1}/${date3.getDate()}/${date3.getFullYear()}`);
       $("#dateDay4").text(`${date4.getMonth() + 1}/${date4.getDate()}/${date4.getFullYear()}`);
       $("#dateDay5").text(`${date5.getMonth() + 1}/${date5.getDate()}/${date5.getFullYear()}`);

       //Displaying five day temps
       $("#tempDay1").html(`Temp: ${temp1} <span>&#8457;</span>`);
       $("#tempDay2").html(`Temp: ${temp2} <span>&#8457;</span>`);
       $("#tempDay3").html(`Temp: ${temp3} <span>&#8457;</span>`);
       $("#tempDay4").html(`Temp: ${temp4} <span>&#8457;</span>`);
       $("#tempDay5").html(`Temp: ${temp5} <span>&#8457;</span>`);

       //Displaying five day icons
       $("#iconDay1").attr("src", `https://openweathermap.org/img/wn/${response.list[2].weather[0].icon}@2x.png`);
       $("#iconDay2").attr("src", `https://openweathermap.org/img/wn/${response.list[10].weather[0].icon}@2x.png`);
       $("#iconDay3").attr("src", `https://openweathermap.org/img/wn/${response.list[18].weather[0].icon}@2x.png`);
       $("#iconDay4").attr("src", `https://openweathermap.org/img/wn/${response.list[26].weather[0].icon}@2x.png`);
       $("#iconDay5").attr("src", `https://openweathermap.org/img/wn/${response.list[34].weather[0].icon}@2x.png`);

       //Displaying five day humidity
       $("#humDay1").html(`Humidity: ${response.list[2].main.humidity}%`);
       $("#humDay2").html(`Humidity: ${response.list[10].main.humidity}%`);
       $("#humDay3").html(`Humidity: ${response.list[18].main.humidity}%`);
       $("#humDay4").html(`Humidity: ${response.list[26].main.humidity}%`);
       $("#humDay5").html(`Humidity: ${response.list[34].main.humidity}%`);
   }).fail(function (response) {
       console.log("No Data Retrieved");
   });
   }
   else{
    return
   }
   
}

//Function used to display the city HTML content
function displayCity(city) {

    city = $(this).attr("data-city");

    ajaxGetWeather(city);
}
     

//Function to retrieve the UV Index
function retrieveUVIndex(response) {
  
    var uvIndexQuery = `https://api.openweathermap.org/data/2.5/uvi?appid=af6d8ce77f31fadf19d5245c0880c1e8&lat=${response.coord.lat}&lon=${response.coord.lon}`;

    //Creating AJAX call to get the UV Index
    $.ajax({
        url: uvIndexQuery,
        method: "GET"
    }).then(function (response) {

        $("#current-uv").html(`UV Index: <span> ${response.value} </span>`);

        // Changing UV Index color
        if (response.value <= 2){
            document.querySelector('p#current-uv').style.cssText = 'background-color: green; color: black; padding: 10px; text-align: center; font-weight: bold; border-radius: 5px'; 
        } else if (response.value <= 5){
            document.querySelector('p#current-uv').style.cssText = 'background-color: yellow; color: black; padding: 10px; text-align: center; font-weight: bold; border-radius: 5px';
        } else if (response.value <= 7){
            document.querySelector('p#current-uv').style.cssText = 'background-color: orange; color: black; padding: 10px; text-align: center; font-weight: bold; border-radius: 5px';
        } else if (response.value <= 10){
            document.querySelector('p#current-uv').style.cssText = 'background-color: red; color: black; padding: 10px; text-align: center; font-weight: bold; border-radius: 5px;';
        } else if (response.value >=11){
            document.querySelector('p#current-uv').style.cssText = 'background-color: purple; color: black; padding: 10px; text-align: center; font-weight: bold; border-radius: 5px';
        }
        
    });
}

//Function to render the city buttons
function renderCityButtons() {

    $("#cityBtnGroup-div").empty();

    // Looping through the array of cities to create buttons
    for (var i = 0; i < cities.length; i++) {

        var cityBtn = $("<button>");

        cityBtn.addClass("btn btn-outline-secondary cityBtn");

        cityBtn.attr("data-city", cities[i]);

        cityBtn.text(cities[i]);

        $("#cityBtnGroup-div").append(cityBtn);
    }
}

//Function to display the users last search on page load
function renderLastSearch(){ 
    var city =  localStorage.getItem("lastSearch");

    if (city === null) {
        return;
      }

    ajaxGetWeather(city);
}

//Button click to search for a city that the user inputs
$("#btnSearchCity").click(function (event) {

    if ($("#txtCity").val().trim() != "") {

        event.preventDefault();

        var city = $("#txtCity").val().trim();

        cities.push(city);

        renderCityButtons();

        $("#txtCity").val("");

        ajaxGetWeather(city);
        storeCities();

    }
})

// Adding a click event listener to buttons with a class of "cityBtn"
$(document).on("click", ".cityBtn", displayCity);

renderCityButtons();