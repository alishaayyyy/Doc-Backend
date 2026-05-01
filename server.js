const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// --- 1. API ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// --- 2. DEPLOYMENT (Static Files Handling) ---
if (process.env.NODE_ENV === 'production') {
    // Make sure 'client/dist' match karta hai aapke frontend build folder ke name se
    app.use(express.static(path.join(__dirname, 'client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });
}

// --- 3. Serverless & Local Compatibility ---
const PORT = process.env.PORT || 5000;

// Sirf tab listen karein agar hum local machine par hain (development mode)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel ke liye app export karein
module.exports = app;