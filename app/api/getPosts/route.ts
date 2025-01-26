import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 6;
  const skip = (page - 1) * perPage;

  try {
    // 投稿データを取得
    const posts = await prisma.post.findMany({
      where: {
        title: {
          contains: query, // 部分一致
          mode: "insensitive", // 大文字・小文字を区別しない
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: perPage,
    });

    // 合計投稿数を取得
    const totalPosts = await prisma.post.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    // レスポンスを返す
    return NextResponse.json({ posts, totalPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
