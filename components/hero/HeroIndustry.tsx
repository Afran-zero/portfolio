import { Container } from "@/components/layout/Container";
import { BentoCard } from "@/components/layout/BentoCard";
import { Grid } from "@/components/layout/Grid";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";
import { Download } from "lucide-react";
import type { Person } from "@/lib/schemas";

type Props = {
  person: Person;
};

/**
 * HeroIndustry — split 5/7 hero for the /industry page.
 * Reference: PLAN §16, D-008 (no portrait — signature element reserved for landing).
 * The blue shape reads --mx / --my from MouseShapeField and shifts subtly with the pointer.
 */
export function HeroIndustry({ person }: Props) {
  return (
    <Section spacing="sm" className="overflow-hidden">
      {/* Solid side panel with scroll parallax. */}
      <Container>
        <Grid className="items-center">
          <div className="md:col-span-7">
            <BentoCard tone="blueprint" brackets className="h-full">
            <Eyebrow pulse className="border border-blue/40 bg-white px-3 py-1.5 text-sm shadow-[0_0_18px_-4px_rgb(23_105_255/0.5)]">Industry</Eyebrow>
            <h1 className="mt-4 text-display font-medium leading-[0.98] tracking-tight text-fg">
              AI, data, and delivery.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg/80 md:text-xl">
              I build AI systems and data pipelines, and I bring a project management background to the work.
            </p>
            <div className="mt-8">
              <Meta
                items={[person.location ?? "", "Available for engineering work"]}
              />
              <div className="mt-6">
                <Button
                  href="/media/cv/industry-cv.pdf"
                  download="Md-Kaif-Afran-Khan-Industry-CV.pdf"
                  variant="secondary"
                  size="md"
                  className="bg-white"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Industry CV
                </Button>
              </div>
            </div>
            </BentoCard>
          </div>

          {/* Right column — hero image + identity block */}
          <div className="md:col-span-5">
            <figure className="flex flex-col items-center text-center">
              <img
                src="/images/office.png"
                alt="Industry illustration"
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
      </Container>
    </Section>
  );
}