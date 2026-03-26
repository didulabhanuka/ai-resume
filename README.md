# ResumeAI

> AI-powered resume screening and cover letter generation — built with Claude, React, and Node.js.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude-Sonnet_4-CC785C?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## Overview

ResumeAI is a full-stack portfolio project that demonstrates real-world integration of the Anthropic Claude API. It combines two AI-powered tools in a single application:

- **Resume Screener** — paste or upload a resume and job description; Claude returns a match score (0–100), strengths, skill gaps, red flags, and a hiring recommendation as structured JSON
- **Cover Letter Generator** — Claude generates a tailored cover letter that streams word-by-word to the UI in real time via Server-Sent Events

Both tools share a JWT auth system, per-user request history stored in MongoDB, and a clean React frontend built with Vite and Tailwind CSS.

---

## Features

| Feature | Detail |
|---|---|
| **LLM Integration** | Anthropic Claude API with structured JSON prompts and SSE streaming |
| **PDF Parsing** | Upload resume as PDF — text extracted server-side with `pdf-parse-fork` |
| **Streaming Output** | Cover letter streams token-by-token using Server-Sent Events (SSE) |
| **Structured AI Output** | Screener uses JSON-mode prompting for reliable, parseable results |
| **JWT Auth** | Register, login, protected routes, token verification middleware |
| **History** | All screenings and cover letters saved to MongoDB, viewable and deletable |
| **PDF Export** | Download generated cover letter as a formatted A4 PDF via `pdf-lib` |
| **Rate Limiting** | Per-IP limits on API, auth, and AI endpoints |
| **Demo Mode** | Realistic mock responses when no API key is set — clone and run instantly |
| **Abort Support** | Cancel a streaming generation mid-way with AbortController |

---

## Tech Stack

**Backend**
- Node.js + Express 4
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs`
- `@anthropic-ai/sdk` — Claude Sonnet 4
- `multer` — PDF upload (memory storage)
- `pdf-parse-fork` — PDF text extraction
- `pdf-lib` — Cover letter PDF export
- `express-rate-limit`

**Frontend**
- React 18 + Vite
- Tailwind CSS v4
- `react-router-dom` — client-side routing
- `react-dropzone` — drag-and-drop PDF upload
- `react-markdown` — render cover letter output
- Fetch API + ReadableStream — SSE consumption

---

## Project Structure

```
ai-resume/
├── server/
│   └── src/
│       ├── controllers/
│       │   ├── auth/
│       │   ├── screener/
│       │   ├── coverLetter/
│       │   └── history/
│       ├── middleware/
│       │   ├── auth/
│       │   ├── rateLimit/
│       │   └── upload/
│       ├── models/
│       │   ├── auth/
│       │   ├── screener/
│       │   └── coverLetter/
│       ├── services/
│       │   ├── claude/
│       │   └── pdf/
│       ├── prompts/
│       ├── routes/
│       ├── app.js
│       └── server.js
│
└── client/
    └── src/
        ├── api/
        ├── components/
        │   ├── Screener/
        │   ├── CoverLetter/
        │   ├── History/
        │   └── Shared/
        ├── context/
        ├── hooks/
        └── pages/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com) _(optional — app runs in demo mode without it)_

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/ai-resume.git
cd ai-resume
```

**2. Install backend dependencies**

```bash
cd server
npm install
```

**3. Configure environment variables**

Create `server/.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ai_resume
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-...
CLIENT_URL=http://localhost:5173
NODE_ENV=development
AI_REQUESTS_PER_HOUR=5
```

> Leave `ANTHROPIC_API_KEY` empty or as `your_key_here` to run in **demo mode** with realistic mock responses.

**4. Install frontend dependencies**

```bash
cd ../client
npm install
```

**5. Configure frontend environment**

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

**6. Run the application**

In one terminal:
```bash
cd server && npm run dev
```

In another terminal:
```bash
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create account, returns JWT |
| `POST` | `/api/auth/login` | No | Login, returns JWT |
| `GET` | `/api/auth/me` | ✓ | Current user profile |
| `POST` | `/api/screener/screen` | ✓ | Screen resume vs job description |
| `POST` | `/api/cover-letter/generate` | ✓ | Generate cover letter (SSE stream) |
| `GET` | `/api/cover-letter/:id/download` | ✓ | Download cover letter as PDF |
| `GET` | `/api/history/screenings` | ✓ | Paginated screening history |
| `GET` | `/api/history/cover-letters` | ✓ | Paginated cover letter history |
| `DELETE` | `/api/history/screenings/:id` | ✓ | Delete a screening |
| `DELETE` | `/api/history/cover-letters/:id` | ✓ | Delete a cover letter |

