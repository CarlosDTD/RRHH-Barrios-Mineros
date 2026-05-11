const express = require('express');
const cors = require('cors');
require('dotenv').config();

const personalRoutes = require('./routes/personalRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/personal', personalRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('API RRHH Hospital Barrios Mineros funcionando');
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;
