# TMTC - Backend

A simple Node.js/Express backend for the TMTC project.

## Overview
- Language: JavaScript (ECMAScript modules)
- Framework: Express.js
- Database: MongoDB (configured in `docker-compose.yaml`)
- Cache / store: Redis (configured in `docker-compose.yaml`)
- Rate limiting: `express-rate-limit` configured in `app.js`

Project structure (important files/folders):
- `app.js` - Express application and middleware registration (rate-limiter, helmet, cors).
- `server.js` - Server bootstrap that imports `app.js` and starts listening.
- `src/routes` - Route definitions and route groupings.
- `src/controllers` - Route handlers and controller logic.
- `src/db` - Database connection helpers (`mongo.db.js`, `redis.db.js`).
- `docker-compose.yaml` - Development compose file to run MongoDB, Redis and the app.

## Requirements
- Node.js 18+ (or a Node version that supports ES modules used here)
- npm
- Docker & Docker Compose (optional but recommended for local development)

## Environment
The project reads configuration from environment variables. The `docker-compose.yaml` sets the environment values used when running with Docker. Important vars include:

- `PORT` — port the app listens on (default `3000` in compose)
- `MONGO_URL` — MongoDB connection string (compose: `mongodb://mongo:27017/tmtc`)
- `REDIS_URL` — Redis connection string (compose: `redis://redis:6379`)
- `JWT_SECRET` — secret used to sign JWT tokens
- `SHARE_SECRET` — a sharing token secret used by the app

You can create a `.env` file in the project root with the same variables for local development (example):

```
PORT=3000
MONGO_URL=mongodb://localhost:27017/tmtc
REDIS_URL=redis://localhost:6379
JWT_SECRET=<your_jwt_secret>
SHARE_SECRET=<shareToken>
```

## Install dependencies

Install node dependencies:

```bash
npm install
```

## Run (development)

Option 1 — Run locally (without Docker):

1. Start MongoDB and Redis locally (or point `MONGO_URL` and `REDIS_URL` to remote instances / containers).
2. Start the app in dev watch mode:

```bash
npm run dev
```

Option 2 — Run with Docker Compose (recommended for quick setup):

```bash
docker compose up --build
```

This will start `mongo`, `redis` and the `app` service mapped to `localhost:3000` (per `docker-compose.yaml`).

Option 3 — Run the production start script:

```bash
npm start
```

## API
All API routes are mounted under `/api/v1` (see `src/routes/index.js`).

- Health: `GET /health`
- Root: `GET /` (simple server check)

Refer to the `src/routes` and `src/controllers` folders for available endpoints and payload expectations.

## Rate limiting
Rate limiting is configured in `app.js` using `express-rate-limit` with a 1 minute window. You can adjust `windowMs` and `max`/`limit` there. The app sets `trust proxy` to `1` — ensure this is correct for your deployment (reverse proxies like Nginx, Heroku, or Cloud providers typically require this).

## Tests
Run tests with:

```bash
npm test
```

(Tests use `jest` and `supertest`, and there are in-repo test helpers under `src/tests`.)

## Logging
The project uses `winston` for logging; see `src/utils/logger.js` for configuration.

## Troubleshooting
- If you hit the rate limiter earlier than expected, inspect the rate limiter headers returned by the server (`X-RateLimit-Limit`, `X-RateLimit-Remaining` or `RateLimit-*`) and check `app.js` `max`/`limit` configuration and `keyGenerator` behavior.
- If Mongo/Redis connections fail when running without Docker, verify `MONGO_URL` and `REDIS_URL`.

## Contributing
Open a PR with clear description and tests for non-trivial changes. Maintain code style and avoid changing unrelated files.

---
If you'd like, I can also add quick start scripts, a `.env.example`, or update `app.js` to make the rate-limit `limit` option explicit (the project currently uses `max: 10`).
