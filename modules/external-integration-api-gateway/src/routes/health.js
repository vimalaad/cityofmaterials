/**
 * Health Routes
 * 
 * Basic health check endpoints for the gateway service.
 */

const express = require('express');
const router = express.Router();
const pkg = require('../../package.json');

// GET /health
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'external-integration-api-gateway',
    version: pkg.version,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
