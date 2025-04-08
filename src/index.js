require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDatabase = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error-handler');
const gracefulShutdown = require('./utils/graceful-shutdown');

const app = express();

connectDatabase();

app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.send('ISP Backend Running...');
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(
        `Server running on ${
            process.env.NODE_ENV === 'development'
                ? `http://localhost:${PORT}`
                : `port ${PORT}`
        }`
    );
});

gracefulShutdown(server);