# Voice-Enabled Task Tracker

**SDE Assignment — Voice-Enabled Task Tracker**

A full-stack task management application that supports voice-driven task creation. Users can speak tasks in the browser, the app converts speech-to-text, sends the transcript to an AI (Groq) to extract structured task fields, and persists tasks to MongoDB. The repo includes a React frontend and a Node/Express backend.

---

## 1. Project Setup

This section explains how to prepare your environment, install dependencies, configure email (send/receive), run the app locally, and provide seed data.

### a. Prerequisites

- Node.js v18+ and npm v9+
- MongoDB (local instance or MongoDB Atlas)
- (Optional) Groq API key for AI parsing (`GROQ_API_KEY`)
- SMTP credentials or an email provider account if you want email sending/receiving (see below)
- Browser with Web Speech API support (Chrome recommended)

### b. Install steps (frontend & backend)

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/SrikanthKamalla/VoiceEnabled-Task-Tracker.git
cd Task-Tracker
```

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

### c. How to configure email sending/receiving

This project does not include a production email implementation by default. Below are recommended options and environment variables you can add to the backend to enable email workflows.

Sending (outbound email)

- Option A — SMTP (e.g., Gmail, SMTP relay, self-hosted): use `nodemailer`.

  - Env vars suggested:

  ```env
  SMTP_HOST=smtp.example.com
  SMTP_PORT=587
  SMTP_SECURE=false # true for 465
  SMTP_USER=your_smtp_user
  SMTP_PASS=your_smtp_password
  FROM_EMAIL=tasks@example.com
  ```

- Option B — Transactional API providers (SendGrid, Mailgun, SES): use provider SDK or `nodemailer` with SMTP/API key.
  - Example env var: `SENDGRID_API_KEY=...`

Receiving (inbound email)

- Preferred: use your provider's inbound/webhook parsing (SendGrid Inbound Parse, Mailgun routes) to POST incoming messages to a backend endpoint like `/webhooks/emails`. This avoids dealing with IMAP/POP.
- Alternative: poll IMAP/POP using a library (e.g., `node-imap`) to fetch incoming mail — more complex and requires credentials + long-running worker.

Example webhook flow:

1. Configure provider to POST to `https://your-backend.example.com/webhooks/emails`
2. Backend validates provider signature (if available), extracts sender/subject/body, and maps to tasks or actions.

If you'd like, I can add a minimal `emails.service.js` using `nodemailer` (send) and an example webhook handler (receive).

### d. How to run everything locally

Start backend and frontend in separate terminals.

Backend

```bash
cd backend
# create .env (example below)
npm run dev
```

Frontend

```bash
cd frontend
npm run dev
# open http://localhost:5173
```

### e. Seed data / initial scripts

There is no seed script included by default. You can create sample tasks via the API or with `mongoimport`.

Example curl to create a seed task:

```bash
curl -X POST http://localhost:8000/tasks \
	-H "Content-Type: application/json" \
	-d '{"title":"Sample task","description":"Seed task","priority":"Low Priority","status":"To Do"}'
```

To bulk import JSON into MongoDB:

1. Create `seed.json` with an array of task objects matching the schema.
2. Run:

```bash
mongoimport --uri "$MONGO_URI" --collection tasks --jsonArray --file seed.json --db TasksApp
```

---

## 2. Tech Stack

- Frontend: React 19, Vite
- Styling: Tailwind CSS
- Voice / Speech: Web Speech API, `react-speech-recognition`
- Backend: Node.js, Express 5
- Database: MongoDB (Mongoose)
- Validation: Zod
- AI provider: Groq LLM (via `groq-sdk`)
- Email: (recommended) `nodemailer` for outbound; SendGrid/Mailgun for inbound webhooks
- Key libraries: `axios`, `react-icons`, `react-dnd`, `react-toastify`

---

## 3. API Documentation

Base URL (local): `http://localhost:8000`

