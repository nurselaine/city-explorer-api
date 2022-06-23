const cors = require('cors');
const express = require('express'); // create instance of express
const axios = require('axios');
require('dotenv').config(); // import dotenv 

const app = express();
app.use(cors());

const getMovies = async (req, res, next) => {
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