# External Integration & API Gateway

## Overview
This module serves as the single entry point for all third-party service integrations required by Element City. It abstracts away the complexity of external APIs, providing a clean, internal-facing REST API for LLM completions, news retrieval, and text-to-speech.

## Key Responsibilities
- **LLM Integration**: Communicates with OpenRouter for chat completions (supports multiple models).
- **News API Integration**: (future) Fetches and rates science news for the Discovery Agent.
- **Text-to-Speech**: (future) Provides TTS capabilities for voice output.

## Internal API Contract
### LLM Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/llm/chat` | Send a chat completion request |
| GET    | `/llm/models` | List available models |
| GET    | `/llm/health` | Check OpenRouter health |

### Request/Response Format (POST `/llm/chat`)
**Request Body:**
```json
{
  "model": "google/gemini-flash-2.0",
  "messages": [
    { "role": "system", "content": "You are an assistant." },
    { "role": "user", "content": "Hello!" }
  ],
  "temperature": 0.8,
  "maxTokens": 500,
  "stream": false
}
