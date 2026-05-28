const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const personalRoutes = require('./routes/personalRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const biometricoRoutes = require('./routes/biometricoRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const correspondenciaRoutes = require('./routes/correspondenciaRoutes');
const configRoutes = require('./routes/configRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const { startEstadoJob } = require('./cron/estadoJob');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/correspondencia', correspondenciaRoutes);
app.use('/api/config', configRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/biometrico', biometricoRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/turnos', turnoRoutes);

app.get('/', (req, res) => {
  res.send('API RRHH Hospital Barrios Mineros funcionando');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;
