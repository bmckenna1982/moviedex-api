require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./moviedex.json')

const app = express()

app.use(morgan('common'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request'})
  }
  next()
})

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query
  let response = MOVIEDEX

  if(genre) {
    response = response.filter(movie => 
    movie.genre.toLowerCase().includes(genre.toLowerCase()))
  }

  if(country) {
    response = response.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase()))
  }

  if(avg_vote) {    
    response = response.filter(movie =>
      movie.avg_vote >= Number(avg_vote))
  }

  res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log('Server started on PORT 8000')
})