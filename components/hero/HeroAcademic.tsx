import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";
import type { Person, Research } from "@/lib/schemas";

type Props = {
  person: Person;
  research: Research;
};

/**
 * HeroAcademic — academic hero with more whitespace, outlined shape (not filled blue).
 * Reference: PLAN §26, D-008 (no portrait).
 */
export function HeroAcademic({ person, research }: Props) {
  const firstInterest = research.interests[0] ?? "Machine Learning";
  const secondInterest = research.interests[1] ?? "Quantum ML";
  return (
    <Section spacing="lg" className="overflow-hidden bg-blueprint">
      <Container width="narrow" className="relative z-10">
        <Eyebrow pulse>Academic</Eyebrow>
        <h1 className="mt-6 text-display font-medium leading-[0.98] tracking-tight text-fg">
          Academia.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
          {person.role.split("&")[1]?.trim() ?? "Researcher"} in
          {firstInterest.toLowerCase()}, {secondInterest.toLowerCase()},
          graph learning, and scientific AI.
        </p>
        <div className="mt-10">
          <Meta
            items={[
              person.location ?? "—",
              "Research collaboration",
              "MSc / PhD applications open",
            ]}
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            href="/media/cv/academic-cv.pdf"
            variant="primary"
            size="md"
            withArrow
          >
            Download Academic CV
          </Button>
        </div>
        <div
          aria-hidden="true"
          className="mt-16 h-px w-full bg-border"
        />
      </Container>
    </Section>
  );
}