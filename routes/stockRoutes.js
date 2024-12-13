const { Router } = require('express');
const { getStockData } = require('../controllers/stockController');

const stockRouter = Router();

stockRouter.get('/:symbol', getStockData);

module.exports = stockRouter;
