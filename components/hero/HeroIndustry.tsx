import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Meta } from "@/components/ui/Meta";
import { ShapeBackground } from "@/components/shapes/ShapeBackground";
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
    <Section spacing="lg" className="overflow-hidden bg-blueprint">
      {/* Solid side panel with scroll parallax. */}
      <ShapeBackground
        variant="blue-rect"
        size={520}
        parallax
        parallaxAmount={24}
        className="pointer-events-none absolute right-16 top-[-40px] -z-10 h-[520px] w-[520px] opacity-100 md:right-24"
      />
      <Container>
        <Grid className="items-center">
          <div className="md:col-span-7">
            <Eyebrow pulse>Industry</Eyebrow>
            <h1 className="mt-4 text-display font-medium leading-[0.98] tracking-tight text-fg">
              AI engineering.
              <br />
              Full-stack development.
              <br />
              Data engineering.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
              {person.role}. Aselo extraction pipeline at The Data Island,
              Next.js 15 + Sanity for Farhana Afroz Foundation, STORE ERP.
            </p>
            <div className="mt-8">
              <Meta
                items={[person.location ?? "—", "Available for engineering work"]}
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
          </div>
        </Grid>
      </Container>
    </Section>
  );
}