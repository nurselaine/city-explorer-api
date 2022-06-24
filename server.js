'use strict';
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const { title } = require('process');
require('dotenv').config(); // import dotenv 
const PORT = process.env.PORT || 3002; // check to make sure working on correct port 

const app = express();
app.use(cors());

const weather = require('./modules/weather.js');
let getMovies = require('./modules/movies');
const cache = require('./modules/cache');

app.get('/', (request,response) => {
  response.send(`hello ${PORT}`);
})

app.get('/weather', weather);
app.get('/movies', getMovies);


// function weatherHandler(request, response) {
//   const lat = req.query.lat;
//   const lon = req.query.lon;
//   weather(lat, lon)
//   .then(summaries => response.send(summaries))
//   .catch((error) => {
//     console.error(error);
//     response.status(200).send('Sorry. Something went wrong!')
//   });
// } 

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));