const cors = require('cors');
const express = require('express'); // create instance of express
const axios = require('axios');
require('dotenv').config(); // import dotenv 

const app = express();
app.use(cors());


const getWeather = (request, response, next) => {
  console.log("here")
    // try {
      const lat = request.query.lat;
      const lon = request.query.lon;
      const city = request.query.searchQuery;
    // // http://api.weatherbit.io/v2.0/forecast/daily?days=5&lat=35.7796&lon=-78.6382&key=f0e83d38a03544468ccf1392b1864402&format=json
      let url = `http://api.weatherbit.io/v2.0/forecast/daily?days=5&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
      let params = {
        lat: lat,
        lon: lon,
      }
      
        const result = axios.get(url, {params})   
          .then(weatherApiData => weatherApiData.data.data.map(obj => new Forecast(obj)))
          .then(results => {
            response.send(results)
            console.log(results);
            return results;
          })
          .catch(error => next(error));
        console.log('weather');
}

class Forecast{
  constructor(obj){
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description}`;
    this.date = obj.datetime;
  }
}

module.exports = getWeather;