All endpoints are prefixed with `/tasks`.

1. List tasks

- Method: GET
- Path: `/tasks`
- Query params (optional): `status` ("To Do" | "In Progress" | "Done"), `priority` ("Urgent" | "High Priority" | "Low Priority" | "Critical"), `search` (string)

Example success response (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "64...",
      "title": "Buy groceries",
      "description": "",
      "priority": "Low Priority",
      "status": "To Do",
      "dueDate": null
    }
  ]
}
```

2. Create task

- Method: POST
- Path: `/tasks`
- Body (application/json):

```json
{
  "title": "Write README",
  "description": "Draft project README",
  "priority": "High Priority",
  "status": "To Do",
  "dueDate": "2025-12-10T12:00:00"
}
```

Example success response (201):

```json
{
  "success": true,
  "data": {
    "_id": "64...",
    "title": "Write README",
    "priority": "High Priority",
    "status": "To Do"
  }
}
```

Example error response (400 validation error):

```json
{
  "success": false,
  "error": "Title must be at least 3 characters"
}
```

3. Update task (full)

- Method: PUT
- Path: `/tasks/:id`
- Params: `id` — task id (MongoDB ObjectId)
- Body: same as create but fields optional

Example success (200):

```json
{ "success": true, "data": { "_id": "64...", "title": "Updated title" } }
```

4. Update task status (partial)

- Method: PATCH
- Path: `/tasks/:id/status`
- Body:

```json
{ "status": "In Progress" }
```

Success (200):

```json
{ "success": true, "data": { "_id": "64...", "status": "In Progress" } }
```

5. Delete task

- Method: DELETE
- Path: `/tasks/:id`

Success (200):

```json
{ "success": true, "message": "Task deleted" }
```

6. Parse voice/text to task (AI)

- Method: POST
- Path: `/tasks/parse-task`
- Body:

```json
{ "text": "Tomorrow morning prepare release notes with high priority" }
```

Success (200): returns the AI-extracted JSON (validated) ready to be created.

Example response:

```json
{
  "success": true,
  "data": {
    "title": "Prepare release notes",
    "description": "",
    "priority": "High Priority",
    "status": "To Do",
    "dueDate": "2025-12-08T09:00:00"
  }
}
```

Error (if AI or validation fails):

```json
{ "success": false, "error": "AI parsing failed or returned invalid format" }
```

Notes: request/response wrappers and exact shapes are implemented in `backend/src/controllers` and validated by schemas in `backend/src/validations/tasks.validations.js`.

---

## 4. Decisions & Assumptions

### a. Key design decisions

- Voice-first UX: prioritize quick capture via speech and map free-text to structured tasks using an LLM to reduce friction.
- Simple task model: title, description, priority (enum), status (enum), dueDate (ISO string). Keeps front-end simple and validation predictable.
- Client-side drag-and-drop: status updates occur via a PATCH to `/tasks/:id/status` for quick reordering and state changes.
- Validation-first: all AI outputs and client inputs are validated server-side with Zod before write operations.
- No authentication: project scoped as single-user for the assignment to focus on voice/AI flows.

### b. Assumptions

- Users will speak short, clear English phrases; complex ambiguous utterances may require manual correction.
- Email flows are optional; the repo does not provide a complete inbound email parser — use provider webhooks for production-grade handling.
- Timezones: due dates are stored as ISO datetime strings; the app assumes consumers handle timezone display appropriately.
- Single-user dataset: concurrency and multi-tenant concerns are out of scope for this assignment.

---

## Appendix — Example `.env` for backend

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net
GROQ_API_KEY=sk-...
CLIENT_APP_URL=http://localhost:5173
PORT=8000
```

---

If you'd like, I can:

- Add a `backend/.env.example` file,
- Add a simple `scripts/seed.js` script to create seed tasks,
- Add minimal email send/receive handler examples.

Tell me which of the three you'd like next and I'll add it.
