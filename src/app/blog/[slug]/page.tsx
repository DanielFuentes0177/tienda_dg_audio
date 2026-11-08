import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import "@/components/organisms/BlockEditor.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const keywords = post.seoKeywords 
    ? post.seoKeywords.split(',').map(k => k.trim())
    : [];

  return {
    title: post.seoTitle || `${post.title} | Blog`,
    description: post.seoDescription || post.content.substring(0, 160).replace(/[#*`_-]/g, ""),
    keywords,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || undefined,
      type: 'article',
      url: `https://dgaudiosound.com/blog/${post.slug}`,
      images: post.imageUrl ? [
        {
          url: post.imageUrl,
          alt: post.coverImageAlt || post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || undefined,
      images: post.imageUrl ? [post.imageUrl] : [],
    }
  };
}

export async function generateStaticParams() {
  // Sin DATABASE_URL en Preview no se deben consultar publicaciones durante el build.
  // En Production, con su base configurada, se preservan los slugs normales.
  if (!process.env.DATABASE_URL) return [];
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published || (post.publishAt && post.publishAt > new Date())) {
    notFound();
  }

  const relatedPosts = post.category ? await prisma.post.findMany({
    where: {
      category: post.category,
      published: true,
      id: { not: post.id },
      OR: [
        { publishAt: null },
        { publishAt: { lte: new Date() } }
      ],
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  }) : [];

  const postDate = post.publishAt ? new Date(post.publishAt) : new Date(post.createdAt);
  const formattedDate = postDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article style={{ maxWidth: "800px", margin: "2rem auto 4rem auto", padding: "0 1.5rem" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", paddingBottom: "1.5rem" }}>
        <div style={{ color: "var(--color-accent)", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          Blog / {post.category || "General"}
        </div>
        <h1 style={{ fontSize: "2.75rem", fontFamily: "var(--font-heading)", fontWeight: 700, lineHeight: 1.15, color: "var(--text-main)", marginBottom: "1rem" }}>
          {post.title}
        </h1>
        <div style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Publicado el {formattedDate}
        </div>
      </header>

      {post.imageUrl && (
        <div style={{ width: "100%", height: "auto", maxHeight: "450px", overflow: "hidden", borderRadius: "12px", marginBottom: "2rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt={post.coverImageAlt || post.title} style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
        </div>
      )}

      <div
        className="blog-content"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.1rem",
          lineHeight: "1.8",
          color: "var(--text-main)",
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {relatedPosts.length > 0 && (
        <section style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-main)" }}>Te podría interesar...</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {relatedPosts.map(rp => {
              const rpDate = rp.publishAt ? new Date(rp.publishAt) : new Date(rp.createdAt);
              return (
                <Link href={`/blog/${rp.slug}`} key={rp.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textDecoration: "none" }}>
                  {rp.imageUrl ? (
                    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "8px", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.05)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rp.imageUrl} alt={rp.title} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: "100%", paddingTop: "56.25%", borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                  )}
                  <h4 style={{ margin: "0.5rem 0 0 0", fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", lineHeight: 1.3 }}>{rp.title}</h4>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{rpDate.toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </article>
  );
}
