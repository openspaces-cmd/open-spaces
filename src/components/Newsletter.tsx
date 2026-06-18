import type { SiteSettings } from "@/sanity/queries";

export function Newsletter({
  newsletter,
  backgroundImageUrl,
}: {
  newsletter?: SiteSettings["newsletter"];
  backgroundImageUrl?: string | null;
}) {
  const heading = newsletter?.heading ?? "Stay Connected";
  const body =
    newsletter?.body ??
    "Sign up to receive emails from us on our journey and know what's available through this ministry.";

  return (
    <section className="relative overflow-hidden">
      {/* Desert band behind the card. Real photo via Sanity; warm sand gradient otherwise. */}
      <div
        className="absolute inset-x-0 bottom-0 top-28 bg-gradient-to-b from-steel/30 via-tan to-camel/40 bg-cover bg-center"
        style={
          backgroundImageUrl
            ? { backgroundImage: `url(${backgroundImageUrl})` }
            : undefined
        }
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-32 pt-12 lg:px-8">
        <div className="bg-ivory-light px-7 py-12 shadow-[0_24px_60px_-30px_rgba(29,37,45,0.5)] sm:px-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-4xl text-midnight sm:text-5xl">
                {heading}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal">
                {body}
              </p>
            </div>

            <form
              action={newsletter?.actionUrl || "#"}
              method="post"
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full border border-camel/40 bg-transparent px-4 py-3 text-sm text-midnight placeholder:text-stormy focus:border-camel focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full border border-camel/40 bg-transparent px-4 py-3 text-sm text-midnight placeholder:text-stormy focus:border-camel focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="self-start rounded-sm bg-camel px-8 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
