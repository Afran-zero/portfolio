import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
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
      <Container className="relative z-10">
        <Grid className="items-center">
          <div className="md:col-span-7">
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
          </div>

          {/* Right column — hero image + identity block (mirrors HeroIndustry) */}
          <div className="md:col-span-5">
            <figure className="flex flex-col items-center text-center">
              <img
                src="/images/research.svg"
                alt="Research illustration"
                className="h-auto w-full max-w-[360px]"
                loading="eager"
              />
              <figcaption className="mt-4 font-mono text-xs uppercase tracking-widest text-fg-muted">
                <p className="text-fg">{person.name}</p>
                <p className="mt-1">{person.role}</p>
                {person.location && <p className="mt-1">{person.location}</p>}
              </figcaption>
            </figure>
          </div>
        </Grid>
        <div
          aria-hidden="true"
          className="mt-16 h-px w-full bg-border"
        />
      </Container>
    </Section>
  );
}