import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query.toLowerCase() } },
        { displayName: { contains: query.toLowerCase() } },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      img: true,
      bio: true,
    },
    take: 10,
  });

  return NextResponse.json({ users });
} 