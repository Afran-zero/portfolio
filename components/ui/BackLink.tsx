import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * BackLink — the single "go back" affordance. Mono label, arrow nudges left on hover.
 */
export function BackLink({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "btn-press group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-dark hover:text-blue",
        className,
      )}
    >
      <ArrowLeft
        className="h-3.5 w-3.5 transition-transform duration-base ease-out group-hover:-translate-x-1"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}
