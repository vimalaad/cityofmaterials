// Import the loader
const db = require('./src/data-loader.js');

// Get a single element
const oxygen = db.getElementById('oxygen');
console.log(oxygen.name); // "Oxygen"
console.log(oxygen.catchphrase); // "I'm the breath of life!"

// Get all elements
const allElements = db.getAllElements();

// Find elements by category
const metals = db.getElementsByCategory('metal');

// Get stories for an element
const oxygenStories = db.getStoriesByElement('oxygen');

// Get relationships for an element
const oxygenRelationships = db.getRelationships('oxygen');

// Get enriched profile
const fullProfile = db.getElementProfile('oxygen');
console.log(fullProfile.friendCount); // Number of friends

// Search for elements
const results = db.searchElements('gas');

// Get statistics
const stats = db.getStats();
console.log(`Loaded ${stats.elementCount} elements`);