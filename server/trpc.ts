import { initTRPC, TRPCError } from "@trpc/server";
import { createServerClient } from "@supabase/ssr";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export const createTRPCContext = async () => {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    prisma,
    supabase,
    user,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createRouter = t.router;
export const publicProcedure = t.procedure;

export const authorizedUserProcedure = t.procedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "ログインが必要です",
      });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }
);
