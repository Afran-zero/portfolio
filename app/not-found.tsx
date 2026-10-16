import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShapeBackground } from "@/components/shapes/ShapeBackground";

export default function NotFound() {
  return (
    <Section spacing="lg">
      <ShapeBackground
        variant="outlined-circle"
        size={300}
        className="pointer-events-none absolute right-1/4 top-12 -z-10 h-[300px] w-[300px] opacity-60"
      />
      <Container width="narrow">
        <div className="space-y-6">
          <Eyebrow>404</Eyebrow>
          <h1 className="text-display font-medium leading-none tracking-tight text-fg">
            This page doesn&apos;t exist.
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-dark hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back home
          </Link>
        </div>
      </Container>
    </Section>
  );
}