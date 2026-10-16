import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "outline-dark";
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

/** Light-surface variants. */
const variantClasses: Record<Variant, string> = {
  primary: "bg-fg text-fg-on-dark hover:bg-fg/90",
  secondary: "border border-border bg-bg text-fg hover:border-blue hover:bg-blue-50",
  ghost: "text-fg hover:text-blue-dark",
  // Dark-surface variants (contact bands, navy sections).
  inverse: "bg-fg-on-dark text-fg hover:bg-white/90",
  "outline-dark":
    "border border-fg-on-dark/30 bg-transparent text-fg-on-dark hover:border-fg-on-dark hover:bg-fg-on-dark/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-xs",
  lg: "h-12 px-5 text-sm",
};

function classesFor(variant: Variant, size: Size, extra?: string): string {
  return cn(
    "btn-press group inline-flex items-center justify-center gap-2 font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
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
 * All variants share the `btn-press` motion (see app/globals.css): a 1px
 * lift on hover and a slight press on click.
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
