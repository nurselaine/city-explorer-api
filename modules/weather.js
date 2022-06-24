'use strict';

// ***************** Reqiures ****************
const cors = require('cors');
const express = require('express'); // create instance of express
const axios = require('axios');
require('dotenv').config(); // import dotenv 

const app = express();
app.use(cors());
let cache = require('./cache.js');

// ************ Request and Response **************

const getWeather = (request, response, need) => {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const key = `weather-${lat}-and-${lon}`;
  // const key = 'weather-' + latitude + longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?days=5&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
  const timeToCache = 1000 * 60 * 60 * 24; // millisec in one day
   if (cache[key] && (Date.now() - cache[key].timestamp < timeToCache)) {
    console.log('Cache hit');
    let data = cache[key].data;
    response.status(200).send(data);
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
    .then(response => parseWeather(response.data))
    .then(results => {
      cache[key].data = results;
      // console.log(results);
      response.status(200).send(results);
    });
    
  }
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`;
    this.time = day.datetime;
  }
}


module.exports = getWeather;