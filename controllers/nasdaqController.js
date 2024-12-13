import { getNasdaqConstituents } from '../services/nasdaqService.js';

export const getNasdaqConstituents = async (req, res) => {
  try {
    const data = await getNasdaqConstituents();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Nasdaq constituents:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || 'Internal server error',
      details: error.details || null,
    });
  }
};
