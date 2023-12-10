# Starter for Next.js app router with tRPC

This repo is example of app, which uses this stack:

- Next.js
- tRPC
- Prisma
- zod
- Kinde
- axios
- shadcn-ui

## Getting started

### TRPC:

1. Install dependencies
   `npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query zod`

1. Create files (based on https://github.com/K-Sikora/trpc-mysql-drizzle-nextjs-starter/tree/master and https://www.youtube.com/watch?v=ucX2zXAZ1I0)

- `src/server/trpc.ts` - creates TRPC (one per app) and defines middlewares
- `src/server/index.ts` - defined and exported router (query logics)
- `src/app/api/trpc/[trpc]/route.ts` - endpoint for trpc client
- `src/app/_trpc/client.ts` - client provider for Router
- `src/app/components/Providers.tsx` - provider for trpc and query client
- `src/app/layout.tsx` - layout for app (with Providers)
- `src/app/compoents/Component.tsx` - component with trpc query (with 'use client')
- `src/app/page.tsx` - page with inserted Component (can be server side rendered)

### Prisma:

1. Init prisma:
   `npx prisma init`
1. Add to .gitignore:
   `.env`
1. Create Database by provider like Planetscale, Neon, etc.
1. Configure .env and schema.prisma by provider instructions
1. Make first entity
1. run `npx prisma db push`
1. run `npx prisma studio` to check if everything is ok
1. Create `src/db/index.ts` with PrismaClient

### Kinde (auth provider):

1. Create account kinde.com, then create project and go to Quick start
1. Install `npm i @kinde-oss/kinde-auth-nextjs`
1. Copy .env variables from kinde.com
1. Define KINDE_POST_LOGIN_REDIRECT_URL in .env
1. Create API endpoint `src/app/api/auth/[kindeAuth]/route.ts`

### Shadcn

1. `npx shadcn-ui@latest init`
2. install components

### Kinde middleware in trpc

1. Create middleware in `src/server/trpc.ts`