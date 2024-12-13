const { Router } = require('express');
const { getNasdaqConstituents } = require('../controllers/nasdaqController');

const nasdaqRouter = Router();

nasdaqRouter.get('/nasdaqConstituents', getNasdaqConstituents);

module.exports = nasdaqRouter;
