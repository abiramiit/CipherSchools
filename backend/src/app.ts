import express from 'express';
import cors from 'cors';
import { problemRoutes } from './routes/problem.routes';
import { attemptRoutes } from './routes/attempt.routes';

const app = express();

const getAllowedOrigins = () => {
    const urls = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
    const origins = urls.split(',').map(url => url.trim()).filter(Boolean);
    origins.push('http://localhost:5173');
    origins.push('http://localhost:4173');
    return origins;
};

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowedOrigins = getAllowedOrigins();
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use('/api/problems', problemRoutes);
app.use('/api/attempts', attemptRoutes);

export { app };
