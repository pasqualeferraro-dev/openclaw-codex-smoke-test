"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type NavLink = {
  href: string;
  label: string;
};

const homeLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Featured" },
  { href: "/projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const projectsLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "#featured", label: "Featured" },
  { href: "#all-projects", label: "All Projects" },
];

type NavbarLinkProps = {
  link: NavLink;
  className: string;
  onNavigate?: () => void;
};

function NavbarLink({ link, className, onNavigate }: NavbarLinkProps) {
  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} className={className} onClick={onNavigate}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} className={className} onClick={onNavigate}>
      {link.label}
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const links = pathname === "/projects" ? projectsLinks : homeLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="rounded-md font-semibold tracking-tight text-slate-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:text-slate-100"
        >
          Pasquale
          <span className="text-ink-600 dark:text-ink-400">.dev</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => (
            <NavbarLink
              key={link.href}
              link={link}
              className="rounded-md text-sm text-slate-700 transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:text-slate-200 dark:hover:text-white"
            />
          ))}
        </nav>

        <button
          type="button"
          className="rounded-lg border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="border-t border-slate-200/60 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/60 md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
              {links.map((link) => (
                <NavbarLink
                  key={link.href}
                  link={link}
                  className="rounded-lg px-3 py-2 text-slate-800 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:text-slate-100 dark:hover:bg-white/10"
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
