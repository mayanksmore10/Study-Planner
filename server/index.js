const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const subjectRoutes = require('./routes/subjects');
const scheduleRoutes = require('./routes/schedule');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/schedule', scheduleRoutes);

app.get('/', (req, res) => res.json({ message: 'Study Planner API running!' }));

const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studyplanner')
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
    })
    .catch((err) => console.error('MongoDB error:', err));
