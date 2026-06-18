import Link from "next/link";

// Official Open Spaces wordmark (bracketed lockup) — brand artwork from the
// design system, served from public/brand/.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Open Spaces home"
      className={`inline-flex items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/header-logo.png"
        alt="Open Spaces"
        width={483}
        height={108}
        className="h-7 w-auto sm:h-8"
      />
    </Link>
  );
}
