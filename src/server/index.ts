import { db } from "@/db";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getTest: publicProcedure.query(async () => {
    return "Test text from trpc server";
  }),
  getPublicAllMessages: publicProcedure.query(async () => {
    let messages = await db.message.findMany();
    return messages;
  }),
});

export type AppRouter = typeof appRouter;
