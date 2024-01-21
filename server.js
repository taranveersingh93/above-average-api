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

const isDateToday = (cacheDate) => {
  if (!cacheDate) {
    return false;
  }
  const today = new Date();
  const todayHours = today.getUTCHours();
  const cacheHours = cacheDate.getUTCHours();
  const cacheMinutes = cacheDate.getMinutes();
  const todayMinutes = today.getMinutes();
  const cacheTimePast11 = cacheHours > 22;
  const cacheTime1030 = cacheHours === 22 && cacheMinutes > 30;
  const todayTimePast11 = todayHours > 22;
  const todayTime1030 = todayHours === 22 && todayMinutes > 30;
  const cacheTimeCutoffGood = cacheTime1030 || cacheTimePast11;
  const currentTimeCutOffGood = todayTime1030 || todayTimePast11;
  const weekendToday = today.getDay() === 6 || today.getDay() === 0;

  //weekend today but cache is good.
  if (weekendToday && cacheDate.getDay() === 5 && cacheTimeCutoffGood) {
    return true
  }

  //weekend same day 
  if (weekendToday && today.getDate() === cacheDate.getDate() && today.getMonth() === today.getMonth()) {
    return true
  }

  //same day after 5:30
  if (today.getDate() === cacheDate.getDate() && today.getMonth() === today.getMonth() && cacheTimeCutoffGood) {
    return true;
  }

  //same day, before 5:30
  if (today.getDate() === cacheDate.getDate() && today.getMonth() === today.getMonth() && !cacheTimeCutoffGood && !currentTimeCutOffGood) {
    return true;
  }

  //different day, not more than 1 day gap, cache is past cutoff but today time not past 5:30 
  if (today - cacheDate <= 86400000 && cacheTimeCutoffGood && !currentTimeCutOffGood) {
    return true;
  }

  return false;
  // const dateString = today.toLocaleString("en-US", {
  //   timeZone: "America/New_York",
  // });
  // const dateArray1 = dateString.split("/"); // mm/dd/yyyy

  // const dateArray2 = date.split("-"); //yyyy-mm-dd
  // const datesMatch = parseInt(dateArray1[1]) === parseInt(dateArray2[2]);
  // const monthsMatch = parseInt(dateArray1[0]) === parseInt(dateArray2[1]);
  // const yearsMatch = parseInt(dateArray1[2]) === parseInt(dateArray2[0]);
  // return datesMatch && monthsMatch && yearsMatch;
};

app.get('/nasdaqData', async (req, res) => {
  try {

    let localResponse = myCache.get("nasdaqData");
    let localResponseGood = false;

    if (localResponse?.historical) {
        localResponseGood = isDateToday(myCache.get("nasdaqDataDate"));
    }

    if(localResponse && localResponseGood) {
      res.status(200).json(localResponse);
    } else {
      response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/%5ENDX?apikey=${process.env.REACT_APP_API_KEY}`)
      const responseJSON = await response.json()
      const cacheDate = new Date();
      myCache.set("nasdaqDataDate", cacheDate);
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
      const cacheDate = new Date();
      myCache.set("nasdaqConstituentsDate", cacheDate);
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
      localResponseGood = isDateToday(myCache.get(`${symbol}StockDate`));
    }
    
    if (localResponse && localResponseGood) {
      res.status(200).json(localResponse);
    } else {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=151&apikey=${process.env.REACT_APP_API_KEY}`)
      const responseJSON = await response.json()
      const cacheDate = new Date();
      myCache.set(`${symbol}StockDate`, cacheDate);
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