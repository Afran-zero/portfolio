"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Leaf = { href: string; label: string };
type Item = Leaf | (Leaf & { children: Leaf[] });

const ITEMS: Item[] = [
  { href: "/", label: "Home" },
  { href: "/industry", label: "Industry" },
  { href: "/academic", label: "Academia" },
  {
    href: "/cv",
    label: "CV",
    children: [
      { href: "/cv/academic", label: "Academic CV" },
      { href: "/cv/industry", label: "Industry CV" },
      { href: "/cv/master", label: "Master CV" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

function hasChildren(item: Item): item is Leaf & { children: Leaf[] } {
  return "children" in item && Array.isArray(item.children);
}

function isItemActive(pathname: string, item: Leaf): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

type Props = {
  brand: string;
};

/**
 * MobileMenu — hamburger trigger + slide-down sheet.
 * Scroll-locks body when open. Esc closes. Tap on link closes.
 *
 * Items with `children` render as an accordion: a button toggles a nested
 * list of child links. Used for the CV menu.
 */
export function MobileMenu({ brand }: Props) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  // When the menu closes, collapse any expanded group so the next open
  // starts collapsed.
  useEffect(() => {
    if (!open) setOpenGroup(null);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/70 md:hidden">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-widest text-fg"
          onClick={() => setOpen(false)}
        >
          {brand}
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md border border-border",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
            "hover:bg-blue-50 hover:border-blue transition-colors",
          )}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Primary mobile"
        hidden={!open}
        className="border-t border-border/60"
      >
        <ul className="flex flex-col px-4 py-2">
          {ITEMS.map((item) => {
            const active = isItemActive(pathname, item);
            if (hasChildren(item)) {
              const isOpen = openGroup === item.href;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`mobile-group-${item.href}`}
                    onClick={() =>
                      setOpenGroup((cur) => (cur === item.href ? null : item.href))
                    }
                    className={cn(
                      "flex h-12 w-full items-center justify-between font-mono text-xs uppercase tracking-widest",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
                      active ? "text-blue-dark" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.label}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="inline-block h-1 w-1 rounded-full bg-blue"
                        />
                      )}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-base ease-out",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <ul
                    id={`mobile-group-${item.href}`}
                    hidden={!isOpen}
                    className="border-l border-border ml-2 pl-3 pb-2"
                  >
                    {item.children.map((child) => {
                      const childActive = isItemActive(pathname, child);
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex h-10 items-center font-mono text-micro uppercase tracking-widest",
                              childActive
                                ? "text-blue-dark"
                                : "text-fg-muted hover:text-fg",
                            )}
                            aria-current={childActive ? "page" : undefined}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-12 items-center font-mono text-xs uppercase tracking-widest",
                    active ? "text-blue-dark" : "text-fg-muted hover:text-fg",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}