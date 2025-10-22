import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/api/data', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'ZC';
    const period1 = req.query.period1 || '1740077600';
    const period2 = req.query.period2 || '1761077420';
    const response = await fetch(`https://query2.finance.yahoo.com/v8/finance/chart/${symbol}=F?period1=${period1}&period2=${period2}&interval=1mo`);
    const apiData = await response.json();
    
    const result = apiData.chart.result[0];
    const timestamps = result.timestamp;
    const opens = result.indicators.quote[0].open;
    const closes = result.indicators.quote[0].close;
    
    const data = {
      card: timestamps.map((timestamp, index) => ({
        timestamp,
        open: opens[index],
        close: closes[index]
      }))
    };
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
