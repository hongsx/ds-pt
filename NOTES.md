# Development notes

1. Start services with Docker Compose:

   docker-compose up --build

2. Backend (local development):
   - cd backend
   - pnpm install
   - pnpm prisma:generate
   - pnpm prisma:migrate
   - pnpm run dev

3. Frontend (local development):
   - cd frontend
   - pnpm install
   - pnpm run dev

Notes:
- Backend uses Prisma. Edit backend/prisma/schema.prisma and run `pnpm prisma:migrate` to apply schema changes.
- The starter is intentionally minimal. Add auth, validations, and production-ready configuration before deploying.
