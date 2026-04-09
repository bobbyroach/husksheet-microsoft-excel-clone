# HuskSheet

A full-stack collaborative spreadsheet application inspired by Microsoft Excel, built with React, Node.js, Express, and MongoDB.

## Features

- **Spreadsheet Management** — Create, edit, and delete spreadsheets with configurable dimensions (default 200×200)
- **Formula Support** — `SUM`, `AVG`, `MIN`, `MAX`, `IF`, `CONCAT`, and nested formulas with cell range syntax (`$A1:$A5`)
- **Cell Types** — Text, numbers, formulas, and display-only header cells
- **Multi-User Collaboration** — User authentication, publisher/subscriber model for sharing sheets
- **Update Tracking** — Published and subscription update history with editor metadata
- **Virtualized Rendering** — Efficient rendering of large grids using React Virtualized

## Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React 18, TypeScript, React Router, Axios, React Virtualized |
| Backend    | Node.js 16, Express, TypeScript, Mongoose |
| Database   | MongoDB                                  |
| DevOps     | Docker, Docker Compose                   |
| Testing    | Jest, React Testing Library, Supertest   |

## Project Structure

```
├── docker-compose.yml
├── src/
│   ├── api/                  # Express REST API (port 8081)
│   │   ├── controllers/      # Route controllers
│   │   ├── database/         # Mongoose schemas & DB logic
│   │   ├── models/           # Data models (Spreadsheet, Cell, Publisher)
│   │   ├── users/            # Authentication & user management
│   │   ├── routes.ts         # API route definitions
│   │   ├── dao.ts            # Data access layer
│   │   └── index.ts          # Server entry point
│   └── frontend/             # React app (port 3000)
│       └── src/
│           ├── backend/      # Client-side models & logic
│           │   ├── controller/   # API client & request classes
│           │   ├── FormulaParser.ts
│           │   ├── Spreadsheet.ts
│           │   └── Model.ts
│           ├── components/   # UI components
│           │   ├── dashboardComponents/
│           │   └── spreadSheetComponents/
│           ├── pages/        # Login, Dashboard, SpreadSheetEditor
│           └── utils/
└── Design/                   # Sprint planning & design documents
```

## Getting Started

### Prerequisites

- **Docker & Docker Compose** (recommended), or
- **Node.js 16+**, **npm**, and a **MongoDB** instance

### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```

Services start at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8081
- **MongoDB**: localhost:27017

### Option 2: Local Development

**Backend:**
```bash
cd src/api
npm install
npm run dev
```

**Frontend:**
```bash
cd src/frontend
npm install
npm start
```

Ensure MongoDB is running and the connection string in `src/api/index.ts` is configured.

### Environment Variables

Create a `.env` file in `src/` with the required environment configuration. Refer to the Docker Compose file for the expected variables.

## API Endpoints

All endpoints require **Basic Authentication** (`Authorization: Basic base64(username:password)`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/register` | Register / authenticate user |
| GET | `/api/v1/getPublishers` | List all publishers |
| POST | `/api/v1/getSheets` | Get sheets for a publisher |
| POST | `/api/v1/createSheet` | Create a new spreadsheet |
| DELETE | `/api/v1/deleteSheet` | Delete a spreadsheet |
| POST | `/api/v1/getUpdatesForPublished` | Get published updates for a sheet |
| POST | `/api/v1/getUpdatesForSubscription` | Get subscription updates for a sheet |
| POST | `/api/v1/updatePublished` | Push a published update |
| POST | `/api/v1/updateSubscription` | Push a subscription update |

**Update payload format:** `$ColumnRow value` (e.g., `$D7 5`, `$A1 =SUM($B1:$B5)`)

## Formula Reference

| Function | Syntax | Description |
|----------|--------|-------------|
| SUM | `=SUM($A1:$A5)` | Sum of a cell range |
| AVG | `=AVG($A1:$A5)` | Average of a cell range |
| MIN | `=MIN($A1:$A5)` | Minimum value in range |
| MAX | `=MAX($A1:$A5)` | Maximum value in range |
| IF | `=IF(cond, true_val, false_val)` | Conditional evaluation |
| CONCAT | `=CONCAT($A1, $B1)` | String concatenation |

Formulas support nesting (e.g., `=SUM($A1, IF($B1, $C1, $D1))`).

## Testing

```bash
# Backend tests with coverage
cd src/api
npm test

# Frontend tests with coverage
cd src/frontend
npm test
```

Coverage reports are generated in each project's `coverage/` directory.
