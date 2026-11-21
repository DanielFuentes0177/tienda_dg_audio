import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import styles from "./BlogPage.module.css";
import { Metadata } from "next";
import BlogControls from "@/components/organisms/BlogControls";

export const metadata: Metadata = {
  title: "Blog | DG AUDIOSOUND",
  description: "Últimas noticias, artículos y guías sobre audio profesional, amplificación y tecnología de redes.",
};

function stripHtml(html: string) {
  let text = html.replace(/<(div|p|br|h1|h2|h3|h4|h5|h6|li|blockquote)[^>]*>/gi, " ");
  text = text.replace(/<[^>]*>?/gm, "");
  return text.replace(/\s+/g, " ").trim();
}

export const revalidate = 60; // Revalidate page every 60 seconds

interface PageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams?.category;
  const currentSort = resolvedParams?.sort || "desc";

  // Determinar orden
  let orderByClause: any = [{ publishAt: 'desc' }, { createdAt: 'desc' }];
  if (currentSort === "asc") {
    orderByClause = [{ publishAt: 'asc' }, { createdAt: 'asc' }];
  } else if (currentSort === "az") {
    orderByClause = { title: 'asc' };
  } else if (currentSort === "za") {
    orderByClause = { title: 'desc' };
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { publishAt: null },
        { publishAt: { lte: new Date() } }
      ],
      ...(currentCategory ? { category: currentCategory } : {})
    },
    orderBy: orderByClause,
  });

  const categories = ["Noticias", "Reseñas", "Tutoriales", "Novedades", "Ofertas", "Equipos"];

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Nuestro <span className={styles.titleAccent}>Blog</span>
          </h1>
          <p className={styles.subtitle}>
            Explora nuestros últimos artículos, guías y noticias exclusivas sobre el mundo del audio profesional y la tecnología.
          </p>
        </div>
      </header>

      <div className={styles.container}>
        <BlogControls 
          categories={categories} 
          currentCategory={currentCategory} 
          currentSort={currentSort} 
        />

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>{currentCategory ? "No hay artículos en esta categoría" : "Próximamente"}</h2>
            <p className={styles.emptyText}>Estamos preparando contenido increíble. ¡Vuelve pronto!</p>
            {currentCategory && (
              <Link href="/blog" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>
                Ver todos los artículos
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => {
              const rawText = stripHtml(post.content);
              const excerpt = rawText.length > 150 ? rawText.substring(0, 150) + "..." : rawText;
              const postDate = post.publishAt ? new Date(post.publishAt) : new Date(post.createdAt);

              return (
                <Link href={`/blog/${post.slug}`} key={post.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.coverImageAlt || post.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <ImageIcon size={48} opacity={0.5} />
                      </div>
                    )}
                    {post.category && (
                      <div className={styles.categoryTag}>
                        {post.category}
                      </div>
                    )}
                  </div>
                  <div className={styles.content}>
                    <time className={styles.date}>
                      {format(postDate, "d 'de' MMMM, yyyy", { locale: es })}
                    </time>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    <p className={styles.excerpt}>{excerpt || "Lee más sobre este artículo en el post completo."}</p>
                    
                    <span className={styles.readMore}>
                      Leer artículo <ArrowRight size={18} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
