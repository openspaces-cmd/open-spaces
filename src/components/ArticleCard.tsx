import Link from "next/link";

import type { ArticleListItem } from "@/sanity/queries";

// Text-only journal card: a camel top rule, category/date, title, excerpt.
export function ArticleCard({ article }: { article: ArticleListItem }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-2xl border-t-2 border-camel bg-ivory-light p-6 ring-1 ring-tan/70 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        {article.category ? (
          <span className="eyebrow text-camel">{article.category}</span>
        ) : null}
        {date ? (
          <span className="font-mono text-[11px] uppercase tracking-widest text-stormy">
            {date}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-xl font-semibold leading-snug text-midnight transition-colors group-hover:text-camel">
        {article.title}
      </h3>
      {article.excerpt ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-charcoal">
          {article.excerpt}
        </p>
      ) : null}
      <div className="mt-auto flex items-center justify-between pt-4">
        {article.author ? (
          <p className="text-xs text-stormy">By {article.author}</p>
        ) : (
          <span />
        )}
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-camel">
          Read →
        </span>
      </div>
    </Link>
  );
}
