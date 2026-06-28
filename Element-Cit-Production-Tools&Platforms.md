# Element City - Production Tools & Platforms

Based on the project proposal, here's the complete production tech stack:

---

## Hosting & Infrastructure

| Component | Platform/Tool | Purpose |
|:---|:---|:---|
| **Frontend Hosting** | Vercel (Hobby Plan) | Hosts the Next.js web application with free CDN and automatic deployments |
| **Serverless Functions** | Vercel Serverless Functions | Handles API routes without managing servers |
| **Background Jobs** | Vercel Cron Jobs | Schedules the daily news agent (runs at 5:00 AM UTC) |
| **Queue System** | Vercel Queue | Manages the news agent task queue |
| **Workflow Engine** | Vercel Workflows | Runs parallel element news checks (up to 50,000 events/month on Hobby plan) |

---

## Database & Storage

| Component | Platform/Tool | Purpose |
|:---|:---|:---|
| **Primary Database** | Vercel KV (Redis) | Stores element data, stories, relationships, and admin configurations |
| **Static Data** | JSON files (in codebase) | Base element profiles and seed data |
| **File Storage** | Not specified (could use Vercel Blob or S3 if needed) | For images, audio files, or larger assets |

---

## AI & LLM Services

| Component | Platform/Tool | Purpose |
|:---|:---|:---|
| **Primary LLM Provider** | OpenRouter | Single API key for access to 300+ AI models |
| **Fast/Cheap Model** | Gemini Flash 2.0 (via OpenRouter) | Step 0 (Corrector) and Step 1 (Router) - Free tier available |
| **Quality Model** | GPT-4o-mini or Claude 3.5 Haiku (via OpenRouter) | Step 2 (Storyteller) - Higher quality responses |
| **Text-to-Speech (Optional)** | Web Speech API (browser) OR OpenRouter TTS | Voice output for child-friendly audio responses |

---

## External APIs (News Agent)

| Component | Platform/Tool | Purpose |
|:---|:---|:---|
| **News Aggregator** | NewsAPI (free tier - 100 requests/day) | Primary source for element-related news |
| **Scientific Journals** | arXiv API (free) | Academic papers and research |
| **Science News** | ScienceDaily RSS or Phys.org RSS | Additional science news sources |
| **Patents** | Google Patents API (free) | Discovery-related patents |
| **Alternative Sources** | Google News RSS (unofficial) | Backup news source |

---

## Frontend Technologies

| Component | Platform/Tool | Purpose |
|:---|:---|:---|
| **Frontend Framework** | Next.js (React) | Builds the interactive web interface |
| **Voice Input** | Web Speech API (built-in browser) | Speech-to-text for children's questions |
| **Voice Output** | Web Speech API (built-in browser) | Text-to-speech for element responses |
| **Styling** | Not specified (likely Tailwind CSS or plain CSS) | UI design and theming |

---

## Development & Tooling

| Component | Platform/Tool | Purpose |
|:---|:---|:---|
| **Version Control** | Git (GitHub/GitLab) | Source code management |
| **Package Manager** | npm or yarn | Dependency management |
| **Environment Variables** | Vercel Environment Variables | Secure storage of API keys and secrets |
| **Testing** | Not specified (Jest, Playwright, etc.) | Unit and integration testing |
| **Type Safety** | TypeScript (recommended) | Type checking and better DX |

---

## Cost Summary

| Service | Tier | Monthly Cost |
|:---|:---|:---|
| **Vercel** | Hobby Plan | $0 (Free) |
| **OpenRouter** | Pay-as-you-go | ~$0.001-0.01 per conversation |
| **NewsAPI** | Free Tier | $0 (100 requests/day) |
| **Other APIs** | Free Tiers | $0 |
| **Domain** | Custom (optional) | ~$10-15/year |

**Total Monthly Cost (MVP):** Less than $5/month for a moderate user base

---

## Potential Upgrades (Future)

| Component | Upgrade Option | When Needed |
|:---|:---|:---|
| **Hosting** | Vercel Pro ($20/month) | When needing more serverless function execution time |
| **Database** | Upgraded Redis plan | When data exceeds free tier limits |
| **LLM** | Direct OpenAI API | If OpenRouter costs become high |
| **News** | Paid NewsAPI ($30/month) | When needing more than 100 daily requests |
| **Search** | Algolia/Meilisearch | For faster element search |
| **Image Storage** | Vercel Blob or Cloudinary | For element avatars and city illustrations |
| **Auth** | Clerk or NextAuth.js | For more robust user management |

---

## Key Constraints to Remember

| Constraint | Limit |
|:---|:---|
| **Vercel Hobby Serverless** | 10s execution time limit |
| **Vercel Hobby Queue** | 50,000 workflow events/month |
| **OpenRouter Free Tier** | ~50 requests/day (use paid for production) |
| **NewsAPI Free Tier** | 100 requests/day, 500 requests/month |
| **Vercel KV Free** | 30 MB storage, 10,000 requests/day |

---

## Deployment Flow

```
1. Developer pushes code to GitHub
2. Vercel automatically deploys (main branch → production)
3. Environment variables injected at build time
4. Frontend served via Vercel CDN
5. API routes run as serverless functions
6. Cron job triggers daily at 5:00 AM UTC
7. Redis (Vercel KV) persists all data
8. LLM calls go through OpenRouter
```