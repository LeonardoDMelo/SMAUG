const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const consoleRoutes = require('./routes/consoleRoutes');
const gameRoutes = require('./routes/gameRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const quizRoutes = require('./routes/quizRoutes');
const externalGameRoutes = require('./routes/externalGameRoutes');
require('./services/achievementService');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SMAUG API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/consoles', consoleRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/external', externalGameRoutes);

module.exports = app;
