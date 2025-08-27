import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errorHandler } from './common/middlewares/error.middleware';
import { apiRouter } from './api/api.routes';
// import compression from 'compression';


const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Get allowed origins from environment variable or use default
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [
      'http://localhost:3001',
    ];

    console.log('CORS - Incoming origin:', origin);
    console.log('CORS - Allowed origins:', allowedOrigins);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all origins in development for easier testing
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy violation. Origin '${origin}' not allowed. Allowed origins: ${allowedOrigins.join(', ')}`;
      console.error(msg);
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware for debugging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes goes here
app.use('/api', apiRouter);

// Health check
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Error handler goes here
app.use(errorHandler);

export default app;