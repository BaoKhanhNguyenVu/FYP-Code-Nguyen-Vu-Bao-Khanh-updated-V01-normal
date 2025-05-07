import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Post from "@/components/Post";

const BookmarksPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
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

  return (
    <div className="">
      <div className="px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray">
        <h1 className="pb-3 flex items-center border-b-4 border-iconBlue">Bookmarks</h1>
      </div>
      <div className="">
        {savedPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {savedPosts.length === 0 && (
          <div className="p-4 text-center text-textGray">
            You haven't saved any posts yet
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage; 