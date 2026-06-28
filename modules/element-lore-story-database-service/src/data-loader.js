/**
 * Element City - Data Loader Module
 * Module: element-lore-story-database-service
 * 
 * This module provides simple data loading and querying functions
 * for the Element City platform. It reads from JSON files and
 * provides a clean API for accessing element, story, and relationship data.
 * 
 * TODO: Later upgrade this to use Redis (Vercel KV) for production
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

// Path to data files (relative to this file)
const DATA_DIR = path.join(__dirname, '../data');

// File paths
const ELEMENTS_FILE = path.join(DATA_DIR, 'elements', 'elements.json');
const STORIES_FILE = path.join(DATA_DIR, 'stories', 'stories.json');
const RELATIONSHIPS_FILE = path.join(DATA_DIR, 'relationships', 'relationships.json');

// Cache for loaded data (improves performance)
let cache = {
  elements: null,
  stories: null,
  relationships: null,
  lastLoaded: null
};

// ============================================
// CORE LOADING FUNCTIONS
// ============================================

/**
 * Loads all data from JSON files into memory
 * Uses cache if available to avoid repeated file reads
 * 
 * @param {boolean} forceRefresh - Force reload from files
 * @returns {Object} All loaded data
 */
function loadAllData(forceRefresh = false) {
  // Return cached data if available and not forcing refresh
  if (!forceRefresh && cache.elements && cache.stories && cache.relationships) {
    return {
      elements: cache.elements,
      stories: cache.stories,
      relationships: cache.relationships
    };
  }

  try {
    // Load each JSON file
    const elementsData = JSON.parse(fs.readFileSync(ELEMENTS_FILE, 'utf8'));
    const storiesData = JSON.parse(fs.readFileSync(STORIES_FILE, 'utf8'));
    const relationshipsData = JSON.parse(fs.readFileSync(RELATIONSHIPS_FILE, 'utf8'));

    // Update cache
    cache.elements = elementsData.elements || {};
    cache.stories = storiesData.stories || {};
    cache.relationships = relationshipsData.relationships || [];
    cache.lastLoaded = new Date().toISOString();

    return {
      elements: cache.elements,
      stories: cache.stories,
      relationships: cache.relationships
    };
  } catch (error) {
    console.error('Error loading data files:', error.message);
    // Return empty data structures if files don't exist yet
    return {
      elements: {},
      stories: {},
      relationships: []
    };
  }
}

/**
 * Loads only element data
 * More efficient if you only need elements
 * 
 * @param {boolean} forceRefresh - Force reload from file
 * @returns {Object} Elements data
 */
function loadElements(forceRefresh = false) {
  if (!forceRefresh && cache.elements) {
    return cache.elements;
  }

  try {
    const data = JSON.parse(fs.readFileSync(ELEMENTS_FILE, 'utf8'));
    cache.elements = data.elements || {};
    return cache.elements;
  } catch (error) {
    console.error('Error loading elements:', error.message);
    return {};
  }
}

/**
 * Loads only story data
 * 
 * @param {boolean} forceRefresh - Force reload from file
 * @returns {Object} Stories data
 */
function loadStories(forceRefresh = false) {
  if (!forceRefresh && cache.stories) {
    return cache.stories;
  }

  try {
    const data = JSON.parse(fs.readFileSync(STORIES_FILE, 'utf8'));
    cache.stories = data.stories || {};
    return cache.stories;
  } catch (error) {
    console.error('Error loading stories:', error.message);
    return {};
  }
}

/**
 * Loads only relationship data
 * 
 * @param {boolean} forceRefresh - Force reload from file
 * @returns {Array} Relationships data
 */
function loadRelationships(forceRefresh = false) {
  if (!forceRefresh && cache.relationships) {
    return cache.relationships;
  }

  try {
    const data = JSON.parse(fs.readFileSync(RELATIONSHIPS_FILE, 'utf8'));
    cache.relationships = data.relationships || [];
    return cache.relationships;
  } catch (error) {
    console.error('Error loading relationships:', error.message);
    return [];
  }
}

// ============================================
// ELEMENT QUERY FUNCTIONS
// ============================================

/**
 * Get a single element by ID
 * 
 * @param {string} id - Element ID (e.g., 'oxygen')
 * @returns {Object|null} Element data or null if not found
 */
function getElementById(id) {
  const elements = loadElements();
  return elements[id] || null;
}

/**
 * Get a single element by symbol
 * 
 * @param {string} symbol - Chemical symbol (e.g., 'O')
 * @returns {Object|null} Element data or null if not found
 */
