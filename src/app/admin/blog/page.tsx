import { requireAdminPage } from "@/lib/admin-access";
import React from "react";
import prisma from "@/lib/prisma";
import BlogClientContainer from "./BlogClientContainer";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdminPage();
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Date objects to strings/dates compatible with client serialization
  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt, // Next.js server components can pass Date objects if using standard JSON serialization, but we can safely pass it.
  }));

  return <BlogClientContainer initialPosts={serializedPosts} />;
}
