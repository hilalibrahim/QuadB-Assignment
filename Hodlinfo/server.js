//We Can start the application using command npm start
//cd Hodlinfo
//npm start or node server.js
const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tickers',
  password: 'hilal',
  port: 5432,
});

app.use(express.static('frontend'));

app.get('/', async (req, res) => {
  try {
    // Fetch data from the WazirX API
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = response.data;

    // Store the top 10 results in the PostgreSQL database
    const top10Tickers = Object.values(tickers).slice(0, 10);
    await storeTickersInDatabase(top10Tickers);

    res.send('Data stored successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/tickers', async (req, res) => {
  try {
    // Retrieve data from the PostgreSQL database
    const result = await pool.query('SELECT * FROM tickers');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Function to store tickers in the database
async function storeTickersInDatabase(tickers) {
  const client = await pool.connect();

  try {
    await client.query('CREATE TABLE IF NOT EXISTS tickers (name VARCHAR, last VARCHAR, buy VARCHAR, sell VARCHAR, volume VARCHAR, base_unit VARCHAR)');

    for (const ticker of tickers) {
      const { symbol, last, buy, sell, volume, base_unit } = ticker;

      await client.query('INSERT INTO tickers VALUES ($1, $2, $3, $4, $5, $6)',
        [symbol, last, buy, sell, volume, base_unit]);
    }
  } finally {
    client.release();
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
