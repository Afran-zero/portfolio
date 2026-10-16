import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps & {
  href?: undefined;
} & Omit<React.ComponentProps<"button">, keyof CommonProps | "href">;

type AsLink = CommonProps & {
  href: string;
} & Omit<React.ComponentProps<"a">, keyof CommonProps | "href">;

type Props = AsButton | AsLink;

const variantClasses: Record<Variant, string> = {
  primary: "bg-fg text-fg-on-dark hover:bg-fg/90",
  secondary:
    "border border-border bg-bg text-fg hover:bg-blue-50 hover:border-blue",
  ghost: "text-fg hover:underline underline-offset-4",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-xs",
  lg: "h-12 px-5 text-sm",
};

function classesFor(variant: Variant, size: Size, extra?: string): string {
  return cn(
    "group inline-flex items-center justify-center gap-2 font-medium transition-colors duration-base ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    sizeClasses[size],
    variantClasses[variant],
    extra,
  );
}

function arrow(): React.ReactNode {
  return (
    <ArrowRight
      className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-1"
      aria-hidden="true"
    />
  );
}

/**
 * Button — renders as <a> when href is provided, otherwise <button>.
 * Variants: primary (filled black), secondary (outlined), ghost (text only).
 *
 * Reference: skills/frontend §6.
 */
export function Button(props: Props) {
  const { variant = "secondary", size = "md", withArrow = false, className, children, ...rest } = props;
  const classes = classesFor(variant, size, className);
  const content = (
    <>
      {children}
      {withArrow && arrow()}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const linkProps = rest as unknown as React.ComponentProps<"a">;
    const isExternal = /^https?:\/\//.test(linkProps.href ?? "");
    return (
      <a
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps = rest as unknown as React.ComponentProps<"button">;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}