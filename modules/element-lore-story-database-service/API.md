# Element City Data Service API Specification

## Base URL
`http://localhost:3000/api`

---

## System Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/health` | Service health check |
| GET | `/stats` | Data statistics (counts, categories, types) |
| GET | `/cache/status` | Current cache status |
| POST | `/cache/clear` | Clear in-memory cache |

---

## Element Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/elements` | Get all elements (optional `?enrich=true` for relationship counts) |
| GET | `/elements/search?q={query}` | Search elements by name, symbol, ID, personality, or fun fact |
| GET | `/elements/category/{category}` | Get elements by category |
| GET | `/elements/symbol/{symbol}` | Get element by chemical symbol |
| GET | `/elements/name/{name}` | Get element by full name (case-insensitive) |
| GET | `/elements/{id}` | Get element by ID |
| GET | `/elements/{id}/profile` | Get enriched profile (element + relationships + stories) |
| GET | `/elements/{id}/stories` | Get all stories involving the element |
| GET | `/elements/{id}/relationships` | Get relationships (optional `?type={type}` filter) |
| GET | `/elements/{id}/friends` | Get friends (friend + best-friend types) |
| GET | `/elements/{id}/rivals` | Get rivals |

---

## Story Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/stories` | Get all stories |
| GET | `/stories/search?q={query}` | Search stories by title or content |
| GET | `/stories/type/{type}` | Get stories by type |
| GET | `/stories/common` | Get common stories (known by all elements) |
| GET | `/stories/{id}` | Get story by ID |
| GET | `/stories/{id}/enriched` | Get story with full element objects |

---

## Relationship Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/relationships` | Get all relationships |
| GET | `/relationships/type/{type}` | Get relationships by type |
| GET | `/relationships/between/{id1}/{id2}` | Get relationships between two elements |

---

## Status Codes

| Code | Description |
|:---|:---|
| 200 | Success |
| 400 | Bad request (missing required parameters) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Notes

- All responses are JSON
- All endpoints except `/cache/clear` are GET requests
- The `/:id` route for elements must come after all other `/elements/*` routes (search, category, symbol, name, profile, stories, relationships, friends, rivals) to avoid treating `search`, `category`, etc. as element IDs