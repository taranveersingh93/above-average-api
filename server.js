const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index');

const app = express();
const port = process.env.PORT || 3001;
app.set('port', port);
app.locals.title = 'Above Average API';

const allowedOrigins = ['https://taranveer-above-average.vercel.app'];

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`${app.locals.title} is running on http://localhost:${port}.`);
});
