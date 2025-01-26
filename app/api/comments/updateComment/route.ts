import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id, content } = await request.json();

  try {
    await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "コメントの更新中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
