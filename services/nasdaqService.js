const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const myCache = require('node-cache')();

const getNasdaqConstituentsFromCacheOrAPI = async () => {
  const localResponse = myCache.get("nasdaqConstituents");
  if (!localResponse) {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${process.env.REACT_APP_API_KEY_2}`);
    const responseJSON = await response.json();
    myCache.set("nasdaqConstituents", responseJSON, 3600);
    const cacheDate = new Date();
    myCache.set("nasdaqConstituentsDate", cacheDate);
    return responseJSON;
  } else {
    return localResponse;
  }
};

module.exports = { getNasdaqConstituentsFromCacheOrAPI };
