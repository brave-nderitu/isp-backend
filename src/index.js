require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('ISP Backend Running...');
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Server running on http://localhost:${PORT}`);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});

process.on('SIGINT', async () => {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0);
});