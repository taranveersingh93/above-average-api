const express = require('express');
const app = express();
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const NodeCache = require("node-cache");
const myCache = new NodeCache();
require('dotenv').config()

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Above Average API';

app.use(cors({
  origin: 'https://taranveer-above-average.vercel.app'
}));
// app.use(cors());
app.use(express.json());

const isDateToday = (date) => {
  const today = new Date();
  const dateString = today.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const dateArray1 = dateString.split("/"); // mm/dd/yyyy

  const dateArray2 = date.split("-"); //yyyy-mm-dd
  const datesMatch = parseInt(dateArray1[1]) === parseInt(dateArray2[2]);
  const monthsMatch = parseInt(dateArray1[0]) === parseInt(dateArray2[1]);
  const yearsMatch = parseInt(dateArray1[2]) === parseInt(dateArray2[0]);
  return datesMatch && monthsMatch && yearsMatch;
};

app.get('/nasdaqData', async (req, res) => {
  try {

    const localResponse = myCache.get("nasdaqData");
    let localResponseGood = false;

    if (localResponse?.historical) {
        localResponseGood = isDateToday(localResponse.historical[0].date);
    }

    if(localResponse && localResponseGood) {
      res.status(200).json(localResponse);
    } else {
      response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/%5ENDX?apikey=${process.env.REACT_APP_API_KEY}`)
      const responseJSON = await response.json()
      myCache.set("nasdaqData", responseJSON);
      
      if (response.status === 429) {
        res.status(429).json(responseJSON)
      } else if (!response.ok) {
        res.status(404).json(responseJSON)
      } else {
        res.status(200).json(responseJSON)
      }
    }
  
  } catch (error) {
    res.status(500).json({message: error})
  }
  
});

app.get('/nasdaqConstituents', async (req, res) => {
  try {

    const localResponse = myCache.get("nasdaqConstituents");

    if (!localResponse) {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${process.env.REACT_APP_API_KEY}`)
      const responseJSON = await response.json();
      myCache.set("nasdaqConstituents", responseJSON, 3600);
      if (response.status === 429) {
        res.status(429).json(responseJSON)
      } else if (!response.ok) {
        res.status(404).json(responseJSON)
      } else {
        res.status(200).json(responseJSON)
      }
    } else {
      res.status(200).json(localResponse);
    }
  } catch (error) {
    res.status(500).json({message: error})
  }
})

app.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;

    const localResponse = myCache.get(`${symbol}Stock`);
    let localResponseGood = false;

    if (localResponse?.historical) {
      localResponseGood = isDateToday(localResponse.historical[0].date);
    }
    

    if (localResponseGood) {
      res.status(200).json(localResponse);
    } else {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=151&apikey=${process.env.REACT_APP_API_KEY}`)
      const responseJSON = await response.json()
      
      myCache.set(`${symbol}Stock`, responseJSON);
  
      if (response.status === 429) {
        res.status(429).json(responseJSON)
      } else if (!response.ok) {
        res.status(404).json(responseJSON)
      } else {
        res.status(200).json(responseJSON)
      }
    }
  } catch (error) {
    res.status(500).json({message: error})
  }
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});