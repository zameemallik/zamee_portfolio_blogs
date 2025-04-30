import { createRouter } from "../trpc";
import { postRouter } from "./post";

export const appRouter = createRouter({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
