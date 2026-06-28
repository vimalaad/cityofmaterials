/**
 * Element City - Data Service API
 * Module: element-lore-story-database-service
 * 
 * This server exposes the data loader functions as a REST API.
 * Other modules (conversation engine, frontend, admin) communicate
 * with this service via HTTP.
 */

const express = require('express');
const cors = require('cors');
const db = require('./src/data-loader');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// HEALTH & STATUS
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'element-lore-story-database-service'
  });
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cache/status', (req, res) => {
  try {
    const status = db.getCacheStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cache/clear', (req, res) => {
  try {
    db.clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ELEMENT ROUTES
// ============================================

// IMPORTANT: Order matters! More specific routes MUST come before /:id

// 1. Search elements
app.get('/api/elements/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query required (use ?q=...)' });
  }
  try {
    const results = db.searchElements(query);
    res.json({ results, count: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get elements by category
app.get('/api/elements/category/:category', (req, res) => {
  try {
    const elements = db.getElementsByCategory(req.params.category);
    res.json({ elements, count: elements.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get all elements (with optional enrichment)
app.get('/api/elements', (req, res) => {
  const enrich = req.query.enrich === 'true';
  try {
    let elements;
    if (enrich) {
      elements = db.getAllElementsWithRelationships();
    } else {
      const elementsObj = db.getAllElements();
      elements = Object.values(elementsObj);
    }
    res.json({ elements, count: elements.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get element by symbol
app.get('/api/elements/symbol/:symbol', (req, res) => {
  try {
    const element = db.getElementBySymbol(req.params.symbol);
    if (!element) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.json(element);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get element by name
app.get('/api/elements/name/:name', (req, res) => {
  try {
    const element = db.getElementByName(req.params.name);
    if (!element) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.json(element);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get element profile (enriched: element + relationships + stories)
app.get('/api/elements/:id/profile', (req, res) => {
  try {
    const profile = db.getElementProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Get stories for an element
app.get('/api/elements/:id/stories', (req, res) => {
  try {
    const stories = db.getStoriesByElement(req.params.id);
    res.json({ stories, count: stories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Get relationships for an element
app.get('/api/elements/:id/relationships', (req, res) => {
  const type = req.query.type;
  try {
    let relationships;
    if (type) {
      // Filter by type if provided
      const allRels = db.getRelationships(req.params.id);
      relationships = allRels.filter(r => r.type === type);
    } else {
      relationships = db.getRelationships(req.params.id);
    }
    res.json({ relationships, count: relationships.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Get friends of an element
app.get('/api/elements/:id/friends', (req, res) => {
  try {
    const friends = db.getFriends(req.params.id);
    res.json({ friends, count: friends.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Get rivals of an element
app.get('/api/elements/:id/rivals', (req, res) => {
  try {
    const rivals = db.getRivals(req.params.id);
    res.json({ rivals, count: rivals.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. Get element by ID (MUST BE LAST - catches all other /:id routes)
app.get('/api/elements/:id', (req, res) => {
  try {
    const element = db.getElementById(req.params.id);
    if (!element) {
      return res.status(404).json({ error: 'Element not found' });
    }
    res.json(element);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// STORY ROUTES
// ============================================

// 1. Get all stories
app.get('/api/stories', (req, res) => {
  try {
    const storiesObj = db.getAllStories();
    const stories = Object.values(storiesObj);
    res.json({ stories, count: stories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get stories by type
app.get('/api/stories/type/:type', (req, res) => {
  try {
    const stories = db.getStoriesByType(req.params.type);
    res.json({ stories, count: stories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get common stories
app.get('/api/stories/common', (req, res) => {
  try {
    const stories = db.getCommonStories();
    res.json({ stories, count: stories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Search stories
app.get('/api/stories/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query required (use ?q=...)' });
  }
  try {
    const results = db.searchStories(query);
    res.json({ results, count: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get enriched story (with full element objects)
app.get('/api/stories/:id/enriched', (req, res) => {
  try {
    const story = db.getEnrichedStory(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get story by ID (MUST BE LAST for /stories/:id)
app.get('/api/stories/:id', (req, res) => {
  try {
    const story = db.getStoryById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RELATIONSHIP ROUTES
// ============================================

// 1. Get all relationships
app.get('/api/relationships', (req, res) => {
  try {
    const relationships = db.loadRelationships();
    res.json({ relationships, count: relationships.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get relationships by type
app.get('/api/relationships/type/:type', (req, res) => {
  try {
    const relationships = db.getRelationshipsByType(req.params.type);
    res.json({ relationships, count: relationships.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get relationship between two elements
app.get('/api/relationships/between/:id1/:id2', (req, res) => {
  try {
    const relationships = db.getRelationshipBetween(req.params.id1, req.params.id2);
    res.json({ relationships, count: relationships.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`╔══════════════════════════════════════════════════════╗`);
  console.log(`║  Element City - Data Service                        ║`);
  console.log(`║  Running on: http://localhost:${PORT}                 ║`);
  console.log(`╠══════════════════════════════════════════════════════╣`);
  console.log(`║  Health:      http://localhost:${PORT}/api/health     ║`);
  console.log(`║  Elements:    http://localhost:${PORT}/api/elements   ║`);
  console.log(`║  Stories:     http://localhost:${PORT}/api/stories    ║`);
  console.log(`║  Stats:       http://localhost:${PORT}/api/stats      ║`);
  console.log(`╚══════════════════════════════════════════════════════╝`);
});