import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedPosts = await prisma.post.findMany({
    where: {
      saves: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      user: {
        select: {
          displayName: true,
          username: true,
          img: true,
        },
      },
      _count: {
        select: {
          likes: true,
          rePosts: true,
          comments: true,
        },
      },
      likes: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
      rePosts: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
      saves: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ posts: savedPosts });
} 