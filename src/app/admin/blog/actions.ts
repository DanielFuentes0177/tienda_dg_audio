"use server";

import prisma from "@/lib/prisma";
import { sanitizePostHtml } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth-guard";

// Helper to slugify text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
}

interface PostInput {
  title: string;
  slug?: string;
  content: string;
  imageUrl?: string | null;
  published?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  coverImageAlt?: string | null;
  category?: string | null;
  authorName?: string;
  authorImage?: string | null;
  publishAt?: Date | null;
}

export async function createPost(data: PostInput) {
  await assertAdmin();
  try {
    let finalSlug = slugify(data.slug || data.title);
    if (!finalSlug) {
      finalSlug = `post-${Date.now()}`;
    }

    // Verify slug uniqueness
    const existing = await prisma.post.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: finalSlug,
        content: sanitizePostHtml(data.content ?? ""),
        imageUrl: data.imageUrl,
        published: data.published ?? false,
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || "",
        seoKeywords: data.seoKeywords || "",
        coverImageAlt: data.coverImageAlt || "",
        category: data.category,
        authorName: data.authorName || "DG Audio",
        authorImage: data.authorImage,
        publishAt: data.publishAt,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post };
  } catch (error: any) {
    console.error("Error creating post:", error);
    return { success: false, error: error.message || "Error al crear el artículo" };
  }
}

export async function updatePost(id: string, data: Partial<PostInput>) {
  await assertAdmin();
  try {
    let finalSlug = data.slug ? slugify(data.slug) : undefined;

    if (finalSlug) {
      // Check uniqueness of new slug (excluding itself)
      const existing = await prisma.post.findFirst({
        where: {
          slug: finalSlug,
          id: { not: id },
        },
      });

      if (existing) {
        finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    const currentPost = await prisma.post.findUnique({
      where: { id },
    });

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: finalSlug,
        content: sanitizePostHtml(data.content ?? ""),
        imageUrl: data.imageUrl,
        published: data.published,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        coverImageAlt: data.coverImageAlt,
        category: data.category,
        authorName: data.authorName,
        authorImage: data.authorImage,
        publishAt: data.publishAt,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${post.slug}`);
    if (currentPost && currentPost.slug !== post.slug) {
      revalidatePath(`/blog/${currentPost.slug}`);
    }
    return { success: true, post };
  } catch (error: any) {
    console.error("Error updating post:", error);
    return { success: false, error: error.message || "Error al actualizar el artículo" };
  }
}

export async function deletePost(id: string) {
  await assertAdmin();
  try {
    const post = await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message || "Error al eliminar el artículo" };
  }
}

export async function togglePublishPost(id: string, published: boolean) {
  await assertAdmin();
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published },
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post };
  } catch (error: any) {
    console.error("Error toggling post publish status:", error);
    return { success: false, error: error.message || "Error al actualizar el estado de publicación" };
  }
}
