import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { PortableText } from "@/components/PortableText";
import { ShareButtons } from "@/components/ShareButtons";
import { siteUrl } from "@/lib/site";
import { getArticleBySlug, getArticles, getArticleSlugs } from "@/sanity/queries";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/articles/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

// Rough reading-time estimate from the Portable Text body.
function readingMinutes(body?: unknown[]): number {
  if (!Array.isArray(body)) return 0;
  let words = 0;
  for (const block of body as Array<Record<string, unknown>>) {
    const children = block?.children as Array<{ text?: string }> | undefined;
    if (Array.isArray(children)) {
      for (const c of children) words += (c.text || "").split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(1, Math.round(words / 200));
}

export default async function ArticlePage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const [article, all] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ]);

  if (!article) notFound();

  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const minutes = readingMinutes(article.body);
  const more = all.filter((a) => a.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: `${siteUrl}/articles/${article.slug}`,
    datePublished: article.publishedAt,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : undefined,
    publisher: { "@type": "Organization", name: "Open Spaces" },
    image: article.coverImageUrl || undefined,
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/articles"
        className="eyebrow text-charcoal transition-colors hover:text-camel"
      >
        ← All articles
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          {article.category ? (
            <span className="eyebrow text-camel">{article.category}</span>
          ) : null}
          {date ? (
            <span className="font-mono text-[11px] uppercase tracking-widest text-stormy">
              {date}
            </span>
          ) : null}
          <span className="font-mono text-[11px] uppercase tracking-widest text-stormy">
            {minutes} min read
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-midnight lg:text-5xl">
          {article.title}
        </h1>
        {article.author ? (
          <p className="mt-4 text-sm text-stormy">
            By {article.author}
            {article.authorRole ? (
              <span className="text-stormy/70"> · {article.authorRole}</span>
            ) : null}
          </p>
        ) : null}
      </header>

      <hr className="mt-8 border-t-2 border-camel/60" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mt-10 text-lg">
        <PortableText value={article.body} />
      </div>

      <div className="mt-10 border-t border-tan/70 pt-6">
        <ShareButtons title={article.title} path={`/articles/${article.slug}`} />
      </div>

      {more.length > 0 ? (
        <section className="mt-16 border-t border-tan/70 pt-10">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-midnight">Keep Reading</h2>
            <Link
              href="/articles"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-camel hover:text-midnight"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
