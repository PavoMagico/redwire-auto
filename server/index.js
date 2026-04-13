require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const routes  = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/api', routes);
app.get('/', (_, res) => res.json({ status: 'Red Wire Auto API v1.0 running' }));

app.listen(PORT, () =>
  console.log(`\n🚗 Red Wire Auto API → http://localhost:${PORT}\n`)
);