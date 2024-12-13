const { Router } = require('express');
const nasdaqRouter = require('./nasdaqRoutes');
const stockRouter = require('./stockRoutes');

const router = Router();

router.use(nasdaqRouter);
router.use(stockRouter); 

module.exports = router;
