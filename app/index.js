import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import config from 'config';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import urlRouter from './routes/u';
import apiRouter from './routes/api';

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : config.server.port;

// Setup express
const app = express();

// Log client access to file
const accessLogStream = fs.createWriteStream(path.join(__dirname, '..', 'logs', 'access.log'), { flags: 'a' });

// Configure express
app.use(cors());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup routes
app.use('/u', urlRouter);
app.use('/api', apiRouter);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
