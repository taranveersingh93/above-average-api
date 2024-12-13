import { Router } from 'express';
import { getStockData } from '../controllers/stockController';

const stockRouter = Router();

stockRouter.get('/:symbol', getStockData);

export default stockRouter;
