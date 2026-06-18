import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { getArticles } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Long-form writing from Jeff & Jourdan Johnson on marriage, faith, family, and finding freedom in Jesus.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-camel">The Journal</p>
      <h1 className="mt-3 font-display text-6xl text-midnight">Articles</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal">
        Longer reflections on the things we talk about on the podcast — marriage,
        faith, family, and the freedom we’ve found in Jesus.
      </p>

      {lead ? (
        <Link
          href={`/articles/${lead.slug}`}
          className="group relative mt-12 block rounded-3xl bg-midnight p-8 text-ivory-light transition-shadow hover:shadow-xl sm:p-12"
        >
          {/* Gold bracket frame — the brand lockup device */}
          <span
            aria-hidden
            className="absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-camel"
          />
          <span
            aria-hidden
            className="absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-camel"
          />
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="eyebrow text-camel">
                {lead.category || "Featured"}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ivory-light/60">
                Latest
              </span>
            </div>
            <h2 className="mt-4 font-display text-5xl text-ivory-light transition-colors group-hover:text-camel sm:text-6xl">
              {lead.title}
            </h2>
            {lead.excerpt ? (
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ivory-light/80">
                {lead.excerpt}
              </p>
            ) : null}
            <div className="mt-6 flex items-center justify-between">
              {lead.author ? (
                <p className="text-xs text-ivory-light/60">By {lead.author}</p>
              ) : (
                <span />
              )}
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-camel">
                Read the article →
              </span>
            </div>
          </div>
        </Link>
      ) : null}

      {rest.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