---

## How It Works

### Resume Screener

The screener uses a carefully crafted system prompt that instructs Claude to return **only valid JSON** matching a strict schema. The backend strips any markdown code fences defensively before parsing.

```
User submits JD + Resume
  → multer handles optional PDF upload
  → pdf-parse-fork extracts text from buffer
  → Claude API (non-streaming) returns JSON
  → Result saved to MongoDB
  → Response returned to frontend
```

**Claude output schema:**
```json
{
  "matchScore": 73,
  "summary": "Strong backend candidate...",
  "strengths": ["Node.js", "MongoDB", "REST APIs"],
  "gaps": ["AWS", "Docker", "CI/CD"],
  "redFlags": [],
  "recommendation": "INTERVIEW"
}
```

### Cover Letter Generator

The cover letter uses SSE (Server-Sent Events) for real-time streaming. SSE was chosen over WebSockets because generation is one-way (server → client only) and SSE works over standard HTTP without additional infrastructure.

```
User submits JD + Resume + Settings
  → Express sets SSE headers, flushes
  → Claude streams tokens via client.messages.stream()
  → Each chunk written as: data: {"chunk":"..."}\n\n
  → Letter saved to MongoDB after stream ends
  → Done signal sent with letterId: data: {"done":true,"letterId":"..."}
  → Frontend triggers download via letterId
```

---

## Key Engineering Decisions

**Why SSE over WebSockets?**
Cover letter generation is strictly one-directional. SSE is simpler, works over standard HTTP/2, and doesn't require a separate WebSocket server or library.

**Why `multipart/form-data` for the screener?**
The screener needs to accept either plain text or a PDF file in the same endpoint. FormData handles both cases cleanly without needing two separate routes.

**Why store prompts in a dedicated `/prompts` folder?**
Prompts are treated as first-class code artifacts. Keeping them versioned and separate from business logic makes iteration and debugging easier — you can tweak prompting behaviour without touching controller code.

**Why JSON-mode prompting?**
By specifying an exact schema in the system prompt and instructing Claude not to use markdown fences, the response is reliably parseable. A try/catch around `JSON.parse` with a markdown fence strip handles the rare case where Claude wraps the response anyway.

**Why demo mode?**
Anyone cloning the repo can run the full application without an API key. This shows empathy for reviewers and interviewers who want to see the app working without spending credits.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 4000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | Token expiry (default: 7d) |
| `ANTHROPIC_API_KEY` | No | Claude API key — omit for demo mode |
| `CLIENT_URL` | Yes | Frontend URL for CORS |
| `NODE_ENV` | No | `development` or `production` |
| `AI_REQUESTS_PER_HOUR` | No | Per-IP AI rate limit (default: 5) |

---

## Rate Limits

| Endpoint group | Limit |
|---|---|
| All `/api` routes | 100 requests / 15 min / IP |
| `/api/auth` routes | 10 requests / 15 min / IP |
| AI endpoints (screener, cover letter) | 5 requests / hour / IP |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

Built by **Didula Bhanuka**  
[GitHub](https://github.com/didulabhanuka) · [LinkedIn](https://linkedin.com/in/didulabhanuka)
