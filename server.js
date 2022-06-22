'use strict';

const { response, request } = require('express');
const express = require('express'); // create instance of express
const weatherData = require('./data/weather.json');
require('dotenv').config(); // import dotenv 
const PORT = process.env.PORT || 3002; // check to make sure working on correct port 

const app = express();

// get lat, lon, and search query info (city name) from weather data
// return description, low and high temp and date for 
let lat = weatherData.lat;
let lon = weatherData.lon;
let city = weatherData[0].city_name;

// get is an express method like axios.get 
// params url in quote and a callback function -> '/' is root '*' is all
app.get('/', (request,response) => {
  response.send(`hello ${PORT}`);
})

app.get('/weather/data', (request,response) => {
  response.send(weatherData);
  // console.log(weatherData.data.city_name);
})

app.get(`/weather`, (request, response) => {

  const results = [];

  const lat = request.query.lat;
  const lon = request.query.lon;
  const city = request.query.searchQuery;

  let validatedData = weatherData.find(obj => obj.city_name === city);
  validatedData.data.forEach(obj => {
    results.push(
      new Forecast(obj)
    );
  })

  response.send(results);
})

// star route
app.get('*', (request, response) => response.send(`The thing you are looking for doesn't exist`));

// CLASSES needed to send data back to front end
class Forecast{
  constructor(obj){
    this.description = `description: ${obj.low_temp}, ${obj.high_temp} with ${obj.weather.description}`;
    this.date = obj.datetime;
  }
}

app.listen(PORT, () => console.log(PORT)); // testing port in terminal

// server is listening for routes which are used to access endpoints aka data needed from api
