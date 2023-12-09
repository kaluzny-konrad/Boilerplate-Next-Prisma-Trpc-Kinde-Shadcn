import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getTest: publicProcedure.query(async () => {
    return 'test'
  }),
});

export type AppRouter = typeof appRouter;