import { getCache, setCache } from '../helpers/cacheHelper.js';
import fetch from 'node-fetch';
import { isCacheValid } from '../helpers/cacheHelper.js';

export const getNasdaqConstituents = async () => {
  try {
    const cachedData = getCache('nasdaqConstituents');
    const cacheDate = getCache('nasdaqConstituentsDate');

    if (cachedData && cacheDate && isCacheValid(cacheDate)) {
      return cachedData;
    }

    const response = await fetch(`https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${process.env.REACT_APP_API_KEY_2}`);
    const responseJSON = await response.json();

    if (response.status === 429) {
      const error = new Error('Too many requests');
      error.statusCode = 429;
      throw error;
    } else if (!response.ok) {
      const error = new Error('Failed to fetch Nasdaq constituents');
      error.statusCode = response.status;
      error.details = responseJSON;
      throw error;
    }

    setCache('nasdaqConstituents', responseJSON);
    setCache('nasdaqConstituentsDate', new Date());

    return responseJSON;
  } catch (error) {
    throw error;
  }
};
