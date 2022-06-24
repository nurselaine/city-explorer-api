'use strict';

// ******************* REQUIRES *******************

// const { response, request } = require('express');
const express = require('express'); // create instance of express
const axios = require('axios');
const cors = require('cors');
const { title } = require('process');
require('dotenv').config(); // import dotenv 
const PORT = process.env.PORT || 3002; // check to make sure working on correct port 

const app = express();
app.use(cors());
let getWeather = require('./modules/my-weather');
let getMovies = require('./modules/movies');

// ******************  ROUTES   *************************

app.get('/', (request,response) => {
  response.send(`hello ${PORT}`);
})

app.get('/weather', getWeather);

app.get('/movies', getMovies);

// star(catch all) route
app.get('*', (request, response) => {
  let errorMessage = `Error 500: Internal Server Error`;
  response.send(new Error(errorMessage, 500));
});

// ************************ CLASSES **************** 

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

// error handler=demo app.use for error

app.listen(PORT, () => console.log(PORT)); // testing port in terminal

// server is listening for routes which are used to access endpoints aka data needed from api