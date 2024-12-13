const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index.js'); // Replace import with require

const app = express();
app.set('port', process.env.PORT || 3001);
app.locals.title = 'Above Average API';

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
