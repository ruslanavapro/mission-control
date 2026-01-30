# Mission Control API Documentation

Complete API reference for Mission Control Dashboard.

## Base URL
- **Development:** `http://localhost:3000`
- **Production:** `https://mission-control.vercel.app`

---

## Endpoints

### Projects

#### `GET /api/projects`
Get all projects with GitHub and AvaBase data.

**Response:**
```json
{
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "status": "active" | "pending" | "blocked" | "done",
      "progress": 0-100,
      "tasksTotal": number,
      "tasksCompleted": number,
      "documentsCount": number,
      "lastActivity": "ISO date string",
      "githubUrl": "string (optional)",
      "github": {
        "repo": {...},
        "commits": [...],
        "issues": [...]
      }
    }
  ]
}
```

---

### Tasks

#### `GET /api/tasks`
Get all tasks. Optionally filter by projectId.

**Query params:**
- `projectId` (optional): Filter tasks by project

**Response:**
```json
{
  "tasks": [
    {
      "id": "string",
      "projectId": "string",
      "title": "string",
      "description": "string (optional)",
      "status": "todo" | "inprogress" | "done",
      "priority": "low" | "medium" | "high" | null,
      "dueDate": "ISO date string (optional)",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ]
}
```

#### `POST /api/tasks`
Create a new task.

**Body:**
```json
{
  "projectId": "string",
  "title": "string",
  "description": "string (optional)",
  "status": "todo" | "inprogress" | "done",
  "priority": "low" | "medium" | "high" | null,
  "dueDate": "ISO date string (optional)"
}
```

**Response:**
```json
{
  "task": {...}
}
```

#### `GET /api/tasks/[id]`
Get a single task by ID.

**Response:**
```json
{
  "task": {...}
}
```

#### `PATCH /api/tasks/[id]`
Update a task.

**Body:** (all fields optional)
```json
{
  "title": "string",
  "description": "string",
  "status": "todo" | "inprogress" | "done",
  "priority": "low" | "medium" | "high",
  "dueDate": "ISO date string"
}
```

**Response:**
```json
{
  "task": {...}
}
```

#### `DELETE /api/tasks/[id]`
Delete a task.

**Response:**
```json
{
  "success": true
}
```

---

### Conversations

#### `GET /api/conversations`
Get recent Clawdbot conversations.

**Response:**
```json
{
  "conversations": [
    {
      "id": "string",
      "sessionKey": "string",
      "topic": "string",
      "messageCount": number,
      "userMessages": number,
      "assistantMessages": number,
      "lastMessage": "ISO date string"
    }
  ]
}
```

---

### Calendar

#### `GET /api/calendar`
Get upcoming events from Google Calendar (next 2 weeks).

**Response:**
```json
{
  "events": [
    {
      "id": "string",
      "summary": "string",
      "description": "string (optional)",
      "start": "ISO date string",
      "end": "ISO date string",
      "location": "string (optional)",
      "htmlLink": "string"
    }
  ]
}
```

---

### Stats

#### `GET /api/stats`
Get activity statistics.

**Response:**
```json
{
  "conversationsThisWeek": number,
  "averageSessionsPerDay": number,
  "commitsThisWeek": number
}
```

---

### Templates

#### `GET /api/templates`
Get project templates.

**Response:**
```json
{
  "templates": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "tasks": [...]
    }
  ]
}
```

---

### Export

#### `GET /api/export?format=json|csv`
Export all tasks as JSON or CSV.

**Query params:**
- `format`: `json` (default) or `csv`

**Response (JSON):**
```json
{
  "exportedAt": "ISO date string",
  "tasksCount": number,
  "tasks": [...]
}
```

**Response (CSV):**
```
ID,Project ID,Title,Description,Status,Priority,Due Date,Created,Updated
...
```

---

### Health

#### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "ISO date string",
  "version": "1.0.0",
  "uptime": number,
  "env": {
    "node": "string",
    "platform": "string"
  }
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request
- `404` - Not found
- `500` - Server error

---

## Rate Limiting

No rate limiting currently implemented. For production use, consider adding rate limiting middleware.

---

## Authentication

Currently no authentication required. For production use with sensitive data, implement authentication.

---

## CORS

CORS is not configured by default. To enable cross-origin requests, add CORS headers in middleware.

---

## Examples

### Fetch all active projects
```javascript
const res = await fetch('/api/projects')
const data = await res.json()
const activeProjects = data.projects.filter(p => p.status === 'active')
```

### Create a task
```javascript
const res = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'mission-control',
    title: 'Add API documentation',
    status: 'todo',
    priority: 'high',
  }),
})
const data = await res.json()
console.log(data.task)
```

### Update task status
```javascript
const res = await fetch(`/api/tasks/${taskId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'done' }),
})
```

### Export tasks as CSV
```javascript
const res = await fetch('/api/export?format=csv')
const csv = await res.text()
// Save to file or download
```

---

**Last updated:** 2026-01-30  
**Version:** 1.0.0
