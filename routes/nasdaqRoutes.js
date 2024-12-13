const { Router } = require('express');
import { getNasdaqConstituents } from '../controllers/nasdaqController';

const nasdaqRouter = Router();

nasdaqRouter.get('/nasdaqConstituents', getNasdaqConstituents);

export default nasdaqRouter;
