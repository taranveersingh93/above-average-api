import { getStockData } from '../services/stockService.js';

export const getStockData = async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const data = await getStockData(symbol);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching stock data for symbol:', symbol, error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || 'Internal server error',
      details: error.details || null,
    });
  }
};
