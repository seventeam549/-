const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

let locations = [];

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/location', (req, res) => {
  const { lat, lon } = req.body;
  locations.push({ lat, lon, time: new Date() });
  res.json({ status: 'OK' });
});

app.get('/dashboard', (req, res) => {
  let html = '<h1>📍 دریافت موقعیت‌ها</h1><ul>';
  for (let loc of locations) {
    html += `<li>${loc.time.toLocaleString()}: ${loc.lat}, ${loc.lon}</li>`;
  }
  html += '</ul>';
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
