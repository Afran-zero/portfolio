"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
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
 * DesktopNav — sticky top bar. Client component (reads pathname).
 *
 * Supports an optional `children` list per item — rendered as a hover /
 * focus-within popover anchored under the trigger. Used for the CV menu.
 */
export function DesktopNav({ brand }: Props) {
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border/60 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/70 md:block">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-widest text-fg transition-colors hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          aria-label="Home"
        >
          {brand}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 md:gap-2">
            {ITEMS.map((item) => {
              const active = isItemActive(pathname, item);
              if (hasChildren(item)) {
                return (
                  <li key={item.href} className="relative">
                    <div className="group relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "relative inline-flex h-10 items-center gap-1 px-3 font-mono text-xs uppercase tracking-widest transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
                          active ? "text-blue-dark" : "text-fg-muted hover:text-fg",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className="h-3 w-3 opacity-70 transition-transform duration-base ease-out group-hover:rotate-180 group-focus-within:rotate-180"
                        />
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-3 -bottom-0.5 h-px bg-blue"
                          />
                        )}
                      </Link>
                      <ul
                        role="menu"
                        className={cn(
                          "invisible absolute left-0 top-full z-50 mt-2 min-w-[200px] border border-border bg-bg py-1 shadow-sm",
                          "opacity-0 translate-y-1 transition-all duration-base ease-out",
                          "group-hover:visible group-hover:opacity-100 group-hover:translate-y-0",
                          "group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0",
                        )}
                      >
                        {item.children.map((child) => {
                          const childActive = isItemActive(pathname, child);
                          return (
                            <li key={child.href} role="none">
                              <Link
                                href={child.href}
                                role="menuitem"
                                className={cn(
                                  "block px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
                                  "focus-visible:outline-none focus-visible:bg-blue-50 focus-visible:text-blue-dark",
                                  childActive
                                    ? "text-blue-dark"
                                    : "text-fg-muted hover:bg-blue-50 hover:text-blue-dark",
                                )}
                                aria-current={childActive ? "page" : undefined}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex h-10 items-center px-3 font-mono text-xs uppercase tracking-widest transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
                      active ? "text-blue-dark" : "text-fg-muted hover:text-fg",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-blue"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}