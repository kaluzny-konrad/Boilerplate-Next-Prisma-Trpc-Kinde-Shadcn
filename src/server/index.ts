import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || !user.id || !user.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { isSuccess: true };
  }),
  getTest: publicProcedure.query(async () => {
    return "Test text from trpc server";
  }),
  getPublicAllMessages: publicProcedure.query(async () => {
    let messages = await db.message.findMany();
    return messages;
  }),
  getUserMessages: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    let messages = await db.message.findMany({
      where: { userId: userId },
    });
    return messages;
  }),
  getInfiniteQueryMessages: publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    })
  )
  .query(async ({ input }) => {
    const { cursor } = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;
    const messages = await db.message.findMany({
      orderBy: { createdAt: "desc" },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      select: {
        id: true,
        createdAt: true,
        text: true,
        userId: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    return {
      messages: messages,
      nextCursor,
    };
  }),
});

export type AppRouter = typeof appRouter;
