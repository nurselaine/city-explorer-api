'use strict';

// ******************* REQUIRES *******************

// const { response, request } = require('express');
const express = require('express'); // create instance of express
const axios = require('axios');
const weatherData = require('./data/weather.json');
const cors = require('cors');
require('dotenv').config(); // import dotenv 
const PORT = process.env.PORT || 3002; // check to make sure working on correct port 

const app = express();
app.use(cors());

// ******************  ROUTES   *************************

app.get('/', (request,response) => {
  response.send(`hello ${PORT}`);
})

app.get(`/weather`, async (request, response) => {

  const results = [];

  const lat = request.query.lat;
  const lon = request.query.lon;
  const city = request.query.searchQuery;
// http://api.weatherbit.io/v2.0/forecast/daily?days=5&lat=35.7796&lon=-78.6382&key=f0e83d38a03544468ccf1392b1864402&format=json
  let url = `http://api.weatherbit.io/v2.0/forecast/daily?days=5&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
  let weatherApiData = await axios.get(url);
  // response.send(weatherApiData.data.data);
  let data = weatherApiData.data.data;
  data.forEach(obj => {
    results.push(
      new Forecast(obj)
    );
  })
  if (results.length === 0){
    let errorMessage = `Error 500: Internal Server Error`;
    response.send(new Error(errorMessage, 500));
    return;
  }

  response.send(results);
})

// star(catch all) route
app.get('*', (request, response) => {
  let errorMessage = `Error 500: Internal Server Error`;
  response.send(new Error(errorMessage, 500));
});

// ************************ CLASSES **************** 
class Forecast{
  constructor(obj){
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description}`;
    this.date = obj.datetime;
  }
}

class Error{
  constructor(message, code){
    this.errorMessage = message;
    this.statusCode = code;
  }

  toString() {
    return `Error ${this.statusCode}: ${this.errorMessage}`
  }
}

// ********************* listener **********************

app.listen(PORT, () => console.log(PORT)); // testing port in terminal

// server is listening for routes which are used to access endpoints aka data needed from api