function getElementBySymbol(symbol) {
  const elements = loadElements();
  const element = Object.values(elements).find(el => el.symbol === symbol);
  return element || null;
}

/**
 * Get a single element by name
 * Case-insensitive matching
 * 
 * @param {string} name - Element name (e.g., 'Oxygen')
 * @returns {Object|null} Element data or null if not found
 */
function getElementByName(name) {
  const elements = loadElements();
  const element = Object.values(elements).find(
    el => el.name.toLowerCase() === name.toLowerCase()
  );
  return element || null;
}

/**
 * Get all elements
 * 
 * @returns {Object} All elements keyed by ID
 */
function getAllElements() {
  return loadElements();
}

/**
 * Get elements by category
 * 
 * @param {string} category - Category (metal, nonmetal, metalloid, etc.)
 * @returns {Array} Array of elements matching the category
 */
function getElementsByCategory(category) {
  const elements = loadElements();
  return Object.values(elements).filter(el => el.category === category);
}

/**
 * Get all element IDs
 * 
 * @returns {Array} Array of element IDs
 */
function getAllElementIds() {
  const elements = loadElements();
  return Object.keys(elements);
}

/**
 * Search elements by any field (partial match)
 * Useful for autocomplete or search functionality
 * 
 * @param {string} query - Search term
 * @returns {Array} Array of matching elements
 */
function searchElements(query) {
  const elements = loadElements();
  const lowerQuery = query.toLowerCase();
  
  return Object.values(elements).filter(el => {
    return (
      el.name.toLowerCase().includes(lowerQuery) ||
      el.symbol.toLowerCase().includes(lowerQuery) ||
      el.id.toLowerCase().includes(lowerQuery) ||
      (el.personality && el.personality.some(p => p.toLowerCase().includes(lowerQuery))) ||
      (el.funFact && el.funFact.toLowerCase().includes(lowerQuery))
    );
  });
}

// ============================================
// STORY QUERY FUNCTIONS
// ============================================

/**
 * Get a story by ID
 * 
 * @param {string} id - Story ID
 * @returns {Object|null} Story data or null if not found
 */
function getStoryById(id) {
  const stories = loadStories();
  return stories[id] || null;
}

/**
 * Get all stories
 * 
 * @returns {Object} All stories keyed by ID
 */
function getAllStories() {
  return loadStories();
}

/**
 * Get stories involving a specific element
 * 
 * @param {string} elementId - Element ID
 * @returns {Array} Array of stories involving the element
 */
function getStoriesByElement(elementId) {
  const stories = loadStories();
  return Object.values(stories).filter(story =>
    story.involvedElements && story.involvedElements.includes(elementId)
  );
}

/**
 * Get stories of a specific type
 * 
 * @param {string} type - Story type (origin, friendship, conflict, discovery, daily-life, news)
 * @returns {Array} Array of stories matching the type
 */
function getStoriesByType(type) {
  const stories = loadStories();
  return Object.values(stories).filter(story => story.type === type);
}

/**
 * Get common stories (known by all elements)
 * 
 * @returns {Array} Array of common stories
 */
function getCommonStories() {
  const stories = loadStories();
  return Object.values(stories).filter(story => story.isCommon === true);
}

/**
 * Search stories by title or content
 * 
 * @param {string} query - Search term
 * @returns {Array} Array of matching stories
 */
