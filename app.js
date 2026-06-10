const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'StackPredict node orchestration gateway active.' });
});

app.post('/predict', async (req, res) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/predict', req.body);
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.data) {
      return res.status(err.response.status).json({
        status: 'error',
        error: err.response.data.message || err.response.data.error || 'Upstream data validation mismatch.'
      });
    }
    res.status(500).json({ 
      status: 'error',
      error: 'Core ML Matrix Server structural timeout. Verify your python app.py is running on port 5000.' 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Node environment reverse proxy running: http://localhost:${PORT}`);
});
