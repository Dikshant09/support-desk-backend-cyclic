const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 9000;
const colors = require('colors');
const userRoutes = require('./routes/userRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');

// Connect to database
const { connectDB } = require('./config/db.js');
connectDB();

// Using middleware to get the data which is passed by user in post request : to Parse data
app.use(express.urlencoded({ extended: false }))

// Parse json
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
    // Set build folder as static
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    // FIX: below code fixes app crashing on refresh in deployment
    app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
    })
} else {
}
app.get('/api/', (req, res) => {
res.status(200).json({ message: 'Welcome to the Support Desk API' })
})

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
})