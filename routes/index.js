import { Router } from 'express';
import nasdaqRouter from './nasdaqRoutes';
import stockRouter from './stockRoutes';

const router = Router();

router.use(nasdaqRouter);
router.use(stockRouter);

export default router;
