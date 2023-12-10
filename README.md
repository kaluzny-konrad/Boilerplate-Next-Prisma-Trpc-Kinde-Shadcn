# Starter for Next.js app router with tRPC

This repo is example of app, which uses this stack:

- Next.js
- tRPC
- MySQL
- Prisma
- zod
- Kinde

## Getting started

TRPC:

1. Install dependencies
   `npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query zod`
2. Create files (based on https://github.com/K-Sikora/trpc-mysql-drizzle-nextjs-starter/tree/master)

- `src/server/trpc.ts` - creates TRPC (one per app) and defines middlewares
- `src/server/index.ts` - defined and exported router (query logics)
- `src/app/api/trpc/[trpc]/route.ts` - endpoint for trpc client
- `src/app/_trpc/client.ts` - client provider for Router
- `src/app/components/Providers.tsx` - provider for trpc and query client
- `src/app/layout.tsx` - layout for app (with Providers)
- `src/app/compoents/Component.tsx` - component with trpc query (with 'use client')
- `src/app/page.tsx` - page with inserted Component (can be server side rendered)
