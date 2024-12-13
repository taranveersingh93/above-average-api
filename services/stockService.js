const { getCache, setCache, isCacheValid } = require('../helpers/cacheHelper');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const getStockDataFromApi = async (symbol) => {
  try {
    const cacheKey = `${symbol}Stock`;
    const cacheDateKey = `${symbol}StockDate`;

    const cachedData = getCache(cacheKey);
    const cacheDate = getCache(cacheDateKey);

    if (cachedData && cacheDate && isCacheValid(cacheDate)) {
      return cachedData;
    }

    const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=151&apikey=${process.env.REACT_APP_API_KEY_2}`);
    const responseJSON = await response.json();

    if (response.status === 429) {
      const error = new Error('Too many requests');
      error.statusCode = 429;
      throw error;
    } else if (!response.ok) {
      const error = new Error(`Failed to fetch stock data for ${symbol}`);
      error.statusCode = response.status;
      error.details = responseJSON;
      throw error;
    }

    setCache(cacheKey, responseJSON);
    setCache(cacheDateKey, new Date());

    return responseJSON;
  } catch (error) {
    throw error;
  }
};

module.exports = {getStockDataFromApi}