function searchStories(query) {
  const stories = loadStories();
  const lowerQuery = query.toLowerCase();
  
  return Object.values(stories).filter(story =>
    story.title.toLowerCase().includes(lowerQuery) ||
    story.content.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// RELATIONSHIP QUERY FUNCTIONS
// ============================================

/**
 * Get relationships for a specific element
 * 
 * @param {string} elementId - Element ID
 * @param {string} type - Optional filter by relationship type
 * @returns {Array} Array of relationships
 */
function getRelationships(elementId, type = null) {
  const relationships = loadRelationships();
  
  let results = relationships.filter(rel => rel.sourceId === elementId);
  
  if (type) {
    results = results.filter(rel => rel.type === type);
  }
  
  return results;
}

/**
 * Get all relationships between two elements
 * 
 * @param {string} elementId1 - First element ID
 * @param {string} elementId2 - Second element ID
 * @returns {Array} Array of relationships between the two elements
 */
function getRelationshipBetween(elementId1, elementId2) {
  const relationships = loadRelationships();
  return relationships.filter(rel =>
    (rel.sourceId === elementId1 && rel.targetId === elementId2) ||
    (rel.sourceId === elementId2 && rel.targetId === elementId1)
  );
}

/**
 * Get friends of a specific element
 * Includes both best-friend and friend types
 * 
 * @param {string} elementId - Element ID
 * @returns {Array} Array of friend relationships
 */
function getFriends(elementId) {
  const relationships = loadRelationships();
  return relationships.filter(rel =>
    rel.sourceId === elementId &&
    (rel.type === 'friend' || rel.type === 'best-friend')
  );
}

/**
 * Get rivals of a specific element
 * 
 * @param {string} elementId - Element ID
 * @returns {Array} Array of rival relationships
 */
function getRivals(elementId) {
  const relationships = loadRelationships();
  return relationships.filter(rel =>
    rel.sourceId === elementId && rel.type === 'rival'
  );
}

/**
 * Get all relationships of a specific type
 * 
 * @param {string} type - Relationship type
 * @returns {Array} Array of relationships
 */
function getRelationshipsByType(type) {
  const relationships = loadRelationships();
  return relationships.filter(rel => rel.type === type);
}

// ============================================
// COMPOSITE FUNCTIONS
// ============================================

/**
 * Get full element profile with enriched data
 * Includes element data, relationships, and stories
 * 
 * @param {string} elementId - Element ID
 * @returns {Object|null} Enriched element data or null if not found
 */
function getElementProfile(elementId) {
  const element = getElementById(elementId);
  if (!element) return null;

  const relationships = getRelationships(elementId);
  const stories = getStoriesByElement(elementId);

  return {
    ...element,
    relationships,
    stories,
    friendCount: relationships.filter(r => r.type === 'friend' || r.type === 'best-friend').length,
    storyCount: stories.length
  };
}

/**
 * Get all elements with relationship enrichment
 * Adds relationship counts to each element
 * 
 * @returns {Array} Array of elements with relationship enrichment
 */
function getAllElementsWithRelationships() {
  const elements = loadElements();
  const allRelationships = loadRelationships();
  
  return Object.values(elements).map(element => {
    const rels = allRelationships.filter(r => r.sourceId === element.id);
    return {
      ...element,
      relationshipCount: rels.length,
      friendCount: rels.filter(r => r.type === 'friend' || r.type === 'best-friend').length,
      hasRelationships: rels.length > 0
    };
  });
}

/**
 * Get story with involved element data
 * Enriches story with full element objects instead of just IDs
 * 
 * @param {string} storyId - Story ID
 * @returns {Object|null} Enriched story or null if not found
 */
function getEnrichedStory(storyId) {
  const story = getStoryById(storyId);
  if (!story) return null;

  const elements = loadElements();
  const involvedElements = story.involvedElements
    .map(id => elements[id])
    .filter(el => el !== undefined);

  return {
    ...story,
    involvedElementsFull: involvedElements
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clear the cache (useful for testing)
 */
function clearCache() {
  cache = {
    elements: null,
    stories: null,
    relationships: null,
    lastLoaded: null
  };
}

/**
 * Get cache status
 * 
 * @returns {Object} Cache status information
 */
function getCacheStatus() {
  return {
    elementsCached: cache.elements !== null,
    storiesCached: cache.stories !== null,
    relationshipsCached: cache.relationships !== null,
    lastLoaded: cache.lastLoaded
  };
}

/**
 * Get data statistics
 * 
 * @returns {Object} Statistics about loaded data
 */
function getStats() {
  const elements = loadElements();
  const stories = loadStories();
  const relationships = loadRelationships();

  return {
    elementCount: Object.keys(elements).length,
    storyCount: Object.keys(stories).length,
    relationshipCount: relationships.length,
    categories: [...new Set(Object.values(elements).map(el => el.category))],
    storyTypes: [...new Set(Object.values(stories).map(st => st.type))],
    lastLoaded: cache.lastLoaded
  };
}

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

module.exports = {
  // Core loading
  loadAllData,
  loadElements,
  loadStories,
  loadRelationships,
  clearCache,
  getCacheStatus,
  getStats,

  // Element queries
  getElementById,
  getElementBySymbol,
  getElementByName,
  getAllElements,
  getElementsByCategory,
  getAllElementIds,
  searchElements,

  // Story queries
  getStoryById,
  getAllStories,
  getStoriesByElement,
  getStoriesByType,
  getCommonStories,
  searchStories,

  // Relationship queries
  getRelationships,
  getRelationshipBetween,
  getFriends,
  getRivals,
  getRelationshipsByType,

  // Composite functions
  getElementProfile,
  getAllElementsWithRelationships,
  getEnrichedStory
};