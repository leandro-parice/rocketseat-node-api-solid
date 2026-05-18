# GymPass-style API

A RESTful API for gym check-in management, built with a focus on **SOLID principles**, **Clean Architecture**, and **test-driven development**. This project was developed as part of the **Node.js track at [Rocketseat](https://www.rocketseat.com.br/)**.

> Full list of functional requirements, business rules, and non-functional requirements: [REQUIREMENTS.md](./REQUIREMENTS.md)

## Tech Stack

- **[Node.js](https://nodejs.org/)** + **[TypeScript](https://www.typescriptlang.org/)** — runtime and type safety
- **[Fastify](https://fastify.dev/)** — high-performance web framework
- **[Prisma](https://www.prisma.io/)** — type-safe ORM with PostgreSQL
- **[Zod](https://zod.dev/)** — schema validation and environment parsing
- **[Vitest](https://vitest.dev/)** — unit testing with in-memory repositories
- **[Docker](https://www.docker.com/)** — containerized PostgreSQL database
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — password hashing
- **[dayjs](https://day.js.org/)** — date manipulation

## Architecture Highlights

- **SOLID principles** applied throughout use cases and repositories
- **Repository pattern** with an in-memory implementation for fast, isolated unit tests
- **Factory pattern** to compose use cases with their dependencies
- **Separation of concerns** — HTTP layer, business logic, and data access are fully decoupled
- Environment variables validated at startup with Zod

## Features

| Feature | Status |
|---|---|
| User registration | ✅ |
| Authentication | ✅ |
| Get authenticated user profile | ✅ |
| Gym registration | ✅ |
| Check-in (with 100m proximity validation) | ✅ |
| Check-in history (paginated, 20 items/page) | ✅ |
| User metrics (total check-ins) | ✅ |
| Get number of check-ins for logged user | 🚧 |
| Search nearby gyms | 🚧 |
| Search gyms by name | 🚧 |
| Validate check-in (within 20 min window) | 🚧 |
| Admin-only routes | 🚧 |
| JWT authentication | 🚧 |

## Business Rules

- A user cannot register with a duplicate email
- A user cannot check in twice on the same day
- A user cannot check in if more than 100 meters away from the gym
- Check-in can only be validated within 20 minutes of creation
- Check-in validation and gym registration are restricted to admins

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 03-api-solid

# Install dependencies
npm install

# Start the PostgreSQL database
docker compose up -d

# Copy environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev
```

### Environment Variables

Create a `.env` file at the project root:

```env
NODE_ENV=dev
PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid"
```

### Running

```bash
# Development (with hot reload)
npm run start:dev

# Production build
npm run build
npm start
```

The server will be available at `http://localhost:3333`.

## Testing

The project uses **in-memory repositories** for unit tests, keeping them fast and database-free.

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open visual test UI
npm run test:ui
```

## Project Structure

```
src/
├── env/              # Environment variable validation (Zod)
├── http/
│   ├── controllers/  # Route handlers (HTTP layer)
│   └── routes.ts     # Route registration
├── lib/              # Shared libraries (Prisma client)
├── repositories/
│   ├── in-memory/    # In-memory implementations for testing
│   └── *.ts          # Repository interfaces
└── use-cases/
    ├── errors/        # Domain-specific errors
    ├── factories/     # Use case factories
    └── *.ts           # Business logic (one use case per file)
```

## License

MIT
