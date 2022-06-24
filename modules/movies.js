const cors = require('cors');
const express = require('express'); // create instance of express
const axios = require('axios');
require('dotenv').config(); // import dotenv 

const app = express();
app.use(cors());
let cache = require('./cache.js');

const getMovies = async (req, res, next) => {
  try {
    let movieResults = [];
    const city = req.query.query;
    const key = `${city}-movies`
    const timeToCache = 1000 * 60 * 60 * 24 * 30;

    if (cache[key] && (Date.now() - cache[key].timestamp < timeToCache)) {
      console.log('cache hit');
      res.status(200).send(cache[key].data);
    } else {
      console.log('cache miss');

      cache[key] = {};
      cache[key].timestamp = Date.now();
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${city}`;
      cache[key].data = await axios.get(url);
      let movieData = cache[key].data.data;
      let sanitizeData = movieData.results.forEach(obj => {
      movieResults.push(
        new Movie(obj.title, obj.overview, obj.vote_average, obj.vote_count, obj.poster_path, obj.popularity, obj.release_date)
      )
    })
    cache[key].data = movieResults;
    res.status(200).send(movieResults);
    }
  } catch (error) {
    next(error);
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

module.exports = getMovies;