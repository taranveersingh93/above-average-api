import { getCache, setCache } from '../helpers/cacheHelper.js';
import fetch from 'node-fetch';

export const getNasdaqConstituents = async (req, res) => {
  try {
    const cachedData = getCache('nasdaqConstituents');
    const cacheDate = getCache('nasdaqConstituentsDate');

    if (cachedData && cacheDate && isCacheValid(cacheDate)) {
      return res.status(200).json(cachedData);
    }

    const response = await fetch(`https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${process.env.REACT_APP_API_KEY_2}`);
    const responseJSON = await response.json();

    if (response.status === 429) {
      return res.status(429).json({ error: 'Too many requests', details: responseJSON });
    } else if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch Nasdaq constituents', details: responseJSON });
    }

    setCache('nasdaqConstituents', responseJSON);
    setCache('nasdaqConstituentsDate', new Date());

    return res.status(200).json(responseJSON);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
