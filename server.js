'use strict';

// ******************* REQUIRES *******************

// const { response, request } = require('express');
const express = require('express'); // create instance of express
const axios = require('axios');
const weatherData = require('./data/weather.json');
const cors = require('cors');
const { title } = require('process');
require('dotenv').config(); // import dotenv 
const PORT = process.env.PORT || 3002; // check to make sure working on correct port 

const app = express();
app.use(cors());

// ******************  ROUTES   *************************

app.get('/', (request,response) => {
  response.send(`hello ${PORT}`);
})

app.get(`/weather`, async (request, response, next) => {
  try {
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
  } catch (error) {
    next(error);
  } 
})

app.get('/movies', async (req, res, next) => {
  try {
    let movieResults = [];
    const city = req.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${city}`;
    let movieData = await axios.get(url);
    movieData = movieData.data;
    let sanitizeData = movieData.results.forEach(obj => {
      movieResults.push(
        new Movie(obj.title, obj.overview, obj.vote_average, obj.vote_count, obj.poster_path, obj.popularity, obj.release_date)
      )
    })
    res.send(movieResults);
  } catch (error) {
    next(error);
  }
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

class Movie{
  constructor(title, overview, averageVote, totalVote, imageUrl, popularity, releasedOn){
    this.title = title;
    this.overview = overview;
    this.averageVote = averageVote;
    this.totalVote = totalVote;
    this.imageUrl = imageUrl;
    this.popularity = popularity;
    this.releasedOn = releasedOn;
  }
}

// ********************* listener **********************

app.listen(PORT, () => console.log(PORT)); // testing port in terminal

// server is listening for routes which are used to access endpoints aka data needed from api