import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed text-charcoal">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-10 font-display text-3xl text-midnight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-8 font-display text-2xl text-midnight">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-camel pl-5 text-xl font-medium italic leading-snug text-midnight">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-5 list-disc space-y-2 text-charcoal marker:text-camel">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-5 list-decimal space-y-2 text-charcoal marker:text-camel">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="pl-1 leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="pl-1 leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-midnight">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="text-camel underline underline-offset-2 hover:text-midnight"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = value?.url || value?.asset?.url;
      if (!url) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={value?.alt || ""} className="w-full rounded-2xl" />
          {value?.caption ? (
            <figcaption className="mt-2 text-center font-mono text-[11px] uppercase tracking-widest text-stormy">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PortableText({ value }: { value: unknown }) {
  if (!value) return null;
  return (
    <PortableTextRenderer value={value as never} components={components} />
  );
}
