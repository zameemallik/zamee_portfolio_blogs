import {
  createRouter,
  authorizedUserProcedure,
  publicProcedure,
} from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import truncate from "html-truncate";

export const postRouter = createRouter({
  create: authorizedUserProcedure
    .input(
      z.object({
        title: z.string().min(1, "タイトルは必須です"),
        content: z.string().min(1, "本文は必須です"),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, content, published = false } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "ログインが必要です",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId: userId,
          postImgUrl: "", // TODO: 画像アップロード機能実装時に更新
          summary: truncate(content, 200), // 最初の200文字をサマリーとして使用
        },
      });
      return post;
    }),

  getPosts: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        page: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = input.query || "";
      const page = input.page || 1;
      const perPage = 6;
      const skip = (page - 1) * perPage;

      const posts = await ctx.prisma.post.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: perPage,
      });

      const totalPosts = await ctx.prisma.post.count({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
      });

      return { posts, totalPosts };
    }),

  getPostById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            select: {
              displayName: true,
              userImgUrl: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  displayName: true,
                  userImgUrl: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "投稿が見つかりません",
        });
      }

      return post;
    }),

  addComment: authorizedUserProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, content } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "ログインが必要です",
        });
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          content,
          postId,
          userId,
        },
        include: {
          user: {
            select: {
              displayName: true,
              userImgUrl: true,
            },
          },
        },
      });

      return comment;
    }),

  updateComment: authorizedUserProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, content } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "ログインが必要です",
        });
      }

      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "コメントが見つかりません",
        });
      }

      if (comment.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "このコメントを編集する権限がありません",
        });
      }

      const updatedComment = await ctx.prisma.comment.update({
        where: { id },
        data: { content },
        include: {
          user: {
            select: {
              displayName: true,
              userImgUrl: true,
            },
          },
        },
      });

      return updatedComment;
    }),

  deleteComment: authorizedUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "ログインが必要です",
        });
      }

      const comment = await ctx.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "コメントが見つかりません",
        });
      }

      if (comment.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "このコメントを削除する権限がありません",
        });
      }

      await ctx.prisma.comment.delete({
        where: { id },
      });

      return { success: true };
    }),
});
