const express = require('express');
const app = express();
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Above Average API';

app.use(cors());
app.use(express.json());

app.get('/nasdaqData', async (req, res) => {
  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/%5ENDX?apikey=${process.env.REACT_APP_API_KEY}`)
    const responseJSON = await response.json()
  
    if (response.status === 429) {
      res.status(429).json(responseJSON)
    } else if (!response.ok) {
      res.status(404).json(responseJSON)
    } else {
      res.status(200).json(responseJSON)
    }
  } catch (error) {
    res.status(500).json({message: error})
  }
  
});

app.get('/nasdaqConstituents', async (req, res) => {
  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${process.env.REACT_APP_API_KEY}`)
    const responseJSON = await response.json()
  
    if (response.status === 429) {
      res.status(429).json(responseJSON)
    } else if (!response.ok) {
      res.status(404).json(responseJSON)
    } else {
      res.status(200).json(responseJSON)
    }
  } catch (error) {
    res.status(500).json({message: error})
  }
})

app.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=151&apikey=${process.env.REACT_APP_API_KEY}`)
    const responseJSON = await response.json()

    if (response.status === 429) {
      res.status(429).json(responseJSON)
    } else if (!response.ok) {
      res.status(404).json(responseJSON)
    } else {
      res.status(200).json(responseJSON)
    }
  } catch (error) {
    res.status(500).json({message: error})
  }
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});