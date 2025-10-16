# Quiosco Next

A kiosk-style ordering application built with Next.js (App Router) and Prisma. It provides a simple flow for browsing categories and products, creating orders, and an admin view to manage and complete orders. Image handling is integrated via Cloudinary.

## Tech Stack

- Next.js 15 (App Router)
- React 19, TypeScript
- Tailwind CSS v4
- Prisma ORM 6.x (PostgreSQL provider) with Accelerate extension
- SWR for data fetching
- Zustand for client state management
- Zod for validation
- Cloudinary via next-cloudinary

Package manager: npm (package-lock.json present)

## Requirements

- Node.js >= 18.18 (Next.js 15 requirement) or >= 20 recommended
- npm >= 9
- A PostgreSQL-compatible database connection string (or Prisma Accelerate Data Proxy URL)
- Cloudinary account and API credentials (for image delivery/uploads)

## Environment Variables

Create a .env file in the project root. Do not commit secrets.

Required variables:

- DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
  - Alternatively, use a Prisma Accelerate URL (prisma+postgres://…); see Prisma docs.
- NODE_ENV=development
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
- NEXT_PUBLIC_CLOUDINARY_API_KEY=your_public_api_key
- CLOUDINARY_API_SECRET=your_secret_api_key

Note: Example values found in local .env should be treated as secrets and replaced with your own.

## Setup

1. Install dependencies
   - npm install
2. Generate Prisma client
   - npm run prisma:generate
3. Configure your database connection in .env (DATABASE_URL)
4. Run database migrations (dev)
   - npm run prisma:migrate
5. Seed initial data (categories/products)
   - npx tsx prisma/seed.ts
   - The seed script is configured via prisma.config.ts as "tsx prisma/seed.ts".

## Running the App

- Development server (http://localhost:3000)
  - npm run dev
- Production build
  - npm run build
  - npm start

## Scripts

Defined in package.json:

- dev: next dev --turbopack
- build: next build
- start: next start
- lint: next lint
- prepare: husky
- prisma:generate: prisma generate
- prisma:generate:prod: prisma generate --no-engine
- prisma:migrate: prisma migrate dev
- prisma:studio: prisma studio

## Project Structure

Top-level directories/files of interest:

- app/ — Next.js App Router pages and API routes
  - orders/ — public order status page
    - page.tsx — lists latest ready orders (polling via SWR)
    - api/route.ts — returns latest orders with products
  - admin/orders/ — admin UI to manage orders
    - page.tsx — admin list of pending orders (polling via SWR)
    - api/route.ts — returns pending orders with products
- actions/ — server actions (e.g., complete-order-action.ts)
- components/ — UI components (Heading, Logo, order components, etc.)
- db/ — Prisma migration artifacts
- generated/ — generated Prisma client output (per prisma/schema.prisma)
- prisma/ — Prisma schema and seed/data
  - schema.prisma — models: Category, Product, Order, OrderProducts
  - seed.ts — seeds categories and products
  - data/ — static seed data files
- src/ — application source (lib, types, stores)
  - src/lib/prisma — Prisma client helper
  - src/types — shared types (e.g., OrderWithProducts)
  - src/store.ts — Zustand store
- public/ — static assets
- next.config.ts — Next.js config (Cloudinary image domain)
- prisma.config.ts — Prisma CLI config (schema path, migrations path, seed command)
- tsconfig.json, eslint.config.mjs, postcss.config.mjs — tooling configs

## Entry Points and Routing

- App entry: Next.js App Router (app/ directory)
- Main pages:
  - /orders — shows latest ready orders
  - /admin/orders — admin dashboard to manage orders
- API routes:
  - GET /orders/api — latest ready orders (includes products)
  - GET /admin/orders/api — pending orders (includes products)

## Database

- Provider: postgresql (configured in prisma/schema.prisma)
- Migrations: managed by Prisma; output in db/migrations (via prisma.config.ts)
- Generate client: npm run prisma:generate
- Studio (GUI): npm run prisma:studio

## Development Notes

- Styling: Tailwind CSS v4
- Images: next/image with remotePatterns for res.cloudinary.com (see next.config.ts)
- Data fetching: SWR with refreshInterval for near real-time dashboards
- State: Zustand for client basket/order state
- Validation: Zod (where applicable)

## Deployment

- Next.js supports Node.js runtimes on many platforms (Vercel, etc.).
- TODO: Specify the intended deployment platform and any required build/runtime environment variables.

## Learn More

- Next.js Documentation: https://nextjs.org/docs
- Learn Next.js (tutorial): https://nextjs.org/learn

## License

This project is licensed under the MIT License. See the LICENSE file for details.

© 2025 Aarón Más Murro
