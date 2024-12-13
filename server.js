const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index');  // No need to add '.js' when requiring JavaScript files in Node.js

const app = express();
const port = process.env.PORT || 3001;
app.set('port', port);
app.locals.title = 'Above Average API';

const allowedOrigins = ['https://taranveer-above-average.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`${app.locals.title} is running on http://localhost:${port}.`);
});
