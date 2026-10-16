import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  /** "square" = cropped square (default). "portrait" = preserve aspect. */
  shape?: "square" | "portrait";
  priority?: boolean;
};

/**
 * AboutPhoto — wraps the real profile photo.
 * Unlike VectorPortrait (which desaturates a traced SVG), this shows the
 * photo as-is with only a subtle multiply overlay.
 */
export function AboutPhoto({
  src = "/images/profile/profile.webp",
  alt,
  className,
  shape = "square",
  priority = false,
}: Props) {
  const aspect = shape === "square" ? "aspect-square" : "aspect-[4/5]";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-border bg-blue-50",
        aspect,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(23,105,255,0.06) 0%, rgba(23,105,255,0) 60%, rgba(8,8,8,0.04) 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <Image
        src={src}
        alt={alt}
        width={shape === "square" ? 480 : 600}
        height={shape === "square" ? 480 : 750}
        sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 80vw"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="block h-full w-full object-cover"
      />
    </div>
  );
}