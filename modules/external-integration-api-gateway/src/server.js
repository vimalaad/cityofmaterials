/**
 * Element City - External Integration & API Gateway Server
 * 
 * This service provides a unified interface to external services:
 * - OpenRouter for LLM completions
 * - (future) News APIs
 * - (future) Text-to-Speech
 * 
 * It adds resilience with retries, rate limiting, and error handling.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const healthRoutes = require('./routes/health');
const llmRoutes = require('./routes/llm');

// Import middleware (placeholders)
const rateLimiter = require('./middleware/rate-limiter');
const errorHandler = require('./middleware/error-handler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rate limiting (global - adjust per route as needed)
app.use(rateLimiter({ windowMs: 60000, maxRequests: 100 }));

// Routes
app.use('/health', healthRoutes);
app.use('/llm', llmRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`╔══════════════════════════════════════════════════════╗`);
  console.log(`║  Element City - External Integration Gateway        ║`);
  console.log(`║  Running on: http://localhost:${PORT}                 ║`);
  console.log(`╠══════════════════════════════════════════════════════╣`);
  console.log(`║  Health: http://localhost:${PORT}/health             ║`);
  console.log(`║  LLM:    http://localhost:${PORT}/llm/chat           ║`);
  console.log(`╚══════════════════════════════════════════════════════╝`);
});
