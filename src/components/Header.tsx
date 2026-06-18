"use client";

import Link from "next/link";
import { useState } from "react";

import { Logo } from "./Logo";

type NavItem = { label: string; href: string };

export function Header({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-tan/60 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-[0.04em] text-midnight transition-colors hover:text-camel"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/give"
            className="hidden rounded-sm bg-camel px-6 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ivory-light transition-colors hover:bg-camel/85 sm:inline-block"
          >
            Give
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center md:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-midnight">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 7h18" strokeLinecap="round" />
                  <path d="M3 12h18" strokeLinecap="round" />
                  <path d="M3 17h18" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-tan/60 bg-ivory px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium tracking-[0.04em] text-midnight"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/give"
                onClick={() => setOpen(false)}
                className="eyebrow text-camel"
              >
                Give